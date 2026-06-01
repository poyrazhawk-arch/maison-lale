/**
 * send.js — Baileys tabanlı WhatsApp mesaj gönderici
 * Chrome gerektirmez, otomatik yeniden bağlanır, session kaydeder.
 *
 * Kullanım:
 *   node send.js --input data/salonlar.csv --limit 40
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');
const pino = require('pino');
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

// --- Ayarlar ---
const CONFIG = {
    inputFile:   process.argv[3] || 'data/salonlar.csv',
    limit:       parseInt(process.argv[5]) || 15,
    delayMin:    90,
    delayMax:    180,
    baseDemoUrl: 'https://maison-lale.vercel.app',
    senderName:  'Ahmet',
    agencyName:  'Nixt Ajansı',
    authDir:     'data/auth',
};

// --- Mesaj şablonları ---
function generateMessage(name, city, demoUrl) {
    const shortName = name.split(/[|\-–]/)[0].trim().slice(0, 40);
    const templates = [
        `Merhaba! ${shortName} sayfanızı inceledim, çok güzel çalışmalarınız var 🙏\n\n${city}'deki salonunuz için bir demo web sitesi hazırladım. Randevu sistemi ve WhatsApp entegrasyonu dahil.\n\n👉 ${demoUrl}\n\n⚠️ Not: Sitedeki hizmetler ve fiyatlar şu an örnek. Siz alırsanız kendi hizmetleriniz, fiyatlarınız ve fotoğraflarınızla tamamen güncelliyoruz.\n\n${CONFIG.senderName} — ${CONFIG.agencyName}`,

        `Merhaba! ${city}'de güzellik salonu araştırırken ${shortName}'e denk geldim.\n\nSizin için hazır bir web sitesi demo'su var — ücretsiz gösterebilirim 😊\n\nMüşterileriniz WhatsApp'tan randevu alabilsin diye tasarladım.\n\n👉 ${demoUrl}\n\n📌 Sitedeki içerikler örnek amaçlı. Gerçek hizmetleriniz, fiyatlarınız ve fotoğraflarınızla özelleştiriyoruz.\n\n${CONFIG.senderName} — ${CONFIG.agencyName}`,

        `Merhaba! ${shortName} için küçük bir sürprizim var 🎁\n\nSalonunuza özel bir web sitesi tasarladım. Beğenirseniz konuşuruz!\n\nWhatsApp randevu sistemi dahil 👇\n${demoUrl}\n\n💡 Hizmetler ve fiyatlar şu an demo içerik — sizi alırsak her şey sizin bilgilerinizle güncellenir.\n\n${CONFIG.senderName}`,
    ];
    return templates[Math.floor(Math.random() * templates.length)];
}

// --- Telefonu Baileys formatına çevir ---
function formatPhone(phone) {
    let cleaned = String(phone).replace(/[\s\-\(\)\+]/g, '');
    if (cleaned.startsWith('90') && cleaned.length === 12) return cleaned + '@s.whatsapp.net';
    if (cleaned.startsWith('0')) return '90' + cleaned.slice(1) + '@s.whatsapp.net';
    if (cleaned.length === 10) return '90' + cleaned + '@s.whatsapp.net';
    return cleaned + '@s.whatsapp.net';
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

// --- Mesaj gönderme döngüsü ---
async function sendMessages(sock) {
    const allLeads = await loadLeads(CONFIG.inputFile);
    const sent     = loadSent();
    const pending  = allLeads.filter(l => !sent.has(l.phone));

    logger.info(`Toplam: ${allLeads.length} | Bekleyen: ${pending.length} | Limit: ${CONFIG.limit}`);

    let count = 0;
    for (const lead of pending) {
        if (count >= CONFIG.limit) {
            logger.info(`Limit doldu (${CONFIG.limit}). Yarın devam et.`);
            break;
        }

        try {
            const jid     = formatPhone(lead.phone);
            const slug    = toSlug(lead.name);
            const demoUrl = `${CONFIG.baseDemoUrl}/${slug}`;
            const message = generateMessage(lead.name, lead.city, demoUrl);

            await sock.sendMessage(jid, { text: message });

            sent.add(lead.phone);
            saveSent(sent);
            count++;

            logger.info(`✅ (${count}/${CONFIG.limit}) ${lead.name} — ${lead.phone}`);

            const delay = (CONFIG.delayMin + Math.random() * (CONFIG.delayMax - CONFIG.delayMin)) * 1000;
            logger.info(`⏳ ${Math.round(delay / 1000)}sn bekleniyor...`);
            await new Promise(r => setTimeout(r, delay));

        } catch (err) {
            const msg = err.message || '';
            logger.error(`❌ Hata (${lead.phone}): ${msg}`);

            if (msg.includes('Connection Closed') || msg.includes('timed out') || msg.includes('Stream Errored')) {
                logger.error('Bağlantı koptu, yeniden bağlanılıyor...');
                return false; // reconnect sinyali
            }
            if (msg.includes('No LID') || msg.includes('not a user') || msg.includes('invalid wid') || msg.includes('Bad Request')) {
                logger.warn(`⚠️ WhatsApp yok, atlanıyor: ${lead.phone}`);
                continue;
            }
            await new Promise(r => setTimeout(r, 5000));
        }
    }

    logger.info(`\n📊 Bitti: ${count} mesaj gönderildi. Toplam: ${sent.size}`);
    return true; // tamamlandı
}

// --- Ana bağlantı (otomatik yeniden bağlanır) ---
let isRunning = false;

async function connectAndSend() {
    fs.mkdirSync(CONFIG.authDir, { recursive: true });
    fs.mkdirSync('data', { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(CONFIG.authDir);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        browser: ['Chrome (Linux)', 'Chrome', '120.0.0.0'],
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
        if (qr) {
            console.log('\n📱 WhatsApp\'ı aç → Bağlı Cihazlar → QR Kodu Tara:\n');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            isRunning = false;
            const statusCode = (lastDisconnect?.error instanceof Boom)
                ? lastDisconnect.error.output.statusCode
                : 0;

            if (statusCode === DisconnectReason.loggedOut) {
                logger.error('Oturum kapandı. Auth siliniyor, QR ile yeniden giriş yap.');
                fs.rmSync(CONFIG.authDir, { recursive: true, force: true });
                setTimeout(connectAndSend, 3000);
            } else {
                logger.warn('Bağlantı koptu, 5sn sonra yeniden bağlanıyor...');
                setTimeout(connectAndSend, 5000);
            }
        }

        if (connection === 'open' && !isRunning) {
            isRunning = true;
            logger.info('WhatsApp hazır!');
            const done = await sendMessages(sock);
            if (done) {
                await sock.logout();
                process.exit(0);
            }
        }
    });
}

connectAndSend().catch(console.error);
