import { useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  X,
  FileText,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { mockContextGraph, mockReviews, type GraphNode, type NodeStatus } from "@/data/mockData";

const STATUS_COLORS: Record<NodeStatus, string> = {
  included: "hsl(160, 84%, 39%)",
  excluded: "hsl(215, 20%, 35%)",
  partial: "hsl(38, 92%, 50%)",
};

const STATUS_BG: Record<NodeStatus, string> = {
  included: "bg-success",
  excluded: "bg-muted-foreground/30",
  partial: "bg-warning",
};

const STATUS_LABELS: Record<NodeStatus, string> = {
  included: "Analyzed",
  excluded: "Skipped",
  partial: "Partial",
};

export default function CodeMapPage() {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const review = mockReviews.find((r) => r.id === reviewId) || mockReviews[0];
  const svgRef = useRef<SVGSVGElement>(null);

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ included: true, excluded: true, partial: true });

  const { nodes, edges } = mockContextGraph;

  const filteredNodes = useMemo(() => nodes.filter((n) => filters[n.status]), [nodes, filters]);
  const filteredEdges = useMemo(() => {
    const nodeIds = new Set(filteredNodes.map((n) => n.id));
    return edges.filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target));
  }, [edges, filteredNodes]);

  const highlightedNodes = useMemo(() => {
    const targetId = hoveredNode || selectedNode?.id;
    if (!targetId) return new Set<string>();
    const connected = new Set<string>([targetId]);
    edges.forEach((e) => {
      if (e.source === targetId) connected.add(e.target);
      if (e.target === targetId) connected.add(e.source);
    });
    return connected;
  }, [hoveredNode, selectedNode, edges]);

  const highlightedEdges = useMemo(() => {
    const targetId = hoveredNode || selectedNode?.id;
    if (!targetId) return new Set<number>();
    const set = new Set<number>();
    filteredEdges.forEach((e, i) => {
      if (e.source === targetId || e.target === targetId) set.add(i);
    });
    return set;
  }, [hoveredNode, selectedNode, filteredEdges]);

  const searchResults = useMemo(() => {
    if (!searchQuery) return new Set<string>();
    return new Set(nodes.filter((n) => n.label.toLowerCase().includes(searchQuery.toLowerCase())).map((n) => n.id));
  }, [nodes, searchQuery]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, GraphNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  const getNodeDeps = useCallback(
    (nodeId: string) =>
      edges
        .filter((e) => e.source === nodeId || e.target === nodeId)
        .map((e) => {
          const otherId = e.source === nodeId ? e.target : e.source;
          const other = nodeMap.get(otherId);
          return other ? { node: other, type: e.type, direction: e.source === nodeId ? "out" : "in" } : null;
        })
        .filter(Boolean) as { node: GraphNode; type: string; direction: string }[],
    [edges, nodeMap]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as SVGElement).tagName === "rect") {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    },
    [isPanning, panStart]
  );

  const handleMouseUp = () => setIsPanning(false);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.max(0.3, Math.min(3, z - e.deltaY * 0.001)));
  }, []);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedNode(null);
    setHoveredNode(null);
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 3.5rem)" }}>
      {/* Header */}
      <div className="border-b border-border bg-card/30 px-4 sm:px-6 py-3 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/results/${review.id}`)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link to={`/results/${review.id}`} className="hover:text-foreground transition-colors">Results</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium">Code Map</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {/* Stats overlay */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 left-4 z-10 rounded-xl border border-border bg-card/90 backdrop-blur-sm p-4 shadow-lg max-w-xs"
        >
          <p className="text-xs text-muted-foreground">We analyzed</p>
          <p className="text-base font-bold text-foreground">
            {review.stats.filesIncluded} files ({review.stats.totalLines.toLocaleString()} lines)
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            → Focused on{" "}
            <span className="text-primary font-medium">{review.stats.tokensUsed} important lines</span>{" "}
            ({(review.stats.compressionRatio * 100).toFixed(0)}% reduction!)
          </p>
        </motion.div>

        {/* Controls overlay */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-4 right-4 z-10 space-y-2"
        >
          <div className="flex flex-col rounded-xl border border-border bg-card/90 backdrop-blur-sm overflow-hidden shadow-lg">
            <button onClick={() => setZoom((z) => Math.min(3, z + 0.2))} className="p-2 hover:bg-accent transition-colors border-b border-border" title="Zoom In">
              <ZoomIn className="h-4 w-4 text-foreground" />
            </button>
            <button onClick={() => setZoom((z) => Math.max(0.3, z - 0.2))} className="p-2 hover:bg-accent transition-colors border-b border-border" title="Zoom Out">
              <ZoomOut className="h-4 w-4 text-foreground" />
            </button>
            <button onClick={resetView} className="p-2 hover:bg-accent transition-colors" title="Reset View">
              <RotateCcw className="h-4 w-4 text-foreground" />
            </button>
          </div>

          <div className="rounded-xl border border-border bg-card/90 backdrop-blur-sm p-3 space-y-2 shadow-lg">
            {(Object.keys(filters) as NodeStatus[]).map((status) => (
              <label key={status} className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={filters[status]}
                  onChange={() => setFilters((f) => ({ ...f, [status]: !f[status] }))}
                  className="rounded border-border"
                />
                <span className={`h-2.5 w-2.5 rounded-full ${STATUS_BG[status]}`} />
                <span className="text-muted-foreground">{STATUS_LABELS[status]}</span>
              </label>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card/90 backdrop-blur-sm overflow-hidden shadow-lg">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5">
              <Search className="h-3 w-3 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Find file..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground w-24"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 z-10 rounded-lg border border-border bg-card/90 backdrop-blur-sm px-3 py-2 text-[10px] text-muted-foreground space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-success" /> Analyzed (green)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-muted-foreground/30" /> Skipped (gray)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-warning" /> Partial (yellow)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-[10px] border-t border-muted-foreground" /> Connected
          </div>
        </div>

        {/* Graph canvas */}
        <svg
          ref={svgRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <rect width="100%" height="100%" fill="transparent" />
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {filteredEdges.map((edge, i) => {
              const source = nodeMap.get(edge.source);
              const target = nodeMap.get(edge.target);
              if (!source || !target) return null;
              const isHighlighted = highlightedEdges.has(i);
              return (
                <line
                  key={`${edge.source}-${edge.target}`}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  stroke={isHighlighted ? "hsl(217, 91%, 60%)" : "hsl(217, 20%, 20%)"}
                  strokeWidth={isHighlighted ? 2 : 1}
                  strokeDasharray={edge.type === "indirect" ? "4 4" : "none"}
                  opacity={highlightedEdges.size > 0 ? (isHighlighted ? 1 : 0.15) : 0.5}
                  style={{ transition: "all 0.2s" }}
                />
              );
            })}

            {filteredNodes.map((node) => {
              const isHighlighted = highlightedNodes.has(node.id);
              const isSearchResult = searchResults.size > 0 && searchResults.has(node.id);
              const isSelected = selectedNode?.id === node.id;
              const radius = 8 + node.importance * 12;
              const dimmed =
                (highlightedNodes.size > 0 && !isHighlighted) ||
                (searchResults.size > 0 && !isSearchResult);

              return (
                <g
                  key={node.id}
                  style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                  opacity={dimmed ? 0.2 : 1}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setSelectedNode(isSelected ? null : node)}
                >
                  {(isHighlighted || isSelected) && node.status !== "excluded" && (
                    <circle cx={node.x} cy={node.y} r={radius + 6} fill={STATUS_COLORS[node.status]} opacity={0.15} />
                  )}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius}
                    fill={node.status === "excluded" ? "hsl(224, 30%, 13%)" : STATUS_COLORS[node.status]}
                    stroke={isSelected ? "hsl(217, 91%, 60%)" : node.status === "excluded" ? "hsl(215, 20%, 35%)" : STATUS_COLORS[node.status]}
                    strokeWidth={isSelected ? 2.5 : node.status === "excluded" ? 1.5 : 0}
                    opacity={node.status === "excluded" ? 0.6 : 1}
                  />
                  <text
                    x={node.x}
                    y={node.y + radius + 14}
                    textAnchor="middle"
                    fill={dimmed ? "hsl(215, 20%, 35%)" : "hsl(215, 20%, 55%)"}
                    fontSize={10}
                    fontFamily="'Plus Jakarta Sans', sans-serif"
                    fontWeight={isSelected ? 600 : 400}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Selected node panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 z-20 border-t border-border bg-card/95 backdrop-blur-md p-5 max-h-[45%] overflow-auto"
            >
              <div className="max-w-3xl mx-auto">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-bold text-foreground">{selectedNode.label}</h3>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                          selectedNode.status === "included"
                            ? "bg-success/15 text-success border-success/20"
                            : selectedNode.status === "excluded"
                            ? "bg-secondary text-muted-foreground border-border"
                            : "bg-warning/15 text-warning border-warning/20"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${STATUS_BG[selectedNode.status]}`} />
                        {STATUS_LABELS[selectedNode.status]}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">{selectedNode.path}</p>
                  </div>
                  <button onClick={() => setSelectedNode(null)} className="rounded-md p-1 hover:bg-accent transition-colors">
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="rounded-lg bg-secondary p-3">
                    <p className="text-lg font-bold text-foreground font-mono">{selectedNode.lines}</p>
                    <p className="text-[10px] text-muted-foreground">Lines</p>
                  </div>
                  <div className="rounded-lg bg-secondary p-3">
                    <p className="text-lg font-bold text-foreground font-mono">{selectedNode.tokensUsed}</p>
                    <p className="text-[10px] text-muted-foreground">Tokens</p>
                  </div>
                  <div className="rounded-lg bg-secondary p-3">
                    <p className="text-lg font-bold text-foreground font-mono">
                      {selectedNode.importance >= 0.8 ? "High" : selectedNode.importance >= 0.5 ? "Medium" : "Low"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Importance</p>
                  </div>
                </div>

                <div className="rounded-lg bg-primary/5 border border-primary/10 p-3 mb-4">
                  <p className="text-xs font-semibold text-primary mb-1">
                    Why {selectedNode.status === "included" ? "analyzed" : selectedNode.status === "excluded" ? "skipped" : "partially analyzed"}:
                  </p>
                  <p className="text-xs text-muted-foreground">{selectedNode.reason}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">
                    Connected to ({getNodeDeps(selectedNode.id).length}):
                  </p>
                  <div className="space-y-1">
                    {getNodeDeps(selectedNode.id).map((dep) => (
                      <button
                        key={dep.node.id}
                        onClick={() => setSelectedNode(dep.node)}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-accent/50 transition-colors"
                      >
                        <span className={`h-2 w-2 rounded-full ${STATUS_BG[dep.node.status]}`} />
                        <span className="text-foreground">{dep.node.label}</span>
                        <span className="text-muted-foreground">
                          → {dep.direction === "out" ? "imports" : "imported by"}
                        </span>
                        {dep.node.status === "excluded" && (
                          <span className="text-[10px] text-muted-foreground ml-auto">(skipped)</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
