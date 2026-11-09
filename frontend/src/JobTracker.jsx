import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthScreen } from "./components/Auth/AuthScreen";
import { Sidebar } from "./components/Dashboard/Sidebar";
import { Header } from "./components/Dashboard/Header";
import { StatsGrid } from "./components/Dashboard/StatsGrid";
import { JobFilters } from "./components/Dashboard/JobFilters";
import { JobTable } from "./components/Dashboard/JobTable";
import { JobModal } from "./components/Modals/JobModal";
import { DeleteModal } from "./components/Modals/DeleteModal";
import { Toast } from "./components/UI/Toast";
import { api, fetchDashboardData } from "./api/client";

export default function JobTracker() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("jobtrack_theme") || "dark";
  });

  // Auth state
  const [token, setToken] = useState(() => {
    return localStorage.getItem("jobtrack_token");
  });

  // Dashboard data state
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interview: 0,
    offers: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("jobtrack_token")));
  const [dashboardError, setDashboardError] = useState("");

  // UI state
  const [activeNav, setActiveNav] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modals state
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [deletingJob, setDeletingJob] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    window.setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  // Sync theme with DOM and localStorage
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("jobtrack_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Logout handler
  const handleLogout = useCallback(() => {
    localStorage.removeItem("jobtrack_token");
    setToken(null);
    setJobs([]);
    setStats({ total: 0, applied: 0, interview: 0, offers: 0, rejected: 0 });
    setDashboardError("");
    setSearchQuery("");
    setStatusFilter("All");
    showToast("Successfully signed out", "info");
  }, [showToast]);

  // Load dashboard data (for programmatic refetch after operations)
  const refreshDashboard = useCallback(async () => {
    if (!token) return;
    try {
      const { jobData, statData } = await fetchDashboardData(token);
      setJobs(jobData);
      setStats(statData);
    } catch (err) {
      if (err.status === 401 || /authenticated|validate/i.test(err.message)) {
        handleLogout();
      } else {
        setDashboardError(err.message || "Failed to load dashboard data");
      }
    }
  }, [token, handleLogout]);

  // Initial load effect
  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function loadInitial() {
      try {
        const { jobData, statData } = await fetchDashboardData(token);
        if (!cancelled) {
          setJobs(jobData);
          setStats(statData);
          setDashboardError("");
        }
      } catch (err) {
        if (!cancelled) {
          if (err.status === 401 || /authenticated|validate/i.test(err.message)) {
            handleLogout();
          } else {
            setDashboardError(err.message || "Failed to load dashboard data");
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadInitial();

    return () => {
      cancelled = true;
    };
  }, [token, handleLogout]);

  // Auth success callback
  const handleAuthenticated = (newToken) => {
    localStorage.setItem("jobtrack_token", newToken);
    setToken(newToken);
    showToast("Welcome to JobTrack!", "success");
  };

  // Create / Edit modal openers
  const handleOpenCreate = () => {
    setEditingJob(null);
    setIsJobModalOpen(true);
  };

  const handleOpenEdit = (job) => {
    setEditingJob(job);
    setIsJobModalOpen(true);
  };

  // Save Job (Create or Update)
  const handleSaveJob = async (jobData) => {
    try {
      const isEditing = Boolean(jobData.id);
      const url = isEditing ? `/jobs/${jobData.id}` : "/jobs";
      const method = isEditing ? "PUT" : "POST";

      const payload = {
        company: jobData.company,
        role: jobData.role,
        status: jobData.status,
        applied_date: jobData.applied_date || null,
      };

      await api(url, { method, body: JSON.stringify(payload) }, token);

      setIsJobModalOpen(false);
      setEditingJob(null);
      showToast(isEditing ? "Application updated successfully" : "Application created successfully");
      await refreshDashboard();
    } catch (err) {
      showToast(err.message || "Failed to save application", "error");
      throw err;
    }
  };

  // Delete Job
  const handleDeleteClick = (job) => {
    setDeletingJob(job);
  };

  const handleConfirmDelete = async () => {
    if (!deletingJob) return;
    setIsDeleting(true);

    try {
      await api(`/jobs/${deletingJob.id}`, { method: "DELETE" }, token);
      showToast(`Deleted ${deletingJob.role} at ${deletingJob.company}`, "info");
      setDeletingJob(null);
      await refreshDashboard();
    } catch (err) {
      showToast(err.message || "Failed to delete application", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Tab count calculations
  const filterCounts = useMemo(() => {
    const counts = {
      all: jobs.length,
      applied: 0,
      interview: 0,
      offers: 0,
      rejected: 0,
    };

    jobs.forEach((j) => {
      const statusKey = (j.status || "").toLowerCase();
      if (statusKey === "applied") counts.applied++;
      else if (statusKey === "interview") counts.interview++;
      else if (statusKey === "offer") counts.offers++;
      else if (statusKey === "rejected") counts.rejected++;
    });

    return counts;
  }, [jobs]);

  // Filtered jobs list
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesStatus =
        statusFilter === "All" ||
        (job.status && job.status.toLowerCase() === statusFilter.toLowerCase());

      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        (job.company && job.company.toLowerCase().includes(query)) ||
        (job.role && job.role.toLowerCase().includes(query));

      return matchesStatus && matchesQuery;
    });
  }, [jobs, statusFilter, searchQuery]);

  // If user is not authenticated, show AuthScreen
  if (!token) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeNav}
        setActiveTab={setActiveNav}
        onLogout={handleLogout}
        totalJobs={jobs.length}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenCreate={handleOpenCreate}
          onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        />

        <main className="content-container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Career Pipeline</h1>
              <p className="page-subtitle">
                Track and manage every stage of your job opportunities.
              </p>
            </div>
          </div>

          {dashboardError && (
            <div className="auth-error-alert" style={{ marginBottom: "var(--space-6)" }}>
              <span>{dashboardError}</span>
            </div>
          )}

          {/* Stats Overview */}
          <StatsGrid stats={stats} loading={loading && jobs.length === 0} />

          {/* Applications Table Panel */}
          <section className="jobs-panel">
            <JobFilters
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              counts={filterCounts}
              totalFiltered={filteredJobs.length}
            />

            <JobTable
              jobs={filteredJobs}
              loading={loading && jobs.length === 0}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteClick}
              isFiltered={statusFilter !== "All" || Boolean(searchQuery.trim())}
              onClearFilter={() => {
                setStatusFilter("All");
                setSearchQuery("");
              }}
              onOpenCreate={handleOpenCreate}
            />
          </section>
        </main>
      </div>

      {/* Create / Edit Modal */}
      <JobModal
        isOpen={isJobModalOpen}
        onClose={() => {
          setIsJobModalOpen(false);
          setEditingJob(null);
        }}
        onSave={handleSaveJob}
        initialData={editingJob}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={Boolean(deletingJob)}
        onClose={() => setDeletingJob(null)}
        onConfirm={handleConfirmDelete}
        job={deletingJob}
        deleting={isDeleting}
      />

      {/* Toast Notification */}
      <Toast toast={toast} />
    </div>
  );
}
