// Compatibility layer for sonner toast
export const toast = {
  success: (message) => {
    if (window.toastAdd) window.toastAdd(message, 'success');
  },
  error: (message) => {
    if (window.toastAdd) window.toastAdd(message, 'error');
  },
  info: (message) => {
    if (window.toastAdd) window.toastAdd(message, 'info');
  },
};
