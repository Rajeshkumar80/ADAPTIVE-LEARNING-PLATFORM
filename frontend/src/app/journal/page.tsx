'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  CodeJournalBlock, CodeJournalProject, CONTENT_TYPES, CONTENT_TYPE_LIST,
} from '@/lib/codejournal/types';
import {
  loadProjects, saveProjects, getActiveProjectId, setActiveProjectId,
  createProject, newBlockId,
} from '@/lib/codejournal/storage';
import { detectContentType, stripInlineTag } from '@/lib/codejournal/detect';
import { enrichBlock, synthesize } from '@/lib/codejournal/ai';
import { seedProject } from '@/lib/codejournal/seed';
import { exportCodeJournal, exportMarkdown, exportKnowledgeDoc, downloadFile } from '@/lib/codejournal/export';
import { Sidebar } from '@/components/sidebar';
import { GraphArea } from '@/components/codejournal/GraphArea';
import { TilingArea } from '@/components/codejournal/TilingArea';
import { KanbanArea } from '@/components/codejournal/KanbanArea';
import { SynthesisPanel } from '@/components/codejournal/SynthesisPanel';
import {
  BookOpen, Sparkles, Download, Upload, Search, X, Plus,
  Pin, PinOff, Trash2, Link2, ChevronRight, Network,
  Loader2, Send, LayoutGrid, Columns3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type View = 'tiling' | 'kanban' | 'graph';

export default function CodeJournalPage() {
  const [projects, setProjects]           = useState<CodeJournalProject[]>([]);
  const [activeId, setActiveId]           = useState<string>('');
  const [view, setView]                   = useState<View>('graph');
  const [selectedBlock, setSelectedBlock] = useState<CodeJournalBlock | null>(null);
  const [showSynthesis, setShowSynthesis] = useState(false);
  const [synthesisLoading, setSynthesisLoading] = useState(false);
  const [search, setSearch]               = useState('');
  const [showSearch, setShowSearch]       = useState(false);
  const [hydrated, setHydrated]           = useState(false);
  const [entryText, setEntryText]         = useState('');
  const [isAdding, setIsAdding]           = useState(false);

  useEffect(() => {
    const loaded = loadProjects();
    if (loaded.length === 0) {
      const seeded = seedProject();
      setProjects([seeded]); setActiveId(seeded.id);
      saveProjects([seeded]); setActiveProjectId(seeded.id);
    } else {
      setProjects(loaded);
      const cachedId = getActiveProjectId();
      const validId = cachedId && loaded.find(p => p.id === cachedId) ? cachedId : loaded[0].id;
      setActiveId(validId); setActiveProjectId(validId);
    }
    setHydrated(true);
  }, []);

  useEffect(() => { if (hydrated && projects.length > 0) saveProjects(projects); }, [projects, hydrated]);

  const activeProject = useMemo(() => projects.find(p => p.id === activeId), [projects, activeId]);

  const updateActiveProject = useCallback((updater: (p: CodeJournalProject) => CodeJournalProject) => {
    setProjects(prev => prev.map(p => p.id === activeId ? { ...updater(p), updatedAt: Date.now() } : p));
  }, [activeId]);

  const addEntry = useCallback(async (text: string) => {
    if (!activeProject || !text.trim()) return;
    setIsAdding(true);
    const detected = detectContentType(text);
    const cleanText = stripInlineTag(text);
    const blockId = newBlockId();
    const initial: CodeJournalBlock = {
      id: blockId, text: cleanText, timestamp: Date.now(),
      contentType: detected.type, category: 'General', isEnriching: true,
    };
    updateActiveProject(p => ({ ...p, blocks: [initial, ...p.blocks] }));
    try {
      const enriched = await enrichBlock(text, activeProject.blocks);
      updateActiveProject(p => ({
        ...p, blocks: p.blocks.map(b => b.id === blockId ? { ...b, ...enriched, isEnriching: false } : b),
      }));
    } catch {
      updateActiveProject(p => ({
        ...p, blocks: p.blocks.map(b => b.id === blockId ? { ...b, isEnriching: false, isError: true } : b),
      }));
    } finally { setIsAdding(false); }
  }, [activeProject, updateActiveProject]);

  const handleSubmit = () => {
    const t = entryText.trim();
    if (!t || isAdding) return;
    addEntry(t); setEntryText('');
  };

  const deleteBlock = useCallback((id: string) => {
    updateActiveProject(p => ({ ...p, blocks: p.blocks.filter(b => b.id !== id) }));
    if (selectedBlock?.id === id) setSelectedBlock(null);
  }, [updateActiveProject, selectedBlock]);

  const togglePin = useCallback((id: string) => {
    updateActiveProject(p => ({ ...p, blocks: p.blocks.map(b => b.id === id ? { ...b, isPinned: !b.isPinned } : b) }));
  }, [updateActiveProject]);

  const toggleCategory = useCallback((cat: string) => {
    updateActiveProject(p => ({
      ...p,
      collapsedCategories: p.collapsedCategories.includes(cat)
        ? p.collapsedCategories.filter(c => c !== cat)
        : [...p.collapsedCategories, cat],
    }));
  }, [updateActiveProject]);

  const runSynthesis = useCallback(async () => {
    if (!activeProject) return;
    setSynthesisLoading(true);
    try { const r = await synthesize(activeProject.blocks); updateActiveProject(p => ({ ...p, synthesis: r })); }
    catch (e) { console.error(e); }
    finally { setSynthesisLoading(false); }
  }, [activeProject, updateActiveProject]);

  const switchProject = (id: string) => { setActiveId(id); setActiveProjectId(id); setSelectedBlock(null); };

  const createNewProject = () => {
    const name = prompt('Project name:', `Project ${projects.length + 1}`);
    if (!name) return;
    const p = createProject(name); setProjects(prev => [...prev, p]); switchProject(p.id);
  };

  const loadDemoData = () => {
    if (!confirm('Replace current project with sample data?')) return;
    const seeded = seedProject(); seeded.id = activeId; seeded.name = activeProject?.name || 'Sample Journal';
    setProjects(prev => prev.map(p => p.id === activeId ? seeded : p));
  };

  const handleExport = (format: 'codejournal' | 'markdown' | 'knowledge') => {
    if (!activeProject) return;
    const fn = activeProject.name.replace(/\s+/g, '_');
    if (format === 'codejournal') downloadFile(exportCodeJournal(activeProject), `${fn}.codejournal`, 'application/json');
    else if (format === 'markdown') downloadFile(exportMarkdown(activeProject), `${fn}.md`, 'text/markdown');
    else downloadFile(exportKnowledgeDoc(activeProject), `${fn}_knowledge.md`, 'text/markdown');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.codejournal,.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string);
          if (data.project) {
            const imp: CodeJournalProject = { ...data.project, id: data.project.id + '_imported', name: `${data.project.name} (imported)` };
            setProjects(prev => [...prev, imp]); switchProject(imp.id);
          }
        } catch { alert('Invalid file format'); }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const filteredBlocks = useMemo(() => {
    if (!activeProject) return [];
    if (!search.trim()) return activeProject.blocks;
    const q = search.toLowerCase();
    return activeProject.blocks.filter(b =>
      b.text.toLowerCase().includes(q) || b.category.toLowerCase().includes(q) ||
      (b.annotation && b.annotation.toLowerCase().includes(q))
    );
  }, [activeProject, search]);

  const stats = useMemo(() => {
    if (!activeProject) return { total: 0, byType: {} as Record<string, number> };
    const byType: Record<string, number> = {};
    for (const b of activeProject.blocks) byType[b.contentType] = (byType[b.contentType] || 0) + 1;
    return { total: activeProject.blocks.length, byType };
  }, [activeProject]);

  const relatedBlocks = useMemo(() => {
    if (!selectedBlock || !activeProject) return [];
    const ids = new Set(selectedBlock.influencedBy || []);
    for (const b of activeProject.blocks) if (b.influencedBy?.includes(selectedBlock.id)) ids.add(b.id);
    return activeProject.blocks.filter(b => ids.has(b.id));
  }, [selectedBlock, activeProject]);

  if (!hydrated || !activeProject) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-foreground border-t-transparent" />
        </div>
      </div>
    );
  }

  const selectedCfg = selectedBlock ? (CONTENT_TYPES[selectedBlock.contentType] ?? CONTENT_TYPES['concept']) : null;

  return (
    <div className="flex h-screen bg-background overflow-hidden">

      {/* ── LEFT SIDEBAR (nav) ─────────────────────────────────────────── */}
      <Sidebar />

      {/* ── MAIN AREA ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* ── TOP HEADER ──────────────────────────────────────────────── */}
        <header className="flex items-center gap-3 px-5 h-11 border-b border-border bg-background flex-shrink-0">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-red-500" />
            <span className="text-sm font-bold tracking-tight lowercase">codejournal</span>
          </div>

          {/* Project tabs */}
          <div className="flex items-center gap-1 overflow-x-auto flex-1 min-w-0">
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => switchProject(p.id)}
                className={cn(
                  'flex items-center gap-1 px-2.5 h-6 rounded text-[11px] font-medium whitespace-nowrap transition-colors',
                  p.id === activeId ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-muted/60'
                )}
              >
                <ChevronRight className="w-2.5 h-2.5" />
                {p.name}
                <span className="text-[10px] font-mono text-muted-foreground">({p.blocks.length})</span>
              </button>
            ))}
            <button onClick={createNewProject} className="p-1 hover:bg-muted rounded text-muted-foreground ml-1">
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* View tabs */}
          <div className="flex items-center gap-0.5 border border-border rounded-md p-0.5 flex-shrink-0">
            {([
              { v: 'tiling' as View, icon: LayoutGrid, label: 'Tiling' },
              { v: 'kanban' as View, icon: Columns3,   label: 'Kanban' },
              { v: 'graph'  as View, icon: Network,    label: 'Graph'  },
            ] as const).map(({ v, icon: Icon, label }) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'flex items-center gap-1 px-2 h-6 rounded text-[11px] font-medium transition-colors',
                  view === v ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted'
                )}
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>

          {/* Node type pills */}
          <div className="hidden lg:flex items-center gap-1.5 flex-shrink-0">
            {Object.entries(stats.byType).slice(0, 4).map(([type, count]) => {
              const cfg = CONTENT_TYPES[type as keyof typeof CONTENT_TYPES];
              if (!cfg) return null;
              return (
                <span key={type} className="px-1.5 py-0.5 rounded text-white text-[10px] font-medium"
                  style={{ backgroundColor: cfg.iconColor }}>
                  {count} {cfg.label.toUpperCase()}
                </span>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto flex-shrink-0">
            {showSearch ? (
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search..." className="h-6 pl-6 pr-6 text-[11px] border border-border rounded bg-background focus:outline-none focus:border-foreground w-36" />
                <button onClick={() => { setSearch(''); setShowSearch(false); }} className="absolute right-1.5 top-1/2 -translate-y-1/2">
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <button onClick={() => setShowSearch(true)} className="p-1.5 hover:bg-muted rounded text-muted-foreground">
                <Search className="w-3.5 h-3.5" />
              </button>
            )}
            <button onClick={() => setShowSynthesis(true)} className="p-1.5 hover:bg-muted rounded text-muted-foreground" title="Synthesize">
              <Sparkles className="w-3.5 h-3.5" />
            </button>
            <div className="relative group">
              <button className="p-1.5 hover:bg-muted rounded text-muted-foreground" title="Export">
                <Download className="w-3.5 h-3.5" />
              </button>
              <div className="absolute right-0 top-8 bg-background border border-border rounded-lg shadow-lg w-44 hidden group-hover:block z-50 py-1">
                {([['codejournal', '.codejournal backup'], ['markdown', 'Markdown'], ['knowledge', 'Knowledge doc']] as const).map(([fmt, label]) => (
                  <button key={fmt} onClick={() => handleExport(fmt)}
                    className="w-full text-left px-3 py-1.5 text-[11px] hover:bg-muted text-foreground">{label}</button>
                ))}
                <div className="border-t border-border my-1" />
                <button onClick={loadDemoData} className="w-full text-left px-3 py-1.5 text-[11px] hover:bg-muted text-muted-foreground">Load sample data</button>
              </div>
            </div>
            <button onClick={handleImport} className="p-1.5 hover:bg-muted rounded text-muted-foreground" title="Import">
              <Upload className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* ── SPLIT CONTENT ───────────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden min-h-0">

          {/* LEFT — canvas */}
          <div className="flex-1 relative overflow-hidden bg-muted/20 min-w-0">
            {view === 'graph' && (
              filteredBlocks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Network className="w-12 h-12 text-muted-foreground/20 mb-4" />
                  <p className="text-sm font-medium text-muted-foreground mb-1">No entries yet</p>
                  <p className="text-xs text-muted-foreground/60">Type something below to get started</p>
                </div>
              ) : (
                <GraphArea blocks={filteredBlocks} onBlockClick={setSelectedBlock} />
              )
            )}
            {view === 'tiling' && (
              <div className="h-full overflow-y-auto p-6">
                <TilingArea
                  blocks={filteredBlocks}
                  collapsedCategories={activeProject.collapsedCategories}
                  onToggleCategory={toggleCategory}
                  onDelete={deleteBlock}
                  onTogglePin={togglePin}
                  onBlockClick={setSelectedBlock}
                />
              </div>
            )}
            {view === 'kanban' && (
              <div className="h-full overflow-x-auto overflow-y-auto p-6">
                <KanbanArea
                  blocks={filteredBlocks}
                  onDelete={deleteBlock}
                  onTogglePin={togglePin}
                  onBlockClick={setSelectedBlock}
                />
              </div>
            )}

            {/* Graph overlay hint */}
            {view === 'graph' && filteredBlocks.length > 0 && (
              <div className="absolute top-3 left-3 text-[10px] text-muted-foreground/60 font-mono pointer-events-none">
                {filteredBlocks.length} nodes · grab to move · scroll to zoom
              </div>
            )}
          </div>

          {/* RIGHT — detail / entry list panel */}
          <div className="w-80 xl:w-96 border-l border-border bg-background flex flex-col overflow-hidden flex-shrink-0">
            {selectedBlock && selectedCfg ? (
              /* Block detail */
              <div className="flex flex-col h-full overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: selectedCfg.iconColor }}>
                      <selectedCfg.Icon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: selectedCfg.iconColor }}>
                        {selectedCfg.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-2 font-mono">{selectedBlock.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => togglePin(selectedBlock.id)} className="p-1 hover:bg-muted rounded text-muted-foreground">
                      {selectedBlock.isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => deleteBlock(selectedBlock.id)} className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setSelectedBlock(null)} className="p-1 hover:bg-muted rounded text-muted-foreground">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {new Date(selectedBlock.timestamp).toLocaleString()}
                  </p>
                  <p className="text-sm font-semibold leading-relaxed">{selectedBlock.text}</p>
                  {selectedBlock.confidence && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Confidence</span>
                      <span className="font-mono text-xs" style={{ color: selectedCfg.iconColor }}>
                        {'●'.repeat(selectedBlock.confidence)}
                        <span className="opacity-30">{'●'.repeat(5 - selectedBlock.confidence)}</span>
                      </span>
                    </div>
                  )}
                  {selectedBlock.annotation && (
                    <div className="rounded-lg p-3 text-xs leading-relaxed text-muted-foreground border-l-2"
                      style={{ borderColor: selectedCfg.iconColor, backgroundColor: selectedCfg.iconColor + '0d' }}>
                      {selectedBlock.annotation}
                    </div>
                  )}
                  {relatedBlocks.length > 0 && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Link2 className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                          Related ({relatedBlocks.length})
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {relatedBlocks.map(b => {
                          const rcfg = CONTENT_TYPES[b.contentType] ?? CONTENT_TYPES['concept'];
                          return (
                            <button key={b.id} onClick={() => setSelectedBlock(b)}
                              className="w-full text-left p-2.5 rounded-lg border border-border hover:bg-muted/40 transition-colors">
                              <div className="flex items-center gap-1.5 mb-1">
                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: rcfg.iconColor }} />
                                <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: rcfg.iconColor }}>{rcfg.label}</span>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">{b.text}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {selectedBlock.sources && selectedBlock.sources.length > 0 && (
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium block mb-1.5">Sources</span>
                      {selectedBlock.sources.map((s, i) => (
                        <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                          className="block text-xs text-blue-600 hover:underline truncate">{s.title}</a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Entry list */
              <div className="flex flex-col h-full overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between flex-shrink-0">
                  <span className="text-xs font-semibold">Entries</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{filteredBlocks.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filteredBlocks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-6">
                      <p className="text-xs text-muted-foreground">No entries yet. Start typing below.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/50">
                      {filteredBlocks.map(b => {
                        const cfg = CONTENT_TYPES[b.contentType] ?? CONTENT_TYPES['concept'];
                        return (
                          <button key={b.id} onClick={() => setSelectedBlock(b)}
                            className="w-full text-left px-4 py-3 hover:bg-muted/40 transition-colors">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.iconColor }} />
                              <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: cfg.iconColor }}>{cfg.label}</span>
                              {b.isEnriching && <Loader2 className="w-2.5 h-2.5 animate-spin text-muted-foreground ml-auto" />}
                              <span className="text-[10px] text-muted-foreground/50 font-mono ml-auto">
                                {new Date(b.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-foreground line-clamp-2 leading-relaxed">{b.text}</p>
                            {b.annotation && (
                              <p className="text-[10px] text-muted-foreground line-clamp-1 mt-1 italic">{b.annotation}</p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── BOTTOM INPUT BAR ──────────────────────────────────────────── */}
        <div className="border-t border-border bg-background flex-shrink-0">
          <div className="flex items-center gap-3 px-5 py-3">
            <span className="text-[11px] font-mono text-muted-foreground flex-shrink-0 select-none">ENTRY</span>
            <input
              value={entryText}
              onChange={e => setEntryText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
              placeholder="what did you learn today? AI will classify and annotate..."
              disabled={isAdding}
              className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground/40 disabled:opacity-50 min-w-0"
            />
            <div className="flex items-center gap-2 flex-shrink-0">
              {isAdding && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
              <button
                onClick={handleSubmit}
                disabled={!entryText.trim() || isAdding}
                className="flex items-center gap-1.5 px-3 h-7 bg-foreground text-background rounded text-[11px] font-medium hover:bg-foreground/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-3 h-3" />
                Add
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-5 pb-2.5 overflow-x-auto">
            {CONTENT_TYPE_LIST.slice(0, 6).map(ct => {
              const cfg = CONTENT_TYPES[ct];
              return (
                <button key={ct} onClick={() => setEntryText(`#${ct} `)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border transition-colors hover:opacity-80 flex-shrink-0"
                  style={{ borderColor: cfg.iconColor + '50', color: cfg.iconColor, backgroundColor: cfg.iconColor + '12' }}>
                  <cfg.Icon className="w-2.5 h-2.5" />
                  #{ct}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Synthesis panel */}
      {showSynthesis && (
        <SynthesisPanel
          synthesis={activeProject.synthesis || null}
          loading={synthesisLoading}
          blockCount={activeProject.blocks.filter(b => !b.isEnriching && !b.isError).length}
          onSynthesize={runSynthesis}
          onClose={() => setShowSynthesis(false)}
        />
      )}
    </div>
  );
}
