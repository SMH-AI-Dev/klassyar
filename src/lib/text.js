const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const AR_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export const LETTER_RE = /[\u0621-\u063A\u0641-\u064A\u067E\u0686\u0698\u06A9\u06AF\u06CC\u06C0a-zA-Z]/;

/** Normalise Persian / Arabic text so that answers can be compared fairly. */
export function norm(s) {
  return s
    .replace(/[\u200c\u200f\u200e\s]/g, "")
    .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(AR_DIGITS.indexOf(d)))
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u064B-\u0652]/g, "")
    .replace(/[آأإ]/g, "ا")
    .replace(/ة/g, "ه")
    .toLowerCase();
}

export function isLetter(ch) {
  return LETTER_RE.test(ch);
}

export function letterCount(s) {
  return Array.from(s).filter(isLetter).length;
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sample(arr, n) {
  return shuffle(arr).slice(0, n);
}

export function fa(n) {
  return Number.isFinite(n) ? n.toLocaleString("fa-IR") : "۰";
}

export function dateFa(iso) {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Tehran",
  }).format(d);
}

export function weekdayFa(d) {
  return new Intl.DateTimeFormat("fa-IR", { weekday: "short", timeZone: "Asia/Tehran" }).format(d);
}

export function mmss(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${fa(m)}:${s.toLocaleString("fa-IR", { minimumIntegerDigits: 2 })}`;
}

export function pct(score, total) {
  return total > 0 ? Math.round((score / total) * 100) : 0;
}