import { useState } from "react";
import {
  BriefcaseBusiness,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "../UI/Button";
import { api } from "../../api/client";

export function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errs.email = "Email address is required";
    } else if (!emailRegex.test(email.trim())) {
      errs.email = "Please enter a valid email address";
    }

    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || loading) return;

    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        await api("/auth/register", {
          method: "POST",
          body: JSON.stringify({ email: email.trim(), password }),
        });
      }

      const result = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (result && result.access_token) {
        onAuthenticated(result.access_token);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setFieldErrors({});
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        {/* Left Side: Brand Promo Showcase */}
        <div className="auth-promo">
          <div>
            <div className="brand-logo" style={{ color: "#ffffff" }}>
              <div className="brand-icon-box">
                <BriefcaseBusiness size={18} />
              </div>
              <span>JobTrack</span>
              <span className="brand-badge">SaaS</span>
            </div>

            <h1 className="promo-title">
              Manage your job search like a high-growth pipeline.
            </h1>
            <p className="promo-desc">
              Organize every application, interview round, and offer in one focused,
              calm workspace built for ambitious professionals.
            </p>

            <div className="promo-features">
              <div className="promo-feature-item">
                <div className="promo-feature-icon">
                  <TrendingUp size={14} />
                </div>
                <span>Real-time pipeline metrics & conversion rates</span>
              </div>
              <div className="promo-feature-item">
                <div className="promo-feature-icon">
                  <ShieldCheck size={14} />
                </div>
                <span>Data isolation with encrypted JWT authentication</span>
              </div>
              <div className="promo-feature-item">
                <div className="promo-feature-icon">
                  <Zap size={14} />
                </div>
                <span>Instant search, filtering, and responsive controls</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: "0.75rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px" }}>
            <CheckCircle2 size={14} color="#818cf8" />
            <span>Production Grade v1.0 • Ready for Desktop & Mobile</span>
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="auth-form-card">
          <h2 className="auth-heading">
            {mode === "login" ? "Welcome back" : "Create an account"}
          </h2>
          <p className="auth-subheading">
            {mode === "login"
              ? "Sign in to manage and track your active job applications."
              : "Set up your workspace and take control of your career journey."}
          </p>

          {error && (
            <div className="auth-error-alert" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group" style={{ marginBottom: "var(--space-4)" }}>
              <label htmlFor="auth-email" className="form-label">
                Email address
              </label>
              <input
                id="auth-email"
                type="email"
                className="form-input"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: null });
                }}
                disabled={loading}
                autoComplete="email"
                required
              />
              {fieldErrors.email && (
                <span className="form-field-error">{fieldErrors.email}</span>
              )}
            </div>

            <div className="form-group" style={{ marginBottom: "var(--space-6)" }}>
              <label htmlFor="auth-password" className="form-label">
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder={mode === "register" ? "At least 8 characters" : "Enter your password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: null });
                  }}
                  disabled={loading}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.password && (
                <span className="form-field-error">{fieldErrors.password}</span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              style={{ width: "100%", height: "42px" }}
            >
              {mode === "login" ? "Sign in" : "Create account"}
            </Button>

            <div className="auth-switch-prompt">
              {mode === "login" ? (
                <>
                  New to JobTrack?{" "}
                  <button
                    type="button"
                    className="auth-switch-link"
                    onClick={() => switchMode("register")}
                  >
                    Create one
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="auth-switch-link"
                    onClick={() => switchMode("login")}
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

