import { CheckCircle2, Clock, Award, XCircle } from "lucide-react";

export function Badge({ status }) {
  const normalized = (status || "Applied").toLowerCase();

  const icons = {
    applied: Clock,
    interview: CheckCircle2,
    offer: Award,
    rejected: XCircle,
  };

  const Icon = icons[normalized] || CheckCircle2;

  return (
    <span className={`status status-badge status-${normalized}`}>
      <Icon size={14} aria-hidden="true" />
      {status}
    </span>
  );
}
