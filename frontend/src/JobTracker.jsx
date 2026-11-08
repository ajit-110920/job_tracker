import { useCallback, useEffect, useState } from "react";
import { Bell, BriefcaseBusiness, CheckCircle2, LayoutDashboard, LoaderCircle, Moon, Pencil, Plus, Search, Settings, Sun, Trash2, X } from "lucide-react";

const emptyJob = { company: "", role: "", status: "Applied", applied_date: "" };

function ManagementPanel({ theme, setTheme, query, setQuery, statusFilter, setStatusFilter, stats, jobs, loading, error, toast, openCreate, openEdit, removeJob, modalOpen, draft, setDraft, saveJob, closeModal }) {
  const filtered = jobs.filter((job) => (statusFilter === "All" || job.status === statusFilter) && `${job.company} ${job.role}`.toLowerCase().includes(query.toLowerCase()));
  const cards = [["Total applications", stats.total], ["In progress", stats.interview], ["Offers received", stats.offers]];
  return <div className="app-shell"><aside className="sidebar"><a className="brand" href="#dashboard"><span className="brand-mark"><BriefcaseBusiness size={20} /></span><span>JobTrack</span></a><nav className="nav-menu"><a className="nav-link nav-link-active" href="#dashboard"><LayoutDashboard size={19} />Dashboard</a><a className="nav-link" href="#applications"><BriefcaseBusiness size={19} />Applications</a><a className="nav-link" href="#settings"><Settings size={19} />Settings</a></nav></aside><main className="main-content"><header className="topbar"><label className="search-box"><Search size={18} /><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search applications..." /></label><div className="topbar-actions"><button className="icon-button" type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}</button><button className="icon-button" type="button"><Bell size={19} /></button><button className="add-job-button" type="button" onClick={openCreate}><Plus size={19} />Add job</button></div></header><section className="page-heading" id="dashboard"><div><p className="eyebrow">OVERVIEW</p><h1>Your job search, organized.</h1><p className="page-subtitle">Keep every opportunity moving forward.</p></div><div className="date-chip">Your workspace</div></section>{error && <p className="form-error dashboard-error">{error}</p>}<section className="stat-grid">{cards.map(([title, value]) => <article className="stat-card" key={title}><span>{title}</span><strong>{value}</strong><small>{title === "Total applications" ? "All opportunities" : title === "In progress" ? "Interviews scheduled" : "Great work — keep going"}</small></article>)}</section><section className="recent-section" id="applications"><div className="section-heading"><div><h2>Applications</h2><p>{loading ? "Loading…" : "Manage every opportunity from one place."}</p></div><span className="results-count">{filtered.length} shown</span></div><div className="filter-bar">{["All", "Applied", "Interview", "Offer", "Rejected"].map((status) => <button className={statusFilter === status ? "filter-chip active" : "filter-chip"} type="button" key={status} onClick={() => setStatusFilter(status)}>{status}</button>)}</div><div className="applications-list">{!loading && filtered.length === 0 ? <div className="empty-state"><BriefcaseBusiness size={28} /><strong>No applications found</strong><button className="add-job-button" type="button" onClick={openCreate}><Plus size={18} />Add job</button></div> : filtered.map((job) => <article className="job-row" key={job.id}><span className="company-icon">{job.company.slice(0, 1).toUpperCase()}</span><div className="job-details"><strong>{job.role}</strong><span>{job.company}</span></div><span className={`status status-${job.status.toLowerCase()}`}><CheckCircle2 size={15} />{job.status}</span><time>{job.applied_date || "No date"}</time><span className="row-actions"><button className="row-action" type="button" title="Edit" onClick={() => openEdit(job)}><Pencil size={16} /></button><button className="row-action danger" type="button" title="Delete" onClick={() => removeJob(job)}><Trash2 size={16} /></button></span></article>)}</div></section></main>{toast && <div className="toast" role="status"><CheckCircle2 size={18} />{toast}</div>}{modalOpen && <div className="modal-backdrop"><form className="job-modal" onSubmit={saveJob}><div className="modal-heading"><div><p className="eyebrow">{draft.id ? "UPDATE APPLICATION" : "NEW OPPORTUNITY"}</p><h2>{draft.id ? "Edit application" : "Add an application"}</h2></div><button className="icon-button" type="button" onClick={closeModal}><X size={18} /></button></div><label>Company<input required value={draft.company} onChange={(e) => setDraft({ ...draft, company: e.target.value })} /></label><label>Role<input required value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} /></label><div className="form-row"><label>Status<select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}><option>Applied</option><option>Interview</option><option>Offer</option><option>Rejected</option></select></label><label>Applied date<input type="date" value={draft.applied_date || ""} onChange={(e) => setDraft({ ...draft, applied_date: e.target.value })} /></label></div><button className="auth-submit" type="submit">{draft.id ? <Pencil size={18} /> : <Plus size={18} />}{draft.id ? "Save changes" : "Save application"}</button></form></div>}</div>;
}

async function api(path, options = {}, token) {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  const body = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(body?.detail || "Something went wrong.");
  return body;
}

