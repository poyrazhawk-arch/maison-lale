const VOICELESS = new Set(['p', 'ç', 't', 'k', 'f', 'h', 's', 'ş']);

export function locative(word: string): string {
  const lower = word.toLowerCase().replace(/İ/g, 'i').replace(/I/g, 'ı');
  let lastVowel = 'a';
  for (let i = lower.length - 1; i >= 0; i--) {
    if ('aeıioöuü'.includes(lower[i])) { lastVowel = lower[i]; break; }
  }
  const isBack = 'aıou'.includes(lastVowel);
  const isVoiceless = VOICELESS.has(lower[lower.length - 1]);
  return `'${isVoiceless ? 't' : 'd'}${isBack ? 'a' : 'e'}`;
}
