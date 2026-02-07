import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Settings2,
  Palette,
  Link2,
  Bell,
  Save,
  RotateCcw,
  CheckCircle2,
  Github,
  MessageSquare,
} from "lucide-react";

const tabs = [
  { id: "general", label: "Review Settings", icon: Settings2 },
  { id: "style", label: "Code Style", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "integrations", label: "Integrations", icon: Link2 },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  // General
  const [severityFilter, setSeverityFilter] = useState({
    critical: true,
    warnings: true,
    nits: true,
  });
  const [autoApply, setAutoApply] = useState(false);
  const [language, setLanguage] = useState("auto");

  // Style
  const [naming, setNaming] = useState("camelCase");
  const [maxLineLength, setMaxLineLength] = useState(80);
  const [indentation, setIndentation] = useState("spaces2");

  // Notifications
  const [emailCritical, setEmailCritical] = useState(true);
  const [emailComplete, setEmailComplete] = useState(false);
  const [emailWeekly, setEmailWeekly] = useState(false);
  const [email, setEmail] = useState("");

  const handleSave = () => {
    toast.success("Settings saved! ✓", { description: "Your preferences have been updated." });
  };

  const handleReset = () => {
    setSeverityFilter({ critical: true, warnings: true, nits: true });
    setAutoApply(false);
    setLanguage("auto");
    setNaming("camelCase");
    setMaxLineLength(80);
    setIndentation("spaces2");
    toast.info("Settings reset to defaults");
  };

  return (
    <div className="pb-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize how Code Review Agent works for you
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Tab sidebar */}
        <nav className="sm:w-48 shrink-0 flex sm:flex-col gap-1 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4 shrink-0" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 space-y-6 max-w-2xl"
        >
          {activeTab === "general" && (
            <section className="rounded-xl border border-border bg-card p-5 space-y-5">
              <h2 className="text-sm font-semibold text-foreground">Review Preferences</h2>

              {/* Severity checkboxes */}
              <div>
                <p className="text-sm text-foreground mb-2">Show me issues that are:</p>
                {[
                  { key: "critical" as const, label: "Critical (security & major bugs)" },
                  { key: "warnings" as const, label: "Warnings (performance & logic)" },
                  { key: "nits" as const, label: "Nits (style & minor improvements)" },
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2 py-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={severityFilter[item.key]}
                      onChange={() => setSeverityFilter((f) => ({ ...f, [item.key]: !f[item.key] }))}
                      className="rounded border-border"
                    />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </label>
                ))}
              </div>

              {/* Auto-apply */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">Auto-apply safe fixes</p>
                  <p className="text-xs text-muted-foreground">Only formatting fixes will auto-apply</p>
                </div>
                <button
                  onClick={() => setAutoApply(!autoApply)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${autoApply ? "bg-primary" : "bg-secondary"}`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-foreground transition-transform ${autoApply ? "left-[22px]" : "left-0.5"}`}
                  />
                </button>
              </div>

              {/* Language */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">Language preference</p>
                  <p className="text-xs text-muted-foreground">Default language for pasted code</p>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="rounded-md border border-border bg-secondary px-3 py-1.5 text-xs text-foreground outline-none cursor-pointer"
                >
                  <option value="auto">Auto-detect</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="go">Go</option>
                </select>
              </div>
            </section>
          )}

          {activeTab === "style" && (
            <section className="rounded-xl border border-border bg-card p-5 space-y-5">
              <h2 className="text-sm font-semibold text-foreground">Code Style Preferences</h2>

              <div>
                <p className="text-sm text-foreground mb-2">Variable naming:</p>
                <div className="flex flex-wrap gap-3">
                  {["camelCase", "snake_case", "PascalCase"].map((opt) => (
                    <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="naming"
                        value={opt}
                        checked={naming === opt}
                        onChange={() => setNaming(opt)}
                        className="border-border text-primary"
                      />
                      <span className="text-sm font-mono text-muted-foreground">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-foreground">Line length limit:</p>
                  <span className="text-sm font-mono text-primary font-medium">{maxLineLength} characters</span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={120}
                  value={maxLineLength}
                  onChange={(e) => setMaxLineLength(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <p className="text-sm text-foreground mb-2">Indentation:</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: "spaces2", label: "2 spaces" },
                    { value: "spaces4", label: "4 spaces" },
                    { value: "tabs", label: "Tabs" },
                  ].map((opt) => (
                    <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="indentation"
                        value={opt.value}
                        checked={indentation === opt.value}
                        onChange={() => setIndentation(opt.value)}
                        className="border-border text-primary"
                      />
                      <span className="text-sm text-muted-foreground">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>
          )}

          {activeTab === "notifications" && (
            <section className="rounded-xl border border-border bg-card p-5 space-y-5">
              <h2 className="text-sm font-semibold text-foreground">Notifications</h2>

              <div>
                <p className="text-sm text-foreground mb-2">Email me when:</p>
                {[
                  { checked: emailCritical, setter: setEmailCritical, label: "Critical issues are found" },
                  { checked: emailComplete, setter: setEmailComplete, label: "Review is complete" },
                  { checked: emailWeekly, setter: setEmailWeekly, label: "Weekly summary of my code quality" },
                ].map((item) => (
                  <label key={item.label} className="flex items-center gap-2 py-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => item.setter(!item.checked)}
                      className="rounded border-border"
                    />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </label>
                ))}
              </div>

              <div>
                <p className="text-sm text-foreground mb-1">Email address:</p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary/50 transition-colors"
                />
              </div>
            </section>
          )}

          {activeTab === "integrations" && (
            <section className="rounded-xl border border-border bg-card p-5 space-y-5">
              <h2 className="text-sm font-semibold text-foreground">Integrations</h2>

              {[
                { name: "GitHub", icon: Github, connected: true },
                { name: "GitLab", icon: Link2, connected: false },
                { name: "Slack", icon: MessageSquare, connected: false },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-lg border border-border bg-secondary p-3">
                  <div className="flex items-center gap-2.5">
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{item.name}</span>
                    {item.connected && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-success">
                        <CheckCircle2 className="h-3 w-3" /> Connected
                      </span>
                    )}
                  </div>
                  <button
                    className={`text-xs font-medium px-3 py-1 rounded-md transition-colors ${
                      item.connected
                        ? "text-critical hover:bg-critical/10"
                        : "text-primary bg-primary/10 hover:bg-primary/20"
                    }`}
                  >
                    {item.connected ? "Disconnect" : "Connect"}
                  </button>
                </div>
              ))}
            </section>
          )}

          {/* Save buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Save className="h-4 w-4" />
              Save All Settings
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-5 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
