'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { CodeJournalBlock, CONTENT_TYPES } from '@/lib/codejournal/types';
import { Network } from 'lucide-react';

interface Props {
  blocks: CodeJournalBlock[];
  onBlockClick?: (block: CodeJournalBlock) => void;
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  block: CodeJournalBlock;
  radius: number;
  bx?: number; // base x for drift
  by?: number; // base y for drift
  phase: number; // per-node drift phase
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

interface HoverState {
  block: CodeJournalBlock;
  x: number;
  y: number;
  connectedIds: Set<string>;
}

const TYPE_ABBR: Record<string, string> = {
  concept:    'C',
  confusion:  '?',
  edgecase:   'E',
  synthesis:  'S',
  conflict:   'X',
  assignment: 'A',
  resolved:   '✓',
  definition: 'D',
  hypothesis: 'H',
};

const DRIFT_AMP    = 5;    // px amplitude of idle float
const DRIFT_PERIOD = 4000; // ms per full cycle

export function GraphArea({ blocks, onBlockClick }: Props) {
  const svgRef       = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const driftRafRef  = useRef<number>(0);
  const [hover, setHover] = useState<HoverState | null>(null);

  const onClickRef = useRef(onBlockClick);
  useEffect(() => { onClickRef.current = onBlockClick; }, [onBlockClick]);

  const buildGraph = useCallback(() => {
    if (!svgRef.current || !containerRef.current || blocks.length === 0) return;

    const width  = containerRef.current.clientWidth  || 800;
    const height = containerRef.current.clientHeight || 600;

    const nodes: GraphNode[] = blocks.map((b, i) => ({
      id:     b.id,
      block:  b,
      radius: Math.max(22, Math.min(36, 22 + b.text.length / 25)),  // bigger nodes like reference
      phase:  (i / blocks.length) * Math.PI * 2,
    }));

    const links: GraphLink[] = [];
    const nodeIds   = new Set(nodes.map(n => n.id));
    const adjacency: Record<string, Set<string>> = {};
    nodes.forEach(n => { adjacency[n.id] = new Set(); });

    for (const b of blocks) {
      if (b.influencedBy) {
        for (const fromId of b.influencedBy) {
          if (nodeIds.has(fromId)) {
            links.push({ source: fromId, target: b.id });
            adjacency[fromId].add(b.id);
            adjacency[b.id].add(fromId);
          }
        }
      }
    }

    // ── SVG ───────────────────────────────────────────────────────────────
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('width', '100%').attr('height', '100%');

    const defs = svg.append('defs');

    // Glow filter
    const glow = defs.append('filter')
      .attr('id', 'node-glow')
      .attr('x', '-60%').attr('y', '-60%')
      .attr('width', '220%').attr('height', '220%');
    glow.append('feGaussianBlur').attr('stdDeviation', '5').attr('result', 'blur');
    const glowMerge = glow.append('feMerge');
    glowMerge.append('feMergeNode').attr('in', 'blur');
    glowMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Radial gradients per color
    const usedColors = new Set(nodes.map(n => CONTENT_TYPES[n.block.contentType]?.iconColor ?? '#6366f1'));
    usedColors.forEach(color => {
      const id = `grad-${color.replace('#', '')}`;
      const grad = defs.append('radialGradient')
        .attr('id', id).attr('cx', '35%').attr('cy', '35%').attr('r', '65%');
      grad.append('stop').attr('offset', '0%').attr('stop-color', lighten(color, 0.35));
      grad.append('stop').attr('offset', '100%').attr('stop-color', color);
    });

    const g = svg.append('g');

    // Zoom & pan (on background only — node drag handles its own pointer events)
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.25, 4])
      .filter(ev => ev.type !== 'mousedown') // don't zoom on node mousedown
      .on('zoom', ev => g.attr('transform', ev.transform.toString()));
    svg.call(zoom);

    // ── Force simulation ──────────────────────────────────────────────────
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force('link',    d3.forceLink<GraphNode, GraphLink>(links).id(d => d.id).distance(110).strength(0.5))
      .force('charge',  d3.forceManyBody<GraphNode>().strength(-350))
      .force('center',  d3.forceCenter(width / 2, height / 2).strength(0.06))
      .force('collide', d3.forceCollide<GraphNode>().radius(d => d.radius + 10))
      .alphaDecay(0.025)
      .velocityDecay(0.35);

    // ── Links ─────────────────────────────────────────────────────────────
    const linkSel = g.append('g').attr('class', 'links')
      .selectAll<SVGLineElement, GraphLink>('line')
      .data(links).join('line')
      .attr('stroke', 'hsl(240 6% 78%)')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.55);