async function fetchDashboardData(token) {
  const [jobData, statData] = await Promise.all([
    api("/jobs?sort_by=id&order=desc&limit=100", {}, token),
    api("/jobs/stats", {}, token),
  ]);

  return { jobData, statData };
}

function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(() =>
  Boolean(localStorage.getItem("jobtrack_token"))
);
  const update = (key, value) => setForm({ ...form, [key]: value });

  async function submit(event) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      if (mode === "register") await api("/auth/register", { method: "POST", body: JSON.stringify(form) });
      const result = await api("/auth/login", { method: "POST", body: JSON.stringify(form) });
      onAuthenticated(result.access_token);
    } catch (caughtError) { setError(caughtError.message); } finally { setLoading(false); }
  }

  return <main className="auth-page"><section className="auth-card"><div className="auth-art"><a className="brand" href="#top"><span className="brand-mark"><BriefcaseBusiness size={20} /></span><span>JobTrack</span></a><div className="auth-art-copy"><p>YOUR CAREER, CLEARLY</p><h1>Make every application count.</h1><span>Track opportunities, interviews, and offers in one calm workspace.</span></div></div><form className="auth-form" onSubmit={submit}><p className="eyebrow">WELCOME TO JOBTRACK</p><h2>{mode === "login" ? "Welcome back" : "Create an account"}</h2><p className="auth-subtitle">{mode === "login" ? "Sign in to continue your job search." : "Start organizing your opportunities today."}</p><label>Email<input required type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" /></label><label>Password<input required minLength="8" type="password" value={form.password} onChange={(event) => update("password", event.target.value)} placeholder="At least 8 characters" /></label>{error && <p className="form-error">{error}</p>}<button className="auth-submit" disabled={loading} type="submit">{loading && <LoaderCircle className="spin" size={18} />}{mode === "login" ? "Sign in" : "Create account"}</button><p className="auth-switch">{mode === "login" ? "New here?" : "Already have an account?"} <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>{mode === "login" ? "Create one" : "Sign in"}</button></p></form></section></main>;
}

export default function JobTracker() {
  const [theme, setTheme] = useState("dark");
  const [token, setToken] = useState(() => localStorage.getItem("jobtrack_token"));
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ total: 0, interview: 0, offers: 0 });
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [newJob, setNewJob] = useState(emptyJob);
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem("jobtrack_token")));
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  const logout = useCallback(() => {
  localStorage.removeItem("jobtrack_token");
  setToken(null);
  setJobs([]);
}, []);

const notify = (message) => {
  setToast(message);
  window.setTimeout(() => setToast(""), 2800);
};

const loadDashboard = useCallback(async () => {
  if (!token) return;

  try {
    const { jobData, statData } = await fetchDashboardData(token);

    setJobs(jobData);
    setStats(statData);
    setError("");
  } catch (caughtError) {
    if (/authenticated|validate/i.test(caughtError.message)) {
      logout();
    } else {
      setError(caughtError.message);
    }
  } finally {
    setLoading(false);
  }
}, [token, logout]);

useEffect(() => {
  if (!token) return;

  let cancelled = false;

  async function loadInitialDashboard() {
    try {
      const { jobData, statData } = await fetchDashboardData(token);

      if (!cancelled) {
        setJobs(jobData);
        setStats(statData);
        setError("");
      }
    } catch (caughtError) {
      if (!cancelled) {
        if (/authenticated|validate/i.test(caughtError.message)) {
          logout();
        } else {
          setError(caughtError.message);
        }
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  loadInitialDashboard();

  return () => {
    cancelled = true;
  };
}, [token, logout]);

  const authenticate = (nextToken) => {localStorage.setItem("jobtrack_token", nextToken);setLoading(true);setToken(nextToken);};
  const openCreate = () => { setNewJob(emptyJob); setModalOpen(true); };
  const openEdit = (job) => { setNewJob(job); setModalOpen(true); };
  async function addJob(event) { event.preventDefault(); setError(""); try { const editing = Boolean(newJob.id); const payload = { ...newJob, applied_date: newJob.applied_date || null }; await api(newJob.id ? `/jobs/${newJob.id}` : "/jobs", { method: newJob.id ? "PUT" : "POST", body: JSON.stringify(payload) }, token); setNewJob(emptyJob); setModalOpen(false); notify(editing ? "Application updated" : "Application added"); setLoading(true); await loadDashboard(); } catch (caughtError) { setError(caughtError.message); } }
  async function removeJob(job) { if (!window.confirm(`Delete ${job.role} at ${job.company}?`)) return; try { await api(`/jobs/${job.id}`, { method: "DELETE" }, token); notify("Application deleted"); setLoading(true); await loadDashboard(); } catch (caughtError) { setError(caughtError.message); } }
  if (!token) return <AuthScreen onAuthenticated={authenticate} />;
  return <ManagementPanel theme={theme} setTheme={setTheme} query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} stats={stats} jobs={jobs} loading={loading} error={error} toast={toast} openCreate={openCreate} openEdit={openEdit} removeJob={removeJob} modalOpen={modalOpen} draft={newJob} setDraft={setNewJob} saveJob={addJob} closeModal={() => setModalOpen(false)} />;
}
