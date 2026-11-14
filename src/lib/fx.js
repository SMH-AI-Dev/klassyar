let ctx = null;
let muted = false;

if (typeof window !== "undefined") {
  muted = window.localStorage.getItem("vw_muted") === "1";
}

export function isMuted() {
  return muted;
}

export function setMuted(v) {
  muted = v;
  if (typeof window !== "undefined") window.localStorage.setItem("vw_muted", v ? "1" : "0");
}

function getCtx() {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq, dur, type = "sine", delay = 0, vol = 0.07) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sfx = {
  correct() {
    tone(660, 0.14, "triangle");
    tone(880, 0.2, "triangle", 0.1);
  },
  wrong() {
    tone(220, 0.22, "sawtooth", 0, 0.05);
    tone(160, 0.28, "sawtooth", 0.12, 0.05);
  },
  pop() {
    tone(520, 0.08, "square", 0, 0.05);
    tone(900, 0.1, "triangle", 0.04, 0.05);
  },
  flip() {
    tone(420, 0.07, "triangle", 0, 0.05);
  },
  click() {
    tone(600, 0.05, "sine", 0, 0.04);
  },
  spin() {
    for (let i = 0; i < 14; i++) tone(300 + i * 25, 0.05, "square", i * 0.28, 0.025);
  },
  win() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.25, "triangle", i * 0.14, 0.08));
  },
};