    // ── Nodes ─────────────────────────────────────────────────────────────
    const nodeSel = g.append('g').attr('class', 'nodes')
      .selectAll<SVGGElement, GraphNode>('g')
      .data(nodes).join('g')
      .style('cursor', 'grab');

    nodeSel.append('circle')
      .attr('class', 'pulse-ring')
      .attr('r', d => d.radius + 6)
      .attr('fill', 'none')
      .attr('stroke', d => CONTENT_TYPES[d.block.contentType]?.iconColor ?? '#6366f1')
      .attr('stroke-width', 2).attr('stroke-opacity', 0)
      .style('pointer-events', 'none');

    nodeSel.append('circle')
      .attr('r', d => d.radius + 4)
      .attr('fill', d => CONTENT_TYPES[d.block.contentType]?.iconColor ?? '#6366f1')
      .attr('fill-opacity', 0.12)
      .style('pointer-events', 'none');

    nodeSel.append('circle')
      .attr('class', 'main-circle')
      .attr('r', d => d.radius)
      .attr('fill', d => {
        const color = CONTENT_TYPES[d.block.contentType]?.iconColor ?? '#6366f1';
        return `url(#grad-${color.replace('#', '')})`;
      })
      .attr('stroke', 'white').attr('stroke-width', 2.5).attr('stroke-opacity', 0.9);

    nodeSel.append('text')
      .text(d => TYPE_ABBR[d.block.contentType] ?? '?')
      .attr('text-anchor', 'middle').attr('dy', '0.36em')
      .attr('font-size', d => d.radius * 0.88).attr('font-weight', '700')
      .attr('fill', 'white').attr('pointer-events', 'none');

