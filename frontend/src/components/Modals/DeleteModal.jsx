import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "../UI/Button";

export function DeleteModal({ isOpen, onClose, onConfirm, job, deleting = false }) {
  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !deleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, deleting, onClose]);

  if (!isOpen || !job) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !deleting) onClose();
      }}
    >
      <div className="modal-card" style={{ maxWidth: "440px" }} role="alertdialog" aria-modal="true">
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: "var(--danger-subtle)",
                color: "var(--danger)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <h3 className="modal-title" style={{ fontSize: "1.1rem" }}>Delete Application</h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={deleting}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ margin: 0, fontSize: "0.925rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            Are you sure you want to delete the application for{" "}
            <strong style={{ color: "var(--text-primary)" }}>{job.role}</strong> at{" "}
            <strong style={{ color: "var(--text-primary)" }}>{job.company}</strong>?
          </p>
          <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--text-muted)" }}>
            This action cannot be undone and will permanently remove this record from your workspace.
          </p>
        </div>

        <div className="modal-footer">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            loading={deleting}
          >
            Delete Application
          </Button>
        </div>
      </div>
    </div>
  );
}

