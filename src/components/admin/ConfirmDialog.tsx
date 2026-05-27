"use client";

interface ConfirmDialogProps {
  cancelLabel?: string;
  confirmLabel?: string;
  description: string;
  isLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
  title: string;
  variant?: "danger" | "default";
}

export function ConfirmDialog({
  cancelLabel = "Cancelar",
  confirmLabel = "Confirmar",
  description,
  isLoading = false,
  onCancel,
  onConfirm,
  open,
  title,
  variant = "default",
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  const confirmClassName =
    variant === "danger"
      ? "bg-red-700 text-white hover:bg-red-800 disabled:hover:bg-red-700"
      : "bg-neutral-950 text-white hover:bg-neutral-800 disabled:hover:bg-neutral-950";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/45 px-6 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-lg border border-neutral-200 bg-white p-7 shadow-[0_28px_80px_rgba(0,0,0,0.22)]">
        <p className="section-label">Confirmacion</p>
        <h2 id="confirm-dialog-title" className="mt-4 font-title text-3xl font-medium text-neutral-950">
          {title}
        </h2>
        <p className="mt-5 text-sm leading-7 text-neutral-600">{description}</p>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="cursor-pointer border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:border-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`cursor-pointer px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${confirmClassName}`}
            disabled={isLoading}
            onClick={onConfirm}
          >
            {isLoading ? "Procesando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
