import type { ComponentType } from "react";

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
