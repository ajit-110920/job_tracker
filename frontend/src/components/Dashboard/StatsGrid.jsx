import { Briefcase, Clock, Calendar, Award, XCircle } from "lucide-react";
import { SkeletonStatCard } from "../UI/Skeleton";

export function StatsGrid({ stats, loading = false }) {
  if (loading) {
    return (
      <div className="stats-grid">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>
    );
  }

  const items = [
    {
      label: "Total Applications",
      value: stats?.total ?? 0,
      hint: "All tracked opportunities",
      icon: Briefcase,
      color: "var(--primary)",
      bg: "var(--primary-subtle)",
    },
    {
      label: "Applied",
      value: stats?.applied ?? 0,
      hint: "Awaiting response",
      icon: Clock,
      color: "var(--status-applied-fg)",
      bg: "var(--status-applied-bg)",
    },
    {
      label: "Interviews",
      value: stats?.interview ?? 0,
      hint: "In active conversation",
      icon: Calendar,
      color: "var(--status-interview-fg)",
      bg: "var(--status-interview-bg)",
    },
    {
      label: "Offers",
      value: stats?.offers ?? 0,
      hint: "Offers in hand",
      icon: Award,
      color: "var(--status-offer-fg)",
      bg: "var(--status-offer-bg)",
    },
    {
      label: "Rejected",
      value: stats?.rejected ?? 0,
      hint: "Closed opportunities",
      icon: XCircle,
      color: "var(--status-rejected-fg)",
      bg: "var(--status-rejected-bg)",
    },
  ];

  return (
    <div className="stats-grid">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div className="stat-card" key={item.label}>
            <div className="stat-header">
              <span className="stat-label">{item.label}</span>
              <div
                className="stat-icon"
                style={{ backgroundColor: item.bg, color: item.color }}
              >
                <Icon size={16} />
              </div>
            </div>
            <span className="stat-value">{item.value}</span>
            <span className="stat-hint">{item.hint}</span>
          </div>
        );
      })}
    </div>
  );
}