    // ── Render helper (used by drift, drag, and tick) ─────────────────────
    const render = () => {
      linkSel
        .attr('x1', d => (d.source as GraphNode).x ?? 0)
        .attr('y1', d => (d.source as GraphNode).y ?? 0)
        .attr('x2', d => (d.target as GraphNode).x ?? 0)
        .attr('y2', d => (d.target as GraphNode).y ?? 0);
      nodeSel.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`);
    };

    // ── Simulation tick ───────────────────────────────────────────────────
    simulation.on('tick', render);

    // ── Drift ─────────────────────────────────────────────────────────────
    // Defined BEFORE drag so drag's .on('end') can call startDrift()
    let driftActive = false;

    const stopDrift = () => {
      driftActive = false;
      if (driftRafRef.current) {
        cancelAnimationFrame(driftRafRef.current);
        driftRafRef.current = 0;
      }
    };

    const startDrift = () => {
      stopDrift(); // cancel any existing loop first
      driftActive = true;
      nodes.forEach(n => { n.bx = n.x; n.by = n.y; });

      const tick = () => {
        if (!driftActive) return;
        const t = performance.now();
        nodes.forEach(n => {
          if (n.bx == null || n.by == null) return;
          n.x = n.bx + Math.sin(t / DRIFT_PERIOD * Math.PI * 2 + n.phase) * DRIFT_AMP;
          n.y = n.by + Math.cos(t / DRIFT_PERIOD * Math.PI * 2 + n.phase * 1.3) * DRIFT_AMP;
        });
        render();
        driftRafRef.current = requestAnimationFrame(tick);
      };

      driftRafRef.current = requestAnimationFrame(tick);
    };

    // Start drift once simulation cools
    const alphaCheck = setInterval(() => {
      if (simulation.alpha() < 0.015) {
        clearInterval(alphaCheck);
        simulation.stop();
        startDrift();
      }
    }, 300);

    // ── Drag — moves the WHOLE graph ──────────────────────────────────────
    let dragStartX = 0;
    let dragStartY = 0;
    let snapshots: Array<{ node: GraphNode; x: number; y: number }> = [];

    nodeSel.call(
      d3.drag<SVGGElement, GraphNode>()
        .on('start', (ev) => {
          stopDrift();
          simulation.stop();
          nodeSel.style('cursor', 'grabbing');
          dragStartX = ev.x;
          dragStartY = ev.y;
          snapshots = nodes.map(n => ({ node: n, x: n.x ?? 0, y: n.y ?? 0 }));
        })
        .on('drag', (ev) => {
          const dx = ev.x - dragStartX;
          const dy = ev.y - dragStartY;
          snapshots.forEach(({ node, x, y }) => {
            node.x = x + dx;
            node.y = y + dy;
          });
          render();
        })
        .on('end', () => {
          nodeSel.style('cursor', 'grab');
          // Update base positions to where we dropped, then resume drift
          nodes.forEach(n => { n.bx = n.x; n.by = n.y; });
          startDrift();
        })
    );

    // ── Click ─────────────────────────────────────────────────────────────
    nodeSel.on('click', (ev: MouseEvent, d) => {
      ev.stopPropagation();
      onClickRef.current?.(d.block);
    });

    // ── Hover ─────────────────────────────────────────────────────────────
    nodeSel
      .on('mouseenter', function (ev: MouseEvent, d) {
        const connected = new Set(adjacency[d.id] ?? []);
        connected.add(d.id);

        d3.select<SVGGElement, GraphNode>(this).select<SVGCircleElement>('.main-circle')
          .transition().duration(150).attr('r', d.radius * 1.35).attr('stroke-width', 3.5);
        d3.select<SVGGElement, GraphNode>(this).select<SVGCircleElement>('.pulse-ring')
          .transition().duration(150).attr('stroke-opacity', 0.55);
        d3.select<SVGGElement, GraphNode>(this).style('filter', 'url(#node-glow)');

        nodeSel.select<SVGCircleElement>('.main-circle').transition().duration(150)
          .attr('fill-opacity', (n: GraphNode) => connected.has(n.id) ? 1 : 0.18);
        nodeSel.select<SVGTextElement>('text').transition().duration(150)
          .attr('opacity', (n: GraphNode) => connected.has(n.id) ? 1 : 0.25);

        linkSel.transition().duration(150)
          .attr('stroke-opacity', (l: GraphLink) => {
            const s = typeof l.source === 'string' ? l.source : (l.source as GraphNode).id;
            const t = typeof l.target === 'string' ? l.target : (l.target as GraphNode).id;
            return s === d.id || t === d.id ? 1 : 0.08;
          })
          .attr('stroke-width', (l: GraphLink) => {
            const s = typeof l.source === 'string' ? l.source : (l.source as GraphNode).id;
            const t = typeof l.target === 'string' ? l.target : (l.target as GraphNode).id;
            return s === d.id || t === d.id ? 2.5 : 1;
          })
          .attr('stroke', (l: GraphLink) => {
            const s = typeof l.source === 'string' ? l.source : (l.source as GraphNode).id;
            const t = typeof l.target === 'string' ? l.target : (l.target as GraphNode).id;
            return s === d.id || t === d.id
              ? (CONTENT_TYPES[d.block.contentType]?.iconColor ?? '#6366f1')
              : 'hsl(240 6% 78%)';
          });

        const rect = containerRef.current!.getBoundingClientRect();
        setHover({ block: d.block, x: ev.clientX - rect.left, y: ev.clientY - rect.top, connectedIds: connected });
      })
      .on('mousemove', function (ev: MouseEvent) {
        const rect = containerRef.current!.getBoundingClientRect();
        setHover(prev => prev ? { ...prev, x: ev.clientX - rect.left, y: ev.clientY - rect.top } : null);
      })
      .on('mouseleave', function (_, d) {
        d3.select<SVGGElement, GraphNode>(this).select<SVGCircleElement>('.main-circle')
          .transition().duration(200).attr('r', d.radius).attr('stroke-width', 2.5);
        d3.select<SVGGElement, GraphNode>(this).select<SVGCircleElement>('.pulse-ring')
          .transition().duration(200).attr('stroke-opacity', 0);
        d3.select<SVGGElement, GraphNode>(this).style('filter', null);

        nodeSel.select<SVGCircleElement>('.main-circle').transition().duration(200).attr('fill-opacity', 1);
        nodeSel.select<SVGTextElement>('text').transition().duration(200).attr('opacity', 1);
        linkSel.transition().duration(200)
          .attr('stroke-opacity', 0.55).attr('stroke-width', 1.5).attr('stroke', 'hsl(240 6% 78%)');

        setHover(null);
      });

    return () => {
      simulation.stop();
      clearInterval(alphaCheck);
      stopDrift();
    };
  }, [blocks]);

  useEffect(() => {
    const cleanup = buildGraph();
    return cleanup;
  }, [buildGraph]);

  if (blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Network className="w-10 h-10 text-muted-foreground/40 mb-4" />
        <p className="text-sm font-medium mb-1">Graph is empty</p>
        <p className="text-xs text-muted-foreground">Add at least 2 entries to see connections</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden"
    >
      <svg ref={svgRef} className="w-full h-full" />

      {hover && <HoverTooltip hover={hover} containerRef={containerRef} />}
    </div>
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────────

interface TooltipProps {
  hover: HoverState;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function HoverTooltip({ hover, containerRef }: TooltipProps) {
  const cfg  = CONTENT_TYPES[hover.block.contentType] ?? CONTENT_TYPES['concept'];
  const Icon = cfg.Icon;

  const TOOLTIP_W = 288;
  const OFFSET    = 18;
  const cw = containerRef.current?.clientWidth  ?? 900;
  const ch = containerRef.current?.clientHeight ?? 600;

  const showLeft = hover.x + OFFSET + TOOLTIP_W > cw - 12;
  const left = Math.max(8, Math.min(showLeft ? hover.x - TOOLTIP_W - OFFSET : hover.x + OFFSET, cw - TOOLTIP_W - 8));
  const top  = Math.max(8, Math.min(hover.y + OFFSET, ch - 200));

  return (
    <div className="absolute z-50 pointer-events-none graph-tooltip-enter" style={{ left, top, width: TOOLTIP_W }}>
      <div className="bg-background border border-border rounded-xl shadow-lg overflow-hidden">
        <div className="px-3 py-2 flex items-center gap-2"
          style={{ backgroundColor: cfg.iconColor + '18', borderBottom: `1px solid ${cfg.iconColor}30` }}>
          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: cfg.iconColor }}>
            <Icon className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs font-semibold" style={{ color: cfg.iconColor }}>{cfg.label}</span>
          {hover.block.category && (
            <span className="text-[10px] text-muted-foreground ml-auto truncate max-w-[100px]">
              {hover.block.category}
            </span>
          )}
        </div>
        <div className="px-3 py-2.5 space-y-2">
          <p className="text-xs leading-relaxed line-clamp-4 text-foreground">{hover.block.text}</p>
          {hover.block.annotation && (
            <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3 italic border-l-2 pl-2"
              style={{ borderColor: cfg.iconColor + '60' }}>
              {hover.block.annotation}
            </p>
          )}
          <div className="flex items-center justify-between pt-1.5 border-t border-border text-[10px] text-muted-foreground">
            {hover.block.confidence ? (
              <span className="font-mono tracking-widest" style={{ color: cfg.iconColor }}>
                {'●'.repeat(hover.block.confidence)}
                <span className="opacity-30">{'●'.repeat(5 - hover.block.confidence)}</span>
              </span>
            ) : <span />}
            <span>
              {hover.connectedIds.size > 1
                ? `${hover.connectedIds.size - 1} connection${hover.connectedIds.size - 1 === 1 ? '' : 's'}`
                : 'No connections'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function lighten(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.round(r + (255 - r) * amount)},${Math.round(g + (255 - g) * amount)},${Math.round(b + (255 - b) * amount)})`;
}
