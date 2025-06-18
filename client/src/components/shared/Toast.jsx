import { useState, useEffect } from 'react';

let toastQueue = [];
let toastId = 0;
let updateToasts = () => {};

export function showToast(message, type = 'success') {
  const id = ++toastId;
  const toast = { id, message, type };
  toastQueue.push(toast);
  updateToasts();

  setTimeout(() => {
    toastQueue = toastQueue.filter(t => t.id !== id);
    updateToasts();
  }, 5000);
}

export function showConfirm(message) {
  return new Promise(resolve => {
    const id = ++toastId;
    const toast = {
      id,
      message,
      type: 'confirm',
      onConfirm: () => {
        toastQueue = toastQueue.filter(t => t.id !== id);
        updateToasts();
        resolve(true);
      },
      onCancel: () => {
        toastQueue = toastQueue.filter(t => t.id !== id);
        updateToasts();
        resolve(false);
      },
    };
    toastQueue.push(toast);
    updateToasts();
  });
}

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    updateToasts = () => setToasts([...toastQueue]);
    return () => {
      updateToasts = () => {};
    };
  }, []);

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.type === 'confirm' ? (
            <div className="toast-confirm">
              <div className="confirm-message">{toast.message}</div>
              <div className="confirm-actions">
                <button onClick={toast.onConfirm} className="confirm-btn">
                  Ja
                </button>
                <button onClick={toast.onCancel} className="cancel-btn">
                  Nee
                </button>
              </div>
            </div>
          ) : (
            toast.message
          )}
        </div>
      ))}
    </div>
  );
}
