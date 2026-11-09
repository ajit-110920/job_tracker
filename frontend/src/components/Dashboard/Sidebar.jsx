import {
  BriefcaseBusiness,
  LayoutDashboard,
  LogOut,
  X,
  User,
} from "lucide-react";

export function Sidebar({
  activeTab = "dashboard",
  setActiveTab,
  onLogout,
  totalJobs = 0,
  mobileOpen = false,
  onCloseMobile,
}) {
  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div>
          <div className="sidebar-header">
            <a href="#dashboard" className="brand-logo" onClick={onCloseMobile}>
              <div className="brand-icon-box">
                <BriefcaseBusiness size={18} />
              </div>
              <span>JobTrack</span>
            </a>
            {mobileOpen && (
              <button
                type="button"
                className="icon-btn"
                onClick={onCloseMobile}
                style={{ width: "30px", height: "30px" }}
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <nav className="sidebar-nav">
            <button
              type="button"
              className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("dashboard");
                if (onCloseMobile) onCloseMobile();
              }}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              className={`nav-item ${activeTab === "applications" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("applications");
                if (onCloseMobile) onCloseMobile();
              }}
            >
              <BriefcaseBusiness size={18} />
              <span>Applications</span>
              {totalJobs > 0 && (
                <span className="nav-item-count">{totalJobs}</span>
              )}
            </button>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile-badge">
            <div className="user-avatar">
              <User size={16} />
            </div>
            <div className="user-meta">
              <span className="user-name">Candidate</span>
              <span className="user-status">Workspace Active</span>
            </div>
          </div>

          {/* Clearly visible logout button */}
          <button
            type="button"
            className="logout-button"
            onClick={onLogout}
            title="Log out of your account"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}

