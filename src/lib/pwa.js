const SW_PATH = "/sw.js";

export function registerSW() {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", async () => {
    try {
      const reg = await navigator.serviceWorker.register(SW_PATH, { scope: "/" });
      console.log("SW registered:", reg.scope);

      reg.addEventListener("updatefound", () => {
        const newSW = reg.installing;
        newSW.addEventListener("statechange", () => {
          if (newSW.state === "installed" && navigator.serviceWorker.controller) {
            showUpdateToast(reg);
          }
        });
      });

      checkForUpdates(reg);
    } catch (err) {
      console.error("SW registration failed:", err);
    }
  });
}

function showUpdateToast(reg) {
  const toast = document.createElement("div");
  toast.id = "pwa-update-toast";
  toast.style.cssText = `
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    z-index: 9999; background: linear-gradient(135deg, #a855f7, #ec4899);
    color: white; padding: 16px 24px; border-radius: 16px;
    box-shadow: 0 8px 32px rgba(168,85,247,0.3);
    display: flex; align-items: center; gap: 12px;
    font-family: Vazirmatn, sans-serif; direction: rtl;
    animation: slideUp 0.4s ease; cursor: pointer;
    max-width: 90vw;
  `;
  toast.innerHTML = `
    <span>🚀 نسخه جدید در دسترس است</span>
    <button id="pwa-update-btn" style="
      background: white; color: #7c3aed; border: none;
      padding: 8px 20px; border-radius: 10px; font-weight: bold;
      cursor: pointer; font-family: inherit;
    ">بروزرسانی</button>
  `;
  document.body.appendChild(toast);

  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
    #pwa-update-btn:hover { opacity: 0.9; }
  `;
  document.head.appendChild(style);

  document.getElementById("pwa-update-btn").onclick = () => {
    reg.waiting.postMessage({ type: "SKIP_WAITING" });
    window.location.reload();
  };
}

async function checkForUpdates(reg) {
  if (!navigator.onLine) return;

  setInterval(async () => {
    if (!navigator.onLine) return;
    try {
      await reg.update();
    } catch {}
  }, 1000 * 60 * 30);
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });
}
