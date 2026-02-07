import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  suffix?: string;
  label: string;
  trend?: { value: string; positive: boolean };
  delay?: number;
  formatValue?: (v: number) => string;
}

export default function StatCard({
  icon: Icon,
  value,
  suffix = "",
  label,
  trend,
  delay = 0,
  formatValue,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    const timer = setTimeout(() => requestAnimationFrame(animate), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  const formatted = formatValue ? formatValue(displayValue) : displayValue;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000, duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-xl border border-border bg-card p-5 hover-lift"
    >
      <div className="stat-glow absolute inset-0 pointer-events-none" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            {label}
          </p>
          <p className="text-3xl font-bold text-foreground tabular-nums">
            {formatted}
            {suffix && <span className="text-lg text-muted-foreground ml-0.5">{suffix}</span>}
          </p>
          {trend && (
            <p
              className={`mt-1 text-xs font-medium ${
                trend.positive ? "text-success" : "text-critical"
              }`}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </motion.div>
  );
}
