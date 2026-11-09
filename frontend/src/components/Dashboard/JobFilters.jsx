export function JobFilters({
  statusFilter,
  onStatusChange,
  counts,
  totalFiltered,
}) {
  const tabs = [
    { key: "All", label: "All", count: counts.all },
    { key: "Applied", label: "Applied", count: counts.applied },
    { key: "Interview", label: "Interview", count: counts.interview },
    { key: "Offer", label: "Offer", count: counts.offers },
    { key: "Rejected", label: "Rejected", count: counts.rejected },
  ];

  return (
    <div className="jobs-panel-header">
      <div className="filter-tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={statusFilter === tab.key}
            className={`filter-tab ${statusFilter === tab.key ? "active" : ""}`}
            onClick={() => onStatusChange(tab.key)}
          >
            <span>{tab.label}</span>
            <span className="tab-badge">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="panel-meta">
        Showing <strong>{totalFiltered}</strong> application{totalFiltered === 1 ? "" : "s"}
      </div>
    </div>
  );
}

