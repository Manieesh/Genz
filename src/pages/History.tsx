import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  FileCode2,
  Download,
  Trash2,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Loader2,
  Plus,
  ClipboardList,
  Bug,
  BarChart3,
  Target,
} from "lucide-react";
import { mockReviews, timeAgo } from "@/data/mockData";
import { SeverityCount } from "@/components/common/SeverityBadge";
import StatCard from "@/components/common/StatCard";
import { toast } from "sonner";

type FilterType = "all" | "issues" | "clean" | "in_progress";
type SortType = "newest" | "oldest" | "most_issues";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("newest");

  const filteredReviews = mockReviews
    .filter((r) => {
      if (searchQuery && !r.branch.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filter === "issues") return r.issueCount.total > 0;
      if (filter === "clean") return r.issueCount.total === 0;
      if (filter === "in_progress") return r.status === "in_progress";
      return true;
    })
    .sort((a, b) => {
      if (sort === "oldest") return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      if (sort === "most_issues") return b.issueCount.total - a.issueCount.total;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  const totalIssues = mockReviews.reduce((sum, r) => sum + r.issueCount.total, 0);
  const avgPerReview = mockReviews.length > 0 ? (totalIssues / mockReviews.length).toFixed(1) : "0";
  const fixedRate = 94;

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    toast.info("Review deleted", { description: "Undo?", action: { label: "Undo", onClick: () => {} } });
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success("Report downloaded!");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Reviews</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track your code review history
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Review
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={ClipboardList}
          value={mockReviews.length}
          label="Reviews Done"
          delay={0}
        />
        <StatCard
          icon={Bug}
          value={totalIssues}
          label="Issues Found"
          delay={100}
        />
        <StatCard
          icon={BarChart3}
          value={Number(avgPerReview)}
          label="Avg per Review"
          delay={200}
          formatValue={(v) => v.toFixed(1)}
        />
        <StatCard
          icon={Target}
          value={fixedRate}
          suffix="%"
          label="Fixed Rate"
          delay={300}
        />
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
      >
        <div className="flex items-center gap-1.5 flex-1 rounded-lg border border-border bg-card px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews..."
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-2">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterType)}
              className="bg-transparent text-xs text-foreground outline-none cursor-pointer"
            >
              <option value="all">All</option>
              <option value="issues">With Issues</option>
              <option value="clean">Clean</option>
              <option value="in_progress">In Progress</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-2">
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortType)}
              className="bg-transparent text-xs text-foreground outline-none cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="most_issues">Most Issues</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Review Cards */}
      <div className="space-y-3">
        {filteredReviews.map((review, index) => (
          <motion.button
            key={review.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            onClick={() => navigate(`/results/${review.id}`)}
            className="flex w-full flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 text-left hover:bg-accent/30 hover-lift transition-all"
          >
            <div className="flex items-start gap-3 min-w-0">
              <FileCode2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {review.branch}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {timeAgo(review.timestamp)} · {review.stats.filesIncluded} files analyzed
                </p>
                <div className="flex items-center gap-2 mt-2">
                  {review.issueCount.total === 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-success/15 border border-success/20 px-2 py-0.5 text-[10px] font-medium text-success">
                      Code looks great! ✨
                    </span>
                  ) : (
                    <>
                      <SeverityCount severity="critical" count={review.issueCount.critical} />
                      <SeverityCount severity="warning" count={review.issueCount.warning} />
                      <SeverityCount severity="nit" count={review.issueCount.nit} />
                    </>
                  )}
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                      review.status === "completed"
                        ? "bg-success/10 text-success border-success/20"
                        : review.status === "in_progress"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-critical/10 text-critical border-critical/20"
                    }`}
                  >
                    {review.status === "completed" ? (
                      <>
                        <CheckCircle2 className="h-2.5 w-2.5" /> Complete
                      </>
                    ) : review.status === "in_progress" ? (
                      <>
                        <Loader2 className="h-2.5 w-2.5 animate-spin" /> In Progress
                      </>
                    ) : (
                      "Failed"
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
              <button
                onClick={(e) => handleDownload(e)}
                className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                title="Download Report"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => handleDelete(e, review.id)}
                className="rounded-md p-2 text-muted-foreground hover:bg-critical/10 hover:text-critical transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </motion.button>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-16">
          <FileCode2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No reviews found</p>
          <button
            onClick={() => navigate("/")}
            className="mt-3 text-xs text-primary hover:underline"
          >
            Start your first review →
          </button>
        </div>
      )}
    </div>
  );
}
