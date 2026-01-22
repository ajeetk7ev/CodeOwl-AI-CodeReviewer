import { Shield, AlertTriangle, Zap, CheckCircle } from "lucide-react";

interface ReviewSummaryProps {
  summary: {
    filesChanged: number;
    linesAdded: number;
    linesDeleted: number;
    riskLevel: "low" | "medium" | "high" | "critical";
    recommendation: "approve" | "approve_with_changes" | "request_changes" | "block";
  };
  stats: {
    security: { count: number; severity: string };
    bugs: { count: number; severity: string };
    performance: { count: number; severity: string };
    quality: { count: number; severity: string };
  };
}

export const ReviewSummaryCard = ({ summary, stats }: ReviewSummaryProps) => {
  const riskColors = {
    low: "bg-green-500/10 text-green-500 border-green-500/30",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
    high: "bg-orange-500/10 text-orange-500 border-orange-500/30",
    critical: "bg-red-500/10 text-red-500 border-red-500/30",
  };

  const recommendationConfig = {
    approve: { icon: "✅", text: "Approve", color: "text-green-400" },
    approve_with_changes: {
      icon: "💡",
      text: "Approve with Changes",
      color: "text-yellow-400",
    },
    request_changes: {
      icon: "⚠️",
      text: "Request Changes",
      color: "text-orange-400",
    },
    block: { icon: "🚫", text: "Block", color: "text-red-400" },
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-2xl">
          🦉
        </div>
        <div>
          <h3 className="text-xl font-bold">CodeOwl Review</h3>
          <p className="text-sm text-gray-400">AI-Powered Code Analysis</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Files Changed</div>
          <div className="text-2xl font-bold">{summary.filesChanged}</div>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="text-sm text-gray-400 mb-1">Lines Modified</div>
          <div className="text-2xl font-bold">
            <span className="text-green-400">+{summary.linesAdded}</span>
            {" / "}
            <span className="text-red-400">-{summary.linesDeleted}</span>
          </div>
        </div>
      </div>

      {/* Risk Level Badge */}
      <div className="mb-6">
        <div className="text-sm text-gray-400 mb-2">Risk Level</div>
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${riskColors[summary.riskLevel]}`}
        >
          <span className="text-lg">🎯</span>
          <span className="font-bold uppercase">{summary.riskLevel}</span>
        </div>
      </div>

      {/* Issues Breakdown */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatBadge
          icon={<Shield className="w-4 h-4" />}
          label="Security"
          count={stats.security.count}
          severity={stats.security.severity}
        />
        <StatBadge
          icon={<AlertTriangle className="w-4 h-4" />}
          label="Bugs"
          count={stats.bugs.count}
          severity={stats.bugs.severity}
        />
        <StatBadge
          icon={<Zap className="w-4 h-4" />}
          label="Performance"
          count={stats.performance.count}
          severity={stats.performance.severity}
        />
        <StatBadge
          icon={<CheckCircle className="w-4 h-4" />}
          label="Code Quality"
          count={stats.quality.count}
          severity={stats.quality.severity}
        />
      </div>

      {/* Recommendation */}
      <div className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
        <span className="text-2xl">
          {recommendationConfig[summary.recommendation].icon}
        </span>
        <div className="flex-1">
          <div className="text-sm text-gray-400">Recommendation</div>
          <div
            className={`font-semibold ${recommendationConfig[summary.recommendation].color}`}
          >
            {recommendationConfig[summary.recommendation].text}
          </div>
        </div>
      </div>
    </div>
  );
};

function StatBadge({
  icon,
  label,
  count,
  severity,
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  severity: string;
}) {
  const severityColors: Record<string, string> = {
    none: "text-green-400",
    low: "text-blue-400",
    medium: "text-yellow-400",
    high: "text-orange-400",
    critical: "text-red-400",
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg">
      <div className={severityColors[severity] || "text-gray-400"}>{icon}</div>
      <div className="flex-1">
        <div className="text-xs text-gray-400">{label}</div>
        <div className="font-bold">
          {count === 0 ? "✅" : `⚠️ ${count}`}
        </div>
      </div>
    </div>
  );
}
