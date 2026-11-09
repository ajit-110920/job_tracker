import { Search, Sun, Moon, Plus, Menu, X } from "lucide-react";
import { Button } from "../UI/Button";

export function Header({
  searchQuery,
  onSearchChange,
  theme,
  onToggleTheme,
  onOpenCreate,
  onToggleMobileMenu,
}) {
  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          type="button"
          className="mobile-nav-toggle icon-btn"
          onClick={onToggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <Menu size={18} />
        </button>

        <div className="search-container">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            className="search-input"
            placeholder="Search by company or role..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search applications"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="topbar-right">
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <Button
          type="button"
          variant="primary"
          onClick={onOpenCreate}
        >
          <Plus size={16} />
          <span>New Application</span>
        </Button>
      </div>
    </header>
  );
}

