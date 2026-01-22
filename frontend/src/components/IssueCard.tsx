import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { SeverityBadge } from "./SeverityBadge";

interface IssueCardProps {
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  fix?: string;
  codeExample?: { before: string; after: string };
  line?: number;
}

export const IssueCard = ({
  severity,
  title,
  description,
  fix,
  codeExample,
  line,
}: IssueCardProps) => {
  const [isExpanded, setIsExpanded] = useState(
    severity === "critical" || severity === "high"
  );

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800/30 hover:border-gray-600 transition-colors">
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-800/50 transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}

        <SeverityBadge severity={severity} />

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold truncate">{title}</h4>
          {line && (
            <span className="text-xs text-gray-500">Line {line}</span>
          )}
        </div>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4">
          {/* Description */}
          <div className="pl-8">
            <p className="text-gray-300 text-sm">{description}</p>
          </div>

          {/* Fix Suggestion */}
          {fix && (
            <div className="pl-8">
              <div className="text-xs font-semibold text-green-400 mb-2">
                💡 Suggested Fix:
              </div>
              <div className="bg-gray-900/50 p-3 rounded border border-gray-700 text-sm">
                {fix}
              </div>
            </div>
          )}

          {/* Code Example */}
          {codeExample && (
            <div className="pl-8 space-y-2">
              <div className="text-xs font-semibold text-red-400">
                ❌ Current:
              </div>
              <pre className="bg-red-500/10 p-3 rounded border border-red-500/30 text-xs overflow-x-auto">
                <code>{codeExample.before}</code>
              </pre>

              <div className="text-xs font-semibold text-green-400">
                ✅ Suggested:
              </div>
              <pre className="bg-green-500/10 p-3 rounded border border-green-500/30 text-xs overflow-x-auto">
                <code>{codeExample.after}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
