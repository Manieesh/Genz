import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileCode2,
  Github,
  ArrowRight,
  X,
  Sparkles,
  Code2,
  Loader2,
  ChevronDown,
  Shield,
  Zap,
  Eye,
} from "lucide-react";
import { mockReviews, timeAgo } from "@/data/mockData";
import { SeverityCount } from "@/components/common/SeverityBadge";

const SUPPORTED_EXTENSIONS = [".js", ".py", ".java", ".ts", ".tsx", ".jsx", ".cpp", ".go", ".rs", ".rb"];
const MAX_FILES = 10;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_CHARS = 10_000;

const LANGUAGES = ["Auto-detect", "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C++", "Ruby"];

export default function HomePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [pasteCode, setPasteCode] = useState("");
  const [language, setLanguage] = useState("Auto-detect");
  const [repoUrl, setRepoUrl] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const hasInput = files.length > 0 || pasteCode.trim().length > 0 || repoUrl.trim().length > 0;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter((f) =>
      SUPPORTED_EXTENSIONS.some((ext) => f.name.toLowerCase().endsWith(ext))
    );
    setFiles((prev) => [...prev, ...droppedFiles].slice(0, MAX_FILES));
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selected].slice(0, MAX_FILES));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisStep(1);
    await new Promise((r) => setTimeout(r, 1200));
    setAnalysisStep(2);
    await new Promise((r) => setTimeout(r, 1000));
    setAnalysisStep(3);
    await new Promise((r) => setTimeout(r, 800));
    navigate("/results/rev_001");
  };

  const handleTrySample = () => {
    setPasteCode(`const userId = req.params.id;
const query = \`SELECT * FROM orders 
  WHERE user_id = \${userId}\`;
db.execute(query);

function findMatches(listA, listB) {
  const result = [];
  for (const item of listA) {
    for (const other of listB) {
      if (item.id === other.id) {
        result.push({ ...item, ...other });
      }
    }
  }
  return result;
}

const db = mysql.createConnection({
  host: 'prod-db.acme.com',
  user: 'admin',
  password: 'supersecret123',
  database: 'ecommerce'
});`);
    setLanguage("JavaScript");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  // Analysis overlay
  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-primary animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Analyzing your code...</h2>
          <div className="w-64 space-y-3">
            {[
              { step: 1, label: "Reading files..." },
              { step: 2, label: "Analyzing patterns..." },
              { step: 3, label: "Generating report..." },
            ].map(({ step, label }) => (
              <div key={step} className="flex items-center gap-3">
                <div
                  className={`h-2 w-2 rounded-full transition-colors ${
                    analysisStep >= step ? "bg-primary" : "bg-muted"
                  }`}
                />
                <span
                  className={`text-sm transition-colors ${
                    analysisStep >= step ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  Step {step}/3: {label}
                </span>
              </div>
            ))}
          </div>
          <div className="w-64 h-1.5 rounded-full bg-secondary mt-2 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${(analysisStep / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center pt-6 sm:pt-10"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">AI-Powered Analysis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight">
          Code Review in{" "}
          <span className="text-gradient-primary">Seconds</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Find bugs, security issues, and performance problems automatically.
          Your AI teammate that never misses a thing.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {[
            { icon: Shield, label: "Security Scanning" },
            { icon: Zap, label: "Performance Analysis" },
            { icon: Eye, label: "Transparent AI" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs text-muted-foreground"
            >
              <Icon className="h-3 w-3" />
              {label}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="space-y-6"
      >
        {/* Drag & Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 sm:p-12 text-center transition-all ${
            isDragOver
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-border hover:border-primary/40 hover:bg-accent/30"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={SUPPORTED_EXTENSIONS.join(",")}
            onChange={handleFileSelect}
            className="hidden"
          />
          <Upload className={`h-10 w-10 mx-auto mb-3 transition-colors ${isDragOver ? "text-primary" : "text-muted-foreground"}`} />
          <p className="text-sm font-medium text-foreground">
            Drop your code files here
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            or click to browse
          </p>
          <p className="text-xs text-muted-foreground/60 mt-3">
            Supports: {SUPPORTED_EXTENSIONS.join(", ")} · Max {MAX_FILES} files · {MAX_SIZE / 1024 / 1024}MB total
          </p>
        </div>

        {/* File list */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              {files.map((file, i) => (
                <motion.div
                  key={`${file.name}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <FileCode2 className="h-4 w-4 text-primary" />
                    <span className="text-sm font-mono text-foreground">{file.name}</span>
                    <span className="text-xs text-muted-foreground">({formatFileSize(file.size)})</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(i);
                    }}
                    className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs font-medium text-muted-foreground">OR</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Paste Code */}
        <div className="space-y-3">
          <div className="relative">
            <textarea
              value={pasteCode}
              onChange={(e) => setPasteCode(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Paste your code here..."
              className="w-full min-h-[180px] rounded-xl border border-border bg-card p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 resize-y transition-colors"
            />
            {pasteCode && (
              <span className="absolute bottom-3 right-3 text-[10px] text-muted-foreground font-mono">
                {pasteCode.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-2.5 py-1.5">
              <Code2 className="h-3 w-3 text-muted-foreground" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs text-foreground outline-none cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleTrySample}
              className="text-xs text-primary hover:underline"
            >
              Try with example code
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs font-medium text-muted-foreground">OR</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* GitHub Repo */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Github className="h-4 w-4" />
            Connect GitHub Repository
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repo"
              className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            />
            <button
              disabled={!repoUrl.trim()}
              className="rounded-lg bg-secondary border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Connect
            </button>
          </div>
        </div>

        {/* Analyze Button */}
        <motion.button
          onClick={handleAnalyze}
          disabled={!hasInput}
          whileHover={hasInput ? { scale: 1.01 } : {}}
          whileTap={hasInput ? { scale: 0.99 } : {}}
          className={`w-full rounded-xl py-3.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            hasInput
              ? "bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
              : "bg-secondary text-muted-foreground cursor-not-allowed"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          Analyze Code
          <ArrowRight className="h-4 w-4" />
        </motion.button>
      </motion.div>

      {/* Recent Reviews */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Recent Reviews
          </h2>
          <button
            onClick={() => navigate("/history")}
            className="text-xs text-primary hover:underline"
          >
            View all →
          </button>
        </div>
        <div className="space-y-2">
          {mockReviews.slice(0, 3).map((review) => (
            <button
              key={review.id}
              onClick={() => navigate(`/results/${review.id}`)}
              className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-left hover:bg-accent/30 hover-lift transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileCode2 className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {review.branch}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {timeAgo(review.timestamp)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {review.issueCount.total === 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/15 border border-success/20 px-2 py-0.5 text-[10px] font-medium text-success">
                    Clean ✓
                  </span>
                ) : (
                  <>
                    <SeverityCount severity="critical" count={review.issueCount.critical} />
                    <SeverityCount severity="warning" count={review.issueCount.warning} />
                    <SeverityCount severity="nit" count={review.issueCount.nit} />
                  </>
                )}
              </div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Social proof */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <p className="text-xs text-muted-foreground/60">
          🔒 Your code is analyzed securely and never stored permanently
        </p>
      </motion.div>
    </div>
  );
}
