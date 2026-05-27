"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type ToastVariant = "error" | "info" | "success";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastInput {
  message: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  error: (message: string) => void;
  info: (message: string) => void;
  show: (toast: ToastInput) => void;
  success: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    ({ message, variant = "info" }: ToastInput) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((current) => [...current, { id, message, variant }]);
      window.setTimeout(() => dismiss(id), 3600);
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      error: (message) => show({ message, variant: "error" }),
      info: (message) => show({ message, variant: "info" }),
      show,
      success: (message) => show({ message, variant: "success" }),
    }),
    [show],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-5 top-5 z-[60] flex w-[calc(100vw-2.5rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={() => dismiss(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside AdminToastProvider.");
  }

  return context;
}

function ToastItem({
  onDismiss,
  toast,
}: {
  onDismiss: () => void;
  toast: Toast;
}) {
  const markerClassName = {
    error: "bg-red-700",
    info: "bg-neutral-400",
    success: "bg-neutral-950",
  }[toast.variant];

  return (
    <div className="flex items-start gap-4 border border-neutral-200 bg-white px-4 py-3 text-neutral-950 shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
      <span className={`mt-1 h-2.5 w-2.5 shrink-0 ${markerClassName}`} aria-hidden="true" />
      <p className="min-w-0 flex-1 text-sm leading-6 text-neutral-700">{toast.message}</p>
      <button
        type="button"
        className="cursor-pointer text-sm leading-6 text-neutral-400 transition hover:text-neutral-950"
        aria-label="Cerrar notificacion"
        onClick={onDismiss}
      >
        x
      </button>
    </div>
  );
}
