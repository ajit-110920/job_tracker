// API client for Job Tracker
// In dev: Vite proxies /api to http://127.0.0.1:8000
// In prod: Nginx proxies /api to https://job-tracker-e8p3.onrender.com/

export async function api(path, options = {}, token = null) {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`/api${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  let body;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message =
      (body && (body.detail || body.message)) ||
      `Request failed with status ${response.status}`;
    const error = new Error(typeof message === "string" ? message : JSON.stringify(message));
    error.status = response.status;
    error.body = body;
    throw error;
  }

  return body;
}

export async function fetchDashboardData(token) {
  const [jobData, statData] = await Promise.all([
    api("/jobs?sort_by=id&order=desc&limit=100", {}, token),
    api("/jobs/stats", {}, token),
  ]);

  return {
    jobData: Array.isArray(jobData) ? jobData : [],
    statData: statData || { total: 0, applied: 0, interview: 0, offers: 0, rejected: 0 },
  };
}
