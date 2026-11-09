import { BriefcaseBusiness, Plus } from "lucide-react";
import { Button } from "../UI/Button";

export function EmptyState({ isFiltered = false, onClearFilter, onOpenCreate }) {
  return (
    <div className="empty-state-box">
      <div className="empty-icon-wrapper">
        <BriefcaseBusiness size={28} />
      </div>

      <h4 className="empty-title">
        {isFiltered ? "No matching applications" : "No applications yet"}
      </h4>

      <p className="empty-desc">
        {isFiltered
          ? "We couldn't find any job applications matching your current search or filter criteria."
          : "Start building your career pipeline by adding your first job application."}
      </p>

      {isFiltered ? (
        <Button variant="secondary" onClick={onClearFilter}>
          Reset filters
        </Button>
      ) : (
        <Button variant="primary" onClick={onOpenCreate}>
          <Plus size={16} />
          <span>Add first application</span>
        </Button>
      )}
    </div>
  );
}

