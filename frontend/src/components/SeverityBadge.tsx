import { AlertTriangle, Info, XCircle, CheckCircle2 } from "lucide-react";

type Severity = "critical" | "high" | "medium" | "low" | "info" | "none";

interface SeverityBadgeProps {
  severity: Severity;
}

export const SeverityBadge = ({ severity }: SeverityBadgeProps) => {
  if (severity === "none") return null;

  const configs = {
    critical: {
      icon: <XCircle className="w-4 h-4" />,
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/30",
      label: "CRITICAL",
    },
    high: {
      icon: <AlertTriangle className="w-4 h-4" />,
      bg: "bg-orange-500/10",
      text: "text-orange-400",
      border: "border-orange-500/30",
      label: "HIGH",
    },
    medium: {
      icon: <AlertTriangle className="w-4 h-4" />,
      bg: "bg-yellow-500/10",
      text: "text-yellow-400",
      border: "border-yellow-500/30",
      label: "MEDIUM",
    },
    low: {
      icon: <Info className="w-4 h-4" />,
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/30",
      label: "LOW",
    },
    info: {
      icon: <CheckCircle2 className="w-4 h-4" />,
      bg: "bg-green-500/10",
      text: "text-green-400",
      border: "border-green-500/30",
      label: "INFO",
    },
  };

  const config = configs[severity];

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-md border ${config.bg} ${config.text} ${config.border}`}
    >
      {config.icon}
      <span className="text-xs font-bold">{config.label}</span>
    </div>
  );
};
