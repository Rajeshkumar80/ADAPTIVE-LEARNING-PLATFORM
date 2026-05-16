'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { CodeJournalBlock, CONTENT_TYPES } from '@/lib/codejournal/types';

interface Props {
  blocks: CodeJournalBlock[];
  onBlockClick?: (block: CodeJournalBlock) => void;
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  block: CodeJournalBlock;
  radius: number;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

export function GraphArea({ blocks, onBlockClick }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || blocks.length === 0) return;

    const width = containerRef.current.clientWidth;
    const height = 600;

    const nodes: GraphNode[] = blocks.map(b => ({
      id: b.id,
      block: b,
      radius: Math.max(8, Math.min(20, 8 + (b.text.length / 30))),
    }));

    const links: GraphLink[] = [];
    const nodeIds = new Set(nodes.map(n => n.id));

    for (const b of blocks) {
      if (b.influencedBy) {
        for (const fromId of b.influencedBy) {
          if (nodeIds.has(fromId)) {
            links.push({ source: fromId, target: b.id });
          }
        }
      }
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('width', '100%').attr('height', height);

    const g = svg.append('g');

    // Zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
      });
    svg.call(zoom);

    // Force simulation
    const simulation = d3.forceSimulation<GraphNode>(nodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(links).id(d => d.id).distance(80).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide<GraphNode>().radius(d => d.radius + 4));

    // Draw links
    const link = g.append('g')
      .attr('stroke', 'hsl(240 6% 80%)')
      .attr('stroke-width', 1)
      .selectAll('line')
      .data(links)
      .join('line');

    // Draw nodes
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'pointer')
      .on('click', (_, d) => onBlockClick?.(d.block))
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    node.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => {
        const cfg = CONTENT_TYPES[d.block.contentType];
        // map color name to actual hex
        const colorMap: Record<string, string> = {
          'text-blue-700': '#1d4ed8',
          'text-amber-700': '#b45309',
          'text-purple-700': '#7e22ce',
          'text-indigo-700': '#4338ca',
          'text-red-700': '#b91c1c',
          'text-emerald-700': '#047857',
          'text-green-700': '#15803d',
          'text-slate-700': '#334155',
          'text-yellow-700': '#a16207',
        };
        return colorMap[cfg.color] || '#666';
      })
      .attr('fill-opacity', 0.7)
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    node.append('text')
      .text(d => CONTENT_TYPES[d.block.contentType].icon)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', d => d.radius)
      .attr('pointer-events', 'none');

    node.append('title').text(d => `${d.block.text.slice(0, 80)}\n${d.block.category}`);

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x ?? 0)
        .attr('y1', d => (d.source as GraphNode).y ?? 0)
        .attr('x2', d => (d.target as GraphNode).x ?? 0)
        .attr('y2', d => (d.target as GraphNode).y ?? 0);

      node.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [blocks, onBlockClick]);

  if (blocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-5xl mb-4">🕸️</div>
        <p className="text-sm font-medium mb-1">Graph is empty</p>
        <p className="text-xs text-muted-foreground">Add at least 2 entries to see connections</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full border border-border rounded-lg bg-muted/20 overflow-hidden">
      <div className="px-4 py-2 border-b border-border bg-background flex items-center justify-between text-xs text-muted-foreground">
        <span>{blocks.length} nodes · drag to rearrange · scroll to zoom</span>
        <span>Click a node to view details</span>
      </div>
      <svg ref={svgRef} className="w-full" />
    </div>
  );
}
