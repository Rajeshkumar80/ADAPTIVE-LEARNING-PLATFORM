import {
  BookOpen,
  HelpCircle,
  Zap,
  Sparkles,
  Scale,
  CheckSquare,
  Check,
  FileText,
  Lightbulb,
  type LucideIcon,
} from "lucide-react"

export type ContentType =
  | "concept"
  | "confusion"
  | "edgecase"
  | "synthesis"
  | "conflict"
  | "assignment"
  | "resolved"
  | "definition"
  | "hypothesis"

export interface ContentTypeConfig {
  label: string
  icon: LucideIcon
  accentVar: string
}

export const CONTENT_TYPE_CONFIG: Record<ContentType, ContentTypeConfig> = {
  concept:    { label: "Concept",    icon: BookOpen,     accentVar: "var(--type-concept)" },
  confusion:  { label: "Confusion",  icon: HelpCircle,  accentVar: "var(--type-confusion)" },
  edgecase:   { label: "Edge Case",  icon: Zap,         accentVar: "var(--type-edgecase)" },
  synthesis:  { label: "Synthesis",  icon: Sparkles,    accentVar: "var(--type-synthesis)" },
  conflict:   { label: "Conflict",   icon: Scale,       accentVar: "var(--type-conflict)" },
  assignment: { label: "Assignment", icon: CheckSquare, accentVar: "var(--type-assignment)" },
  resolved:   { label: "Resolved",   icon: Check,       accentVar: "var(--type-resolved)" },
  definition: { label: "Definition", icon: FileText,    accentVar: "var(--type-definition)" },
  hypothesis: { label: "Hypothesis", icon: Lightbulb,   accentVar: "var(--type-hypothesis)" },
}

export const ALL_CONTENT_TYPES = Object.keys(CONTENT_TYPE_CONFIG) as ContentType[]

