import type { ComponentType, ReactNode } from "react";

// ─── Module Definition ───────────────────────────────────────

export interface ModuleDefinition {
  /** Unique module key, e.g. "sale-wizard" */
  key: string;
  /** Display name, e.g. "תהליך מכירה" */
  label: string;
  /** Maps to config.features.key in the DB */
  featureKey: string;
  /** Semver version */
  version: string;

  /** Pages this module registers (rendered via catch-all /m/[...slug]) */
  routes?: ModuleRoute[];
  /** Sidebar navigation items */
  navItems?: ModuleNavItem[];
  /** Quick action buttons on entity detail pages */
  quickActions?: ModuleQuickAction[];
  /** Custom layout components registered by key */
  layoutComponents?: Record<string, ComponentType<any>>;

  /** Blocks injected into dynamic entity detail pages */
  entityBlocks?: ModuleEntityBlock[];
  /** Supabase schemas & tables this module owns */
  schemas?: ModuleSchema[];
  /** SQL migrations shipped with this module */
  migrations?: ModuleMigration[];
  /** Settings panel component (rendered in /settings) */
  settingsPanel?: ComponentType<any>;
  /** Context providers wrapping the app when module is active */
  providers?: ComponentType<{ children: ReactNode }>[];
  /** API paths that should bypass CSRF (e.g. public signing endpoints) */
  publicApiPaths?: string[];
  /** Public pages that need a route in (public) directory: { path, importFrom } */
  publicPages?: { path: string; importFrom: string }[];
}

// ─── Routes ──────────────────────────────────────────────────

export interface ModuleRoute {
  /** URL slug matched after /m/, e.g. "sales/new" → /m/sales/new */
  slug: string;
  /** Lazy-loaded page component */
  component: () => Promise<{ default: ComponentType<any> }>;
}

// ─── Navigation ──────────────────────────────────────────────

export interface ModuleNavItem {
  /** Full href, e.g. "/m/sales/new" */
  href: string;
  /** Display label */
  label: string;
  /** Lucide icon name */
  icon: string;
  /** Sidebar group name */
  group?: string;
  /** Show under a specific entity in nav */
  parentEntity?: string;
}

// ─── Quick Actions ───────────────────────────────────────────

export interface ModuleQuickAction {
  /** Unique action type key */
  type: string;
  /** Button label */
  label: string;
  /** Lucide icon name */
  icon: string;
  /** Entity types this action applies to */
  entityTypes: string[];
  /** Handler function called on click */
  handler?: (record: Record<string, any>, context: ActionContext) => Promise<void>;
  /** Optional custom dialog component */
  component?: ComponentType<QuickActionProps>;
}

export interface ActionContext {
  entityType: string;
  entityKey: string;
  supabaseUrl: string;
  refreshRecord: () => void;
}

export interface QuickActionProps {
  record: Record<string, any>;
  context: ActionContext;
  onClose: () => void;
}

// ─── Entity Blocks (injected into entity detail pages) ──────

export interface ModuleEntityBlock {
  /** Block type key, e.g. "conversations", "follow_ups", "file_hub" */
  type: string;
  /** Display name shown in layout builder */
  label: string;
  /** The React component to render inside the entity page */
  component: ComponentType<EntityBlockProps>;
  /** Default config for the layout builder */
  defaultConfig?: Record<string, any>;
  /** Lucide icon name for the layout builder */
  icon?: string;
}

export interface EntityBlockProps {
  /** Layout component config from page_layouts */
  config: Record<string, any>;
  /** The full entity record data */
  data: Record<string, unknown>;
  /** Record UUID */
  recordId: string;
  /** Entity type key, e.g. "customers" */
  entityType: string;
  /** DB table name */
  tableName: string;
  /** Block title from layout config */
  title?: string;
  /** Whether the page is in edit mode */
  isEditing?: boolean;
  /** Field change handler */
  onChange?: (fieldName: string, value: unknown) => void;
}

// ─── Schema Registration ────────────────────────────────────

export interface ModuleSchema {
  /** Schema name, e.g. "messaging" */
  name: string;
  /** Tables belonging to this schema */
  tables: ModuleTable[];
}

export interface ModuleTable {
  /** Table name, e.g. "conversations" */
  name: string;
  /** Schema name, e.g. "messaging" */
  schema: string;
}

// ─── Migrations ─────────────────────────────────────────────

export interface ModuleMigration {
  /** Migration version, e.g. "001", "002" — run in order */
  version: string;
  /** SQL to execute */
  sql: string;
  /** Human-readable description */
  description: string;
}
