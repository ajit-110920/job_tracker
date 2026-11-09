import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "../UI/Badge";
import { SkeletonRow } from "../UI/Skeleton";
import { EmptyState } from "./EmptyState";

function formatDate(dateStr) {
  if (!dateStr) return "No date";
  try {
    const [year, month, day] = dateStr.split("-");
    if (!year || !month || !day) return dateStr;
    const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function JobTable({
  jobs,
  loading = false,
  onEdit,
  onDelete,
  isFiltered,
  onClearFilter,
  onOpenCreate,
}) {
  if (loading) {
    return (
      <div style={{ overflowX: "auto" }}>
        <table className="job-table">
          <thead>
            <tr>
              <th>Role & Company</th>
              <th>Status</th>
              <th>Applied Date</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </tbody>
        </table>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <EmptyState
        isFiltered={isFiltered}
        onClearFilter={onClearFilter}
        onOpenCreate={onOpenCreate}
      />
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="job-table">
        <thead>
          <tr>
            <th>Role & Company</th>
            <th>Status</th>
            <th>Applied Date</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => {
            const initial = (job.company || "?").slice(0, 1).toUpperCase();
            return (
              <tr key={job.id}>
                <td>
                  <div className="company-cell">
                    <div className="company-logo" aria-hidden="true">
                      {initial}
                    </div>
                    <div>
                      <div className="role-title">{job.role}</div>
                      <div className="company-name">{job.company}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <Badge status={job.status} />
                </td>
                <td>
                  <span className="date-text">{formatDate(job.applied_date)}</span>
                </td>
                <td>
                  <div className="row-actions-group">
                    <button
                      type="button"
                      className="table-action-btn"
                      title="Edit application"
                      onClick={() => onEdit(job)}
                      aria-label={`Edit ${job.role} at ${job.company}`}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      className="table-action-btn delete-btn"
                      title="Delete application"
                      onClick={() => onDelete(job)}
                      aria-label={`Delete ${job.role} at ${job.company}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

