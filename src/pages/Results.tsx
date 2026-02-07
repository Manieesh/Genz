import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Search,
  Filter,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X,
  ArrowLeft,
  Download,
  Map,
  FileText,
  Copy,
  ExternalLink,
} from "lucide-react";
import SeverityBadge from "@/components/common/SeverityBadge";
import CodeBlock from "@/components/common/CodeBlock";
import StatCard from "@/components/common/StatCard";
import { mockReviews, mockIssues, type Issue, type Severity } from "@/data/mockData";
import { toast } from "sonner";

const gradeFromIssues = (total: number, critical: number) => {
  if (total === 0) return { grade: "A+", message: "Your code looks perfect! ✨", color: "text-success" };
  if (critical === 0 && total <= 2) return { grade: "A", message: "Great job! Just a few tweaks needed 👍", color: "text-success" };
  if (critical === 0 && total <= 5) return { grade: "B+", message: "Good work! Some improvements ahead 🔧", color: "text-primary" };
  if (total <= 10) return { grade: "B", message: "Needs some attention. Let's fix these! 🔧", color: "text-primary" };
  return { grade: "C", message: "Needs work. Let's tackle these issues 💪", color: "text-warning" };
};

export default function ResultsPage() {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const review = mockReviews.find((r) => r.id === reviewId) || mockReviews[0];
  const issues = mockIssues.filter((i) => i.reviewId === review.id);

  const [filterSeverity, setFilterSeverity] = useState<Severity | "all">("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIssue, setExpandedIssue] = useState<string | null>(issues[0]?.id || null);
  const [issueStates, setIssueStates] = useState<Record<string, Issue["status"]>>({});
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, "up" | "down">>({});

  const categories = [...new Set(issues.map((i) => i.category))];
  const { grade, message, color } = gradeFromIssues(review.issueCount.total, review.issueCount.critical);

  const filteredIssues = issues.filter((issue) => {
    if (filterSeverity !== "all" && issue.severity !== filterSeverity) return false;
    if (filterCategory !== "all" && issue.category !== filterCategory) return false;
    if (
      searchQuery &&
      !issue.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !issue.file.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const handleApplyFix = (issueId: string) => {
    setIssueStates((prev) => ({ ...prev, [issueId]: "fixed" }));
    toast.success("Fix applied! ✓", {
      description: "Download your corrected file.",
    });
  };

  const handleDismiss = (issueId: string) => {
    setIssueStates((prev) => ({ ...prev, [issueId]: "dismissed" }));
    toast.info("Issue hidden", {
      description: "Undo?",
      action: { label: "Undo", onClick: () => setIssueStates((prev) => ({ ...prev, [issueId]: "open" })) },
    });
  };

  const handleFeedback = (issueId: string, type: "up" | "down") => {
    setFeedbackGiven((prev) => ({ ...prev, [issueId]: type }));
  };

  const handleExport = () => {
    toast.success("Report downloaded!", { description: "review-report.pdf" });
  };

  const getIssueStatus = (issue: Issue) => issueStates[issue.id] || issue.status;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium">Review Results</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">{review.branch}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/map/${review.id}`)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-accent transition-colors"
          >
            <Map className="h-3.5 w-3.5" />
            See Code Map
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-accent transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-5 gap-3"
      >
        <div className="rounded-xl border border-border bg-card p-4 col-span-2 sm:col-span-1 flex flex-col items-center justify-center text-center">
          <p className={`text-3xl font-extrabold ${color}`}>{grade}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Code Quality</p>
        </div>
        <StatCard
          icon={FileText}
          value={review.issueCount.total}
          label="Total Issues"
          delay={50}
        />
        <div className="rounded-xl border border-critical/20 bg-critical/5 p-4">
          <p className="text-2xl font-bold text-critical font-mono">{review.issueCount.critical}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Critical 🔴</p>
        </div>
        <div className="rounded-xl border border-warning/20 bg-warning/5 p-4">
          <p className="text-2xl font-bold text-warning font-mono">{review.issueCount.warning}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Warning 🟠</p>
        </div>
        <div className="rounded-xl border border-nit/20 bg-nit/5 p-4">
          <p className="text-2xl font-bold text-nit font-mono">{review.issueCount.nit}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Nit 🔵</p>
        </div>
      </motion.div>

      {/* Summary message */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-muted-foreground"
      >
        {review.stats.filesIncluded} files analyzed · {(review.stats.processingTimeMs / 1000).toFixed(1)}s · {message}
      </motion.p>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex flex-wrap items-center gap-2"
      >
        <div className="flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5">
          <Filter className="h-3 w-3 text-muted-foreground" />
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value as any)}
            className="bg-transparent text-xs text-foreground outline-none cursor-pointer"
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="nit">Nit</option>
          </select>
        </div>
        <div className="flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-transparent text-xs text-foreground outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1.5 flex-1 min-w-[180px] rounded-md border border-border bg-card px-2.5 py-1.5">
          <Search className="h-3 w-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/50"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}>
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        <span className="text-xs text-muted-foreground ml-auto">
          {filteredIssues.length} of {issues.length} issues
        </span>
      </motion.div>

      {/* Issues list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredIssues.map((issue, index) => {
            const status = getIssueStatus(issue);
            const isExpanded = expandedIssue === issue.id;
            const feedback = feedbackGiven[issue.id];

            return (
              <motion.div
                key={issue.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
                className={`rounded-xl border bg-card overflow-hidden transition-colors ${
                  status === "fixed"
                    ? "border-success/30 opacity-70"
                    : status === "dismissed"
                    ? "border-border opacity-50"
                    : issue.severity === "critical"
                    ? "border-critical/20"
                    : "border-border"
                }`}
              >
                {/* Issue header */}
                <button
                  onClick={() => setExpandedIssue(isExpanded ? null : issue.id)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-accent/30 transition-colors"
                >
                  <SeverityBadge severity={issue.severity} size="md" />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-semibold ${
                        status === "fixed"
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {issue.title}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5 truncate">
                      {issue.file}, line {issue.line}
                    </p>
                  </div>
                  {status === "fixed" && (
                    <span className="text-[10px] font-medium text-success bg-success/10 px-2 py-0.5 rounded-full border border-success/20">
                      Fixed ✓
                    </span>
                  )}
                  {status === "dismissed" && (
                    <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border">
                      Dismissed
                    </span>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border px-4 py-4 space-y-4">
                        {/* What's wrong */}
                        <div>
                          <p className="text-xs font-semibold text-foreground mb-1">What's wrong:</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {issue.description}
                          </p>
                        </div>

                        {/* Code diff */}
                        <div>
                          <p className="text-xs font-semibold text-foreground mb-2">Your code:</p>
                          <CodeBlock code={issue.codeBefore} variant="before" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground mb-2">Fixed code:</p>
                          <CodeBlock code={issue.codeAfter} variant="after" />
                        </div>

                        {/* Why this is better */}
                        <div className="flex gap-2 rounded-lg bg-primary/5 border border-primary/10 p-3">
                          <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-primary mb-1">
                              Why this is better
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {issue.reasoning}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {status === "open" && (
                            <>
                              {issue.autoFixAvailable && (
                                <button
                                  onClick={() => handleApplyFix(issue.id)}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Apply This Fix
                                </button>
                              )}
                              <button
                                onClick={() => handleDismiss(issue.id)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3.5 py-2 text-xs font-medium text-foreground hover:bg-accent transition-colors"
                              >
                                Ignore
                              </button>
                              <button className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium text-primary hover:bg-primary/5 transition-colors">
                                <ExternalLink className="h-3 w-3" />
                                Learn More
                              </button>
                            </>
                          )}
                          <div className="flex items-center gap-1 ml-auto">
                            <span className="text-[10px] text-muted-foreground mr-1">Helpful?</span>
                            <button
                              onClick={() => handleFeedback(issue.id, "up")}
                              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${
                                feedback === "up"
                                  ? "bg-success/15 text-success"
                                  : "text-muted-foreground hover:bg-accent"
                              }`}
                            >
                              <ThumbsUp className="h-3 w-3" />
                              <span className="font-mono">
                                {issue.feedback.helpful + (feedback === "up" ? 1 : 0)}
                              </span>
                            </button>
                            <button
                              onClick={() => handleFeedback(issue.id, "down")}
                              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors ${
                                feedback === "down"
                                  ? "bg-critical/15 text-critical"
                                  : "text-muted-foreground hover:bg-accent"
                              }`}
                            >
                              <ThumbsDown className="h-3 w-3" />
                              <span className="font-mono">
                                {issue.feedback.notHelpful + (feedback === "down" ? 1 : 0)}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredIssues.length === 0 && issues.length > 0 && (
        <div className="text-center py-12">
          <Search className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No issues match your filters</p>
        </div>
      )}

      {issues.length === 0 && (
        <div className="text-center py-16">
          <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-3" />
          <p className="text-lg font-bold text-foreground">Your code looks great! ✨</p>
          <p className="text-sm text-muted-foreground mt-1">
            No issues found — keep up the excellent work!
          </p>
        </div>
      )}
    </div>
  );
}
