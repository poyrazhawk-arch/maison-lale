/**
 * send.js — CSV'deki güzellik salonlarına otomatik WhatsApp mesajı gönderir.
 *
 * Kullanım:
 *   node send.js --limit 15
 *   node send.js --input data/salonlar.csv --limit 20
 */

const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const csv = require('csv-parser');
const winston = require('winston');

// --- Logger ---
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) =>
            `${timestamp} [${level.toUpperCase()}] ${message}`
        )
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'data/outreach.log' })
    ]
});

// --- Ayarlar (buradan düzenle) ---
const CONFIG = {
    inputFile:   process.argv[3] || 'data/salonlar.csv',
    limit:       parseInt(process.argv[5]) || 15,
    delayMin:    90,    // saniye — çok düşük tutma, ban yiyersin
    delayMax:    180,
    // Her salon için demo linki: nixtagency.com/SALON-SLUG formatında üret
    baseDemoUrl: 'https://maison-lale.vercel.app',  // ✅ canlı
    senderName:  'Ahmet',
    agencyName:  'Nixt Ajansı',
};

// --- Mesaj şablonları (3 farklı — spam filtresi için) ---
function generateMessage(name, city, demoUrl) {
    // Salon adını kısalt (uzun isimler var CSV'de)
    const shortName = name.split(/[|\-–]/)[0].trim().slice(0, 40);

    const templates = [
        `Merhaba! ${shortName} sayfanızı inceledim, çok güzel çalışmalarınız var 🙏\n\n${city}'deki salonunuz için bir demo web sitesi hazırladım. Randevu sistemi ve WhatsApp entegrasyonu dahil.\n\n👉 ${demoUrl}\n\n⚠️ Not: Sitedeki hizmetler ve fiyatlar şu an örnek. Siz alırsanız kendi hizmetleriniz, fiyatlarınız ve fotoğraflarınızla tamamen güncelliyoruz.\n\n${CONFIG.senderName} — ${CONFIG.agencyName}`,

        `Merhaba! ${city}'de güzellik salonu araştırırken ${shortName}'e denk geldim.\n\nSizin için hazır bir web sitesi demo'su var — ücretsiz gösterebilirim 😊\n\nMüşterileriniz WhatsApp'tan randevu alabilsin diye tasarladım.\n\n👉 ${demoUrl}\n\n📌 Sitedeki içerikler örnek amaçlı. Gerçek hizmetleriniz, fiyatlarınız ve fotoğraflarınızla özelleştiriyoruz.\n\n${CONFIG.senderName} — ${CONFIG.agencyName}`,

        `Merhaba! ${shortName} için küçük bir sürprizim var 🎁\n\nSalonunuza özel bir web sitesi tasarladım. Beğenirseniz konuşuruz!\n\nWhatsApp randevu sistemi dahil 👇\n${demoUrl}\n\n💡 Hizmetler ve fiyatlar şu an demo içerik — sizi alırsak her şey sizin bilgilerinizle güncellenir.\n\n${CONFIG.senderName}`,
    ];

    return templates[Math.floor(Math.random() * templates.length)];
}

// --- Telefonu WhatsApp formatına çevir ---
function formatPhone(phone) {
    let cleaned = String(phone).replace(/[\s\-\(\)\+]/g, '');
    if (cleaned.startsWith('90') && cleaned.length === 12) return cleaned + '@c.us';
    if (cleaned.startsWith('0')) return '90' + cleaned.slice(1) + '@c.us';
    if (cleaned.length === 10) return '90' + cleaned + '@c.us';
    return cleaned + '@c.us';
}

// --- Salon adından URL slug üret ---
function toSlug(name) {
    return name
        .toLowerCase()
        .replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g')
        .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ı/g, 'i').replace(/İ/g, 'i')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// --- CSV yükle ---
function loadLeads(filePath) {
    return new Promise((resolve, reject) => {
        const leads = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                const phone = row.phone || row.telefon || row.phone_unformatted;
                if (phone && phone.trim()) {
                    leads.push({
                        phone: phone.trim(),
                        name:  row.title || row.name || row.isim || 'Güzellik Salonu',
                        city:  row.city  || row.sehir || 'İstanbul',
                    });
                }
            })
            .on('end', () => resolve(leads))
            .on('error', reject);
    });
}

// --- Gönderilen listesi ---
function loadSent() {
    try { return new Set(JSON.parse(fs.readFileSync('data/sent.json', 'utf8'))); }
    catch { return new Set(); }
}

function saveSent(set) {
    fs.mkdirSync('data', { recursive: true });
    fs.writeFileSync('data/sent.json', JSON.stringify([...set], null, 2));
}

// --- Ana akış ---
async function main() {
    const client = new Client({
        authStrategy: new LocalAuth({ clientId: 'nixt-outreach' }),
        puppeteer: {
            headless: true,
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    client.on('qr', (qr) => {
        console.log('\n📱 WhatsApp\'ı aç → Bağlı Cihazlar → QR Kodu Tara:\n');
        qrcode.generate(qr, { small: true });
    });

    await new Promise((resolve) => {
        client.on('ready', () => { logger.info('WhatsApp hazır!'); resolve(); });
        client.initialize();
    });

    const allLeads = await loadLeads(CONFIG.inputFile);
    const sent     = loadSent();
    const pending  = allLeads.filter(l => !sent.has(l.phone));

    logger.info(`Toplam: ${allLeads.length} | Bekleyen: ${pending.length} | Bugünkü limit: ${CONFIG.limit}`);

    let count = 0;

    for (const lead of pending) {
        if (count >= CONFIG.limit) {
            logger.info(`Limit doldu (${CONFIG.limit}). Yarın devam et.`);
            break;
        }

        try {
            const chatId  = formatPhone(lead.phone);
            const slug    = toSlug(lead.name);
            const demoUrl = `${CONFIG.baseDemoUrl}/${slug}`;
            const message = generateMessage(lead.name, lead.city, demoUrl);

            await client.sendMessage(chatId, message);

            sent.add(lead.phone);
            saveSent(sent);
            count++;

            logger.info(`✅ (${count}/${CONFIG.limit}) ${lead.name} — ${lead.phone}`);

            const delay = (CONFIG.delayMin + Math.random() * (CONFIG.delayMax - CONFIG.delayMin)) * 1000;
            logger.info(`⏳ ${Math.round(delay / 1000)}sn bekleniyor...`);
            await new Promise(r => setTimeout(r, delay));

        } catch (err) {
            logger.error(`❌ Hata (${lead.phone}): ${err.message}`);
            if (err.message.includes('detached Frame') || err.message.includes('Session closed') || err.message.includes('Target closed')) {
                logger.error('Bağlantı koptu. Script durduruluyor — yeniden başlat.');
                break;
            }
            if (err.message.includes('No LID') || err.message.includes('not a user') || err.message.includes('invalid wid')) {
                logger.warn(`⚠️ WhatsApp yok, atlanıyor: ${lead.phone}`);
                continue;
            }
            await new Promise(r => setTimeout(r, 15000));
        }
    }

    logger.info(`\n📊 Bitti: ${count} mesaj gönderildi. Toplam gönderilen: ${sent.size}`);
    await client.destroy();
}

main().catch(console.error);
