import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export function Toast({ toast }) {
  if (!toast || !toast.message) return null;

  const isError = toast.type === "error";
  const Icon = isError ? AlertCircle : toast.type === "info" ? Info : CheckCircle2;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className={`toast-pill ${isError ? "toast-error" : "toast-success"}`}>
        <Icon size={18} aria-hidden="true" />
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

