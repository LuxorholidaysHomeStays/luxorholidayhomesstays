let toastIdCounter = 0;

export const showToast = (message, type = 'success', duration = 2500) => {
  const id = ++toastIdCounter;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('luxor:toast', {
      detail: {
    id,
    message: typeof message === 'string' ? message : (message?.message || message?.text || 'Notification'),
    type,
    duration: Math.min(Math.max(duration, 2000), 3000), // Enforce 2-3 seconds
      }
    }));
  }
};

export const toast = {
  success: (msg, duration = 2500) => showToast(msg, 'success', duration),
  error: (msg, duration = 2500) => showToast(msg, 'error', duration),
  info: (msg, duration = 2500) => showToast(msg, 'info', duration),
  warning: (msg, duration = 2500) => showToast(msg, 'warning', duration),
};

export default toast;
