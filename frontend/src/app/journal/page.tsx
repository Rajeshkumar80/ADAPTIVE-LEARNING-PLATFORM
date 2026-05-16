'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import {
  CodeJournalBlock,
  CodeJournalProject,
  CONTENT_TYPES,
} from '@/lib/codejournal/types';
import {
  loadProjects,
  saveProjects,
  getActiveProjectId,
  setActiveProjectId,
  createProject,
  newBlockId,
} from '@/lib/codejournal/storage';
import { detectContentType, stripInlineTag } from '@/lib/codejournal/detect';
import { enrichBlock, synthesize } from '@/lib/codejournal/ai';
import { seedProject } from '@/lib/codejournal/seed';
import {
  exportCodeJournal,
  exportMarkdown,
  exportKnowledgeDoc,
  downloadFile,
} from '@/lib/codejournal/export';
import { ProjectsBar } from '@/components/codejournal/ProjectsBar';
import { TilingArea } from '@/components/codejournal/TilingArea';
import { KanbanArea } from '@/components/codejournal/KanbanArea';
import { GraphArea } from '@/components/codejournal/GraphArea';
import { EntryInput } from '@/components/codejournal/EntryInput';
import { SynthesisPanel } from '@/components/codejournal/SynthesisPanel';
import { BlockDetail } from '@/components/codejournal/BlockDetail';
import {
  LayoutGrid,
  Columns3,
  Network,
  Sparkles,
  Download,
  Upload,
  Search,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type View = 'tiling' | 'kanban' | 'graph';

export default function CodeJournalPage() {
  const [projects, setProjects] = useState<CodeJournalProject[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [view, setView] = useState<View>('tiling');
  const [showSynthesis, setShowSynthesis] = useState(false);
  const [synthesisLoading, setSynthesisLoading] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<CodeJournalBlock | null>(null);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load projects on mount
  useEffect(() => {
    const loaded = loadProjects();
    if (loaded.length === 0) {
      const seeded = seedProject();
      setProjects([seeded]);
      setActiveId(seeded.id);
      saveProjects([seeded]);
      setActiveProjectId(seeded.id);
    } else {
      setProjects(loaded);
      const cachedId = getActiveProjectId();
      const validId = cachedId && loaded.find(p => p.id === cachedId) ? cachedId : loaded[0].id;
      setActiveId(validId);
      setActiveProjectId(validId);
    }
    setHydrated(true);
  }, []);

  // Persist on change (after hydration)
  useEffect(() => {
    if (hydrated && projects.length > 0) {
      saveProjects(projects);
    }
  }, [projects, hydrated]);

  const activeProject = useMemo(
    () => projects.find(p => p.id === activeId),
    [projects, activeId]
  );

  const updateActiveProject = useCallback(
    (updater: (p: CodeJournalProject) => CodeJournalProject) => {
      setProjects(prev =>
        prev.map(p => (p.id === activeId ? { ...updater(p), updatedAt: Date.now() } : p))
      );
    },
    [activeId]
  );

  // ===== Add entry =====
  const addEntry = useCallback(
    async (text: string) => {
      if (!activeProject) return;

      const detected = detectContentType(text);
      const cleanText = stripInlineTag(text);
      const blockId = newBlockId();

      const initialBlock: CodeJournalBlock = {
        id: blockId,
        text: cleanText,
        timestamp: Date.now(),
        contentType: detected.type,
        category: 'General',
        isEnriching: true,
      };

      // Optimistic add
      updateActiveProject(p => ({ ...p, blocks: [initialBlock, ...p.blocks] }));

      // AI enrich (async, may use backend or fall back)
      try {
        const existingBlocks = activeProject.blocks;
        const enriched = await enrichBlock(text, existingBlocks);

        updateActiveProject(p => ({
          ...p,
          blocks: p.blocks.map(b =>
            b.id === blockId ? { ...b, ...enriched, isEnriching: false } : b
          ),
        }));
      } catch (e) {
        updateActiveProject(p => ({
          ...p,
          blocks: p.blocks.map(b =>
            b.id === blockId ? { ...b, isEnriching: false, isError: true } : b
          ),
        }));
      }
    },
    [activeProject, updateActiveProject]
  );

  // ===== Delete =====
  const deleteBlock = useCallback(
    (id: string) => {
      updateActiveProject(p => ({ ...p, blocks: p.blocks.filter(b => b.id !== id) }));
      if (selectedBlock?.id === id) setSelectedBlock(null);
    },
    [updateActiveProject, selectedBlock]
  );

  const togglePin = useCallback(
    (id: string) => {
      updateActiveProject(p => ({
        ...p,
        blocks: p.blocks.map(b => (b.id === id ? { ...b, isPinned: !b.isPinned } : b)),
      }));
    },
    [updateActiveProject]
  );

  const toggleCategory = useCallback(
    (cat: string) => {
      updateActiveProject(p => ({
        ...p,
        collapsedCategories: p.collapsedCategories.includes(cat)
          ? p.collapsedCategories.filter(c => c !== cat)
          : [...p.collapsedCategories, cat],
      }));
    },
    [updateActiveProject]
  );

  // ===== Synthesis =====
  const runSynthesis = useCallback(async () => {
    if (!activeProject) return;
    setSynthesisLoading(true);
    try {
      const result = await synthesize(activeProject.blocks);
      updateActiveProject(p => ({ ...p, synthesis: result }));
    } catch (e) {
      console.error(e);
    } finally {
      setSynthesisLoading(false);
    }
  }, [activeProject, updateActiveProject]);

  // ===== Project management =====
  const switchProject = (id: string) => {
    setActiveId(id);
    setActiveProjectId(id);
    setSelectedBlock(null);
  };

  const createNewProject = () => {
    const name = prompt('Project name:', `Project ${projects.length + 1}`);
    if (!name) return;
    const project = createProject(name);
    setProjects(prev => [...prev, project]);
    switchProject(project.id);
  };

  const renameProject = (id: string, name: string) => {
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, name } : p)));
  };

  const deleteProject = (id: string) => {
    if (projects.length === 1) return;
    const remaining = projects.filter(p => p.id !== id);
    setProjects(remaining);
    if (activeId === id) {
      switchProject(remaining[0].id);
    }
  };

  // Re-enrich all entries in the current project
  const reEnrichAll = useCallback(async () => {
    if (!activeProject) return;
    const blocksToRedo = [...activeProject.blocks];

    for (const block of blocksToRedo) {
      const enriched = await enrichBlock(block.text, activeProject.blocks.filter(b => b.id !== block.id));
      updateActiveProject(p => ({
        ...p,
        blocks: p.blocks.map(b =>
          b.id === block.id ? { ...b, ...enriched, isEnriching: false } : b
        ),
      }));
    }
  }, [activeProject, updateActiveProject]);

  const loadDemoData = () => {
    if (!confirm('Replace current project with sample journal data? This cannot be undone.')) return;
    const seeded = seedProject();
    seeded.id = activeId;
    seeded.name = activeProject?.name || 'Sample Journal';
    setProjects(prev => prev.map(p => (p.id === activeId ? seeded : p)));
  };

  // ===== Export =====
  const handleExport = (format: 'codejournal' | 'markdown' | 'knowledge') => {
    if (!activeProject) return;
    const filename = activeProject.name.replace(/\s+/g, '_');
    if (format === 'codejournal') {
      downloadFile(exportCodeJournal(activeProject), `${filename}.codejournal`, 'application/json');
    } else if (format === 'markdown') {
      downloadFile(exportMarkdown(activeProject), `${filename}.md`, 'text/markdown');
    } else {
      downloadFile(exportKnowledgeDoc(activeProject), `${filename}_knowledge.md`, 'text/markdown');
    }
  };

  // ===== Import =====
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.codejournal,.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result as string);
          if (data.project) {
            const importedProject: CodeJournalProject = {
              ...data.project,
              id: data.project.id + '_imported',
              name: `${data.project.name} (imported)`,
            };
            setProjects(prev => [...prev, importedProject]);
            switchProject(importedProject.id);
          }
        } catch (err) {
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // ===== Search filter =====
  const filteredBlocks = useMemo(() => {
    if (!activeProject) return [];
    if (!search.trim()) return activeProject.blocks;
    const q = search.toLowerCase();
    return activeProject.blocks.filter(
      b =>
        b.text.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        (b.annotation && b.annotation.toLowerCase().includes(q))
    );
  }, [activeProject, search]);

  // ===== Stats =====
  const stats = useMemo(() => {
    if (!activeProject) return { total: 0, byType: {} as Record<string, number> };
    const byType: Record<string, number> = {};
    for (const b of activeProject.blocks) {
      byType[b.contentType] = (byType[b.contentType] || 0) + 1;
    }
    return { total: activeProject.blocks.length, byType };
  }, [activeProject]);

  // Related blocks for detail
  const relatedBlocks = useMemo(() => {
    if (!selectedBlock || !activeProject) return [];
    const ids = new Set(selectedBlock.influencedBy || []);
    // Also include blocks that point to this one
    for (const b of activeProject.blocks) {
      if (b.influencedBy?.includes(selectedBlock.id)) ids.add(b.id);
    }
    return activeProject.blocks.filter(b => ids.has(b.id));
  }, [selectedBlock, activeProject]);

  if (!hydrated || !activeProject) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-foreground border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        {/* Projects bar */}
        <ProjectsBar
          projects={projects}
          activeId={activeId}
          onSwitch={switchProject}
          onCreate={createNewProject}
          onRename={renameProject}
          onDelete={deleteProject}
        />

        {/* Toolbar */}
        <div className="border-b border-border bg-background px-6 py-3 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1 border border-border rounded-md p-0.5">
            {[
              { v: 'tiling' as View, icon: LayoutGrid, label: 'Tiling' },
              { v: 'kanban' as View, icon: Columns3, label: 'Kanban' },
              { v: 'graph' as View, icon: Network, label: 'Graph' },
            ].map(({ v, icon: Icon, label }) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 h-7 rounded text-xs font-medium transition-colors',
                  view === v
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-muted'
                )}
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>

          {/* Search toggle */}
          {showSearch ? (
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search entries..."
                autoFocus
                className="w-full h-7 pl-8 pr-7 border border-border rounded text-xs focus:outline-none focus:border-foreground"
              />
              <button
                onClick={() => { setSearch(''); setShowSearch(false); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setShowSearch(true)}>
              <Search className="w-3 h-3" />
              Search
            </Button>
          )}

          {/* Stats summary */}
          <div className="hidden md:flex items-center gap-3 text-xs text-muted-foreground ml-2">
            <span>{stats.total} entries</span>
            {Object.entries(stats.byType).slice(0, 4).map(([type, count]) => {
              const cfg = CONTENT_TYPES[type as keyof typeof CONTENT_TYPES];
              return (
                <span key={type} className="flex items-center gap-1">
                  <span>{cfg.icon}</span>
                  <span className="font-mono">{count}</span>
                </span>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={reEnrichAll}
              title="Re-classify all entries with the latest AI"
            >
              <Sparkles className="w-3 h-3" />
              Re-classify
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setShowSynthesis(true)}
            >
              <Sparkles className="w-3 h-3" />
              Synthesize
            </Button>

            {/* Export dropdown via simple button group */}
            <div className="relative group">
              <Button variant="outline" size="sm" className="h-7 text-xs">
                <Download className="w-3 h-3" />
                Export
              </Button>
              <div className="absolute right-0 top-8 bg-background border border-border rounded-md shadow-lg w-48 hidden group-hover:block z-30">
                <button
                  onClick={() => handleExport('codejournal')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-muted"
                >
                  .codejournal (full backup)
                </button>
                <button
                  onClick={() => handleExport('markdown')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-muted"
                >
                  Markdown
                </button>
                <button
                  onClick={() => handleExport('knowledge')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-muted"
                >
                  Knowledge doc
                </button>
                <div className="border-t border-border" />
                <button
                  onClick={loadDemoData}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-muted text-muted-foreground"
                >
                  Load sample data
                </button>
              </div>
            </div>

            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleImport}>
              <Upload className="w-3 h-3" />
              Import
            </Button>
          </div>
        </div>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {view === 'tiling' && (
              <TilingArea
                blocks={filteredBlocks}
                collapsedCategories={activeProject.collapsedCategories}
                onToggleCategory={toggleCategory}
                onDelete={deleteBlock}
                onTogglePin={togglePin}
                onBlockClick={setSelectedBlock}
              />
            )}
            {view === 'kanban' && (
              <KanbanArea
                blocks={filteredBlocks}
                onDelete={deleteBlock}
                onTogglePin={togglePin}
                onBlockClick={setSelectedBlock}
              />
            )}
            {view === 'graph' && (
              <GraphArea blocks={filteredBlocks} onBlockClick={setSelectedBlock} />
            )}
          </div>
        </main>

        {/* Entry input */}
        <EntryInput onSubmit={addEntry} />
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

      {/* Block detail */}
      {selectedBlock && (
        <BlockDetail
          block={selectedBlock}
          relatedBlocks={relatedBlocks}
          onClose={() => setSelectedBlock(null)}
          onDelete={deleteBlock}
          onTogglePin={togglePin}
          onSelectRelated={setSelectedBlock}
        />
      )}
    </div>
  );
}
