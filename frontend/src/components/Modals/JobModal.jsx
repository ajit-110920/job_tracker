import { useState, useEffect } from "react";
import { X, Plus, Pencil } from "lucide-react";
import { Button } from "../UI/Button";

function JobModalForm({ onClose, onSave, initialData }) {
  const [formData, setFormData] = useState(() => ({
    company: initialData?.company || "",
    role: initialData?.role || "",
    status: initialData?.status || "Applied",
    applied_date: initialData?.applied_date || new Date().toISOString().split("T")[0],
  }));

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(initialData && initialData.id);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !submitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [submitting, onClose]);

  const validate = () => {
    const errs = {};
    if (!formData.company.trim()) {
      errs.company = "Company name is required";
    }
    if (!formData.role.trim()) {
      errs.role = "Role / job title is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSave({
        ...formData,
        company: formData.company.trim(),
        role: formData.role.trim(),
        applied_date: formData.applied_date || null,
        id: initialData?.id,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) onClose();
      }}
    >
      <div className="modal-card" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditing ? "Edit Application" : "New Application"}
          </h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="company" className="form-label">
                Company Name *
              </label>
              <input
                id="company"
                type="text"
                className="form-input"
                placeholder="e.g. Stripe, Linear, Google"
                value={formData.company}
                onChange={(e) => {
                  setFormData({ ...formData, company: e.target.value });
                  if (errors.company) setErrors({ ...errors, company: null });
                }}
                disabled={submitting}
                autoFocus
              />
              {errors.company && (
                <span className="form-field-error">{errors.company}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="role" className="form-label">
                Role / Title *
              </label>
              <input
                id="role"
                type="text"
                className="form-input"
                placeholder="e.g. Senior Frontend Engineer"
                value={formData.role}
                onChange={(e) => {
                  setFormData({ ...formData, role: e.target.value });
                  if (errors.role) setErrors({ ...errors, role: null });
                }}
                disabled={submitting}
              />
              {errors.role && (
                <span className="form-field-error">{errors.role}</span>
              )}
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  id="status"
                  className="form-select"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  disabled={submitting}
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="applied_date" className="form-label">
                  Applied Date
                </label>
                <input
                  id="applied_date"
                  type="date"
                  className="form-input"
                  value={formData.applied_date}
                  onChange={(e) =>
                    setFormData({ ...formData, applied_date: e.target.value })
                  }
                  disabled={submitting}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
            >
              {isEditing ? <Pencil size={16} /> : <Plus size={16} />}
              {isEditing ? "Save Changes" : "Create Application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function JobModal({ isOpen, onClose, onSave, initialData }) {
  if (!isOpen) return null;
  return (
    <JobModalForm
      key={initialData?.id || "new-job"}
      onClose={onClose}
      onSave={onSave}
      initialData={initialData}
    />
  );
}
