/**
 * Database Query Functions for Native AI
 * 
 * Type-safe query functions for all content types:
 * - Apps (iOS/macOS applications)
 * - Workflows (n8n automation templates)
 * - Shortcuts (iOS/macOS Shortcuts)
 * - MCPs (Model Context Protocol tools)
 * - Creators (Featured creators)
 * 
 * Performance Notes:
 * - All queries use React.cache() for Next.js 15 optimization
 * - Recommended indexes: slug, category, platform, isPaid, isFeatured
 * - Default limit: 20, Maximum limit: 100
 */

import { cache } from 'react';
import { db } from '@/db';
import { 
  apps, 
  workflows, 
  shortcuts, 
  mcps, 
  creators 
} from '@/db/schema';
import { 
  like, 
  and, 
  or, 
  eq, 
  ne,
  desc, 
  asc, 
  sql,
  inArray
} from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type App = InferSelectModel<typeof apps>;
export type Workflow = InferSelectModel<typeof workflows>;
export type Shortcut = InferSelectModel<typeof shortcuts>;
export type MCP = InferSelectModel<typeof mcps>;
export type Creator = InferSelectModel<typeof creators>;

// ============================================================================
// QUERY PARAMETER TYPES
// ============================================================================

export interface GetAppsParams {
  search?: string;
  category?: string;
  platform?: 'iOS' | 'macOS' | 'Cross-platform';
  pricing?: 'free' | 'paid' | 'all';
  tags?: string[];
  sort?: 'newest' | 'popular' | 'top-rated' | 'recently-updated' | 'a-z';
  limit?: number;
  offset?: number;
}

export interface GetWorkflowsParams {
  search?: string;
  category?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  tags?: string[];
  sort?: 'newest' | 'popular' | 'top-rated';
  limit?: number;
  offset?: number;
}

export interface GetShortcutsParams {
  search?: string;
  category?: string;
  platform?: 'iOS' | 'macOS' | 'Both';
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  tags?: string[];
  sort?: 'newest' | 'popular' | 'top-rated';
  limit?: number;
  offset?: number;
}

export interface GetMCPsParams {
  search?: string;
  category?: string;
  platform?: string;
  provider?: string;
  integrations?: string[];
  sort?: 'newest' | 'popular' | 'top-rated';
  limit?: number;
  offset?: number;
}

export interface GetCreatorsParams {
  search?: string;
  expertise?: string[];
  verified?: boolean;
  sort?: 'newest' | 'popular' | 'a-z';
  limit?: number;
  offset?: number;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Clamps the limit value between 1 and 100
 */
function clampLimit(limit?: number): number {
  const DEFAULT_LIMIT = 20;
  const MAX_LIMIT = 100;
  if (!limit || limit < 1) return DEFAULT_LIMIT;
  return Math.min(limit, MAX_LIMIT);
}

/**
 * Validates and returns sort parameter with fallback
 */
function validateSort<T extends string>(
  sort: string | undefined, 
  validSorts: T[], 
  defaultSort: T
): T {
  if (!sort || !validSorts.includes(sort as T)) {
    return defaultSort;
  }
  return sort as T;
}

/**
 * Creates a case-insensitive LIKE pattern for search
 */
function searchPattern(term: string): string {
  return `%${term.toLowerCase()}%`;
}

// ============================================================================
// APPS QUERIES
// ============================================================================

/**
 * Get apps with filtering, sorting, and pagination
 * 
 * @param params - Query parameters for filtering and sorting
 * @returns Array of apps matching the criteria
 * 
 * @example
 * const apps = await getApps({
 *   search: 'notes',
 *   category: 'Productivity',
 *   platform: 'iOS',
 *   pricing: 'free',
 *   sort: 'top-rated',
 *   limit: 24
 * });
 */
export const getApps = cache(async (params?: GetAppsParams): Promise<App[]> => {
  try {
    const {
      search,
      category,
      platform,
      pricing = 'all',
      tags,
      sort = 'newest',
      limit,
      offset = 0
    } = params || {};

    const conditions = [];

    // Search filter (case-insensitive across name, developer, description)
    if (search?.trim()) {
      const pattern = searchPattern(search.trim());
      conditions.push(
        or(
          sql`LOWER(${apps.name}) LIKE ${pattern}`,
          sql`LOWER(${apps.developer}) LIKE ${pattern}`,
          sql`LOWER(${apps.description}) LIKE ${pattern}`
        )
      );
    }

    // Category filter
    if (category) {
      conditions.push(eq(apps.category, category));
    }

    // Platform filter
    if (platform) {
      conditions.push(eq(apps.platform, platform));
    }

    // Pricing filter
    if (pricing === 'free') {
      conditions.push(eq(apps.isPaid, false));
    } else if (pricing === 'paid') {
      conditions.push(eq(apps.isPaid, true));
    }

    // Tags filter (OR logic - match any tag)
    if (tags && tags.length > 0) {
      const tagConditions = tags.map(tag => 
        sql`${apps.tags} LIKE ${'%' + tag + '%'}`
      );
      conditions.push(or(...tagConditions));
    }

    // Build order by clause
    const validSorts = ['newest', 'popular', 'top-rated', 'recently-updated', 'a-z'] as const;
    const validatedSort = validateSort(sort, [...validSorts], 'newest');
    
    let orderBy;
    switch (validatedSort) {
      case 'popular':
        orderBy = desc(apps.reviewsCount);
        break;
      case 'top-rated':
        orderBy = desc(apps.rating);
        break;
      case 'recently-updated':
        orderBy = desc(apps.updatedAt);
        break;
      case 'a-z':
        orderBy = asc(apps.name);
        break;
      case 'newest':
      default:
        orderBy = desc(apps.createdAt);
    }

    const query = db
      .select()
      .from(apps)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(clampLimit(limit))
      .offset(offset);

    return await query;
  } catch (error) {
    console.error('[getApps] Error fetching apps:', error, { params });
    return [];
  }
});

/**
 * Get a single app by its URL slug
 * 
 * @param slug - The unique slug identifier for the app
 * @returns The app if found, null otherwise
 */
export const getAppBySlug = cache(async (slug: string): Promise<App | null> => {
  try {
    if (!slug?.trim()) return null;

    const result = await db
      .select()
      .from(apps)
      .where(eq(apps.slug, slug.trim()))
      .limit(1);

    return result[0] ?? null;
  } catch (error) {
    console.error('[getAppBySlug] Error fetching app:', error, { slug });
    return null;
  }
});

/**
 * Get featured/highlighted apps for homepage hero section
 * 
 * @param limit - Maximum number of featured apps to return (default: 6)
 * @returns Array of featured apps
 */
export const getFeaturedApps = cache(async (limit: number = 6): Promise<App[]> => {
  try {
    return await db
      .select()
      .from(apps)
      .where(eq(apps.isFeatured, true))
      .orderBy(desc(apps.createdAt))
      .limit(clampLimit(limit));
  } catch (error) {
    console.error('[getFeaturedApps] Error fetching featured apps:', error);
    return [];
  }
});

/**
 * Get related apps based on category (excluding current app)
 * 
 * @param currentAppId - ID of the current app to exclude
 * @param limit - Maximum number of related apps to return (default: 6)
 * @returns Array of related apps in the same category
 */
export const getRelatedApps = cache(async (
  currentAppId: number, 
  limit: number = 6
): Promise<App[]> => {
  try {
    // First get the current app's category
    const currentApp = await db
      .select({ category: apps.category })
      .from(apps)
      .where(eq(apps.id, currentAppId))
      .limit(1);

    if (!currentApp[0]?.category) return [];

    return await db
      .select()
      .from(apps)
      .where(
        and(
          eq(apps.category, currentApp[0].category),
          ne(apps.id, currentAppId)
        )
      )
      .orderBy(desc(apps.rating))
      .limit(clampLimit(limit));
  } catch (error) {
    console.error('[getRelatedApps] Error fetching related apps:', error, { currentAppId });
    return [];
  }
});

// ============================================================================
// WORKFLOWS QUERIES
// ============================================================================

/**
 * Get workflows with filtering, sorting, and pagination
 * 
 * @param params - Query parameters for filtering and sorting
 * @returns Array of workflows matching the criteria
 */
export const getWorkflows = cache(async (params?: GetWorkflowsParams): Promise<Workflow[]> => {
  try {
    const {
      search,
      category,
      difficulty,
      tags,
      sort = 'newest',
      limit,
      offset = 0
    } = params || {};

    const conditions = [];

    // Search filter
    if (search?.trim()) {
      const pattern = searchPattern(search.trim());
      conditions.push(
        or(
          sql`LOWER(${workflows.name}) LIKE ${pattern}`,
          sql`LOWER(${workflows.description}) LIKE ${pattern}`,
          sql`LOWER(${workflows.author}) LIKE ${pattern}`
        )
      );
    }

    // Category filter
    if (category) {
      conditions.push(eq(workflows.category, category));
    }

    // Difficulty filter
    if (difficulty) {
      conditions.push(eq(workflows.difficulty, difficulty));
    }

    // Tags filter (OR logic)
    if (tags && tags.length > 0) {
      const tagConditions = tags.map(tag => 
        sql`${workflows.tags} LIKE ${'%' + tag + '%'}`
      );
      conditions.push(or(...tagConditions));
    }

    // Build order by clause
    const validSorts = ['newest', 'popular', 'top-rated'] as const;
    const validatedSort = validateSort(sort, [...validSorts], 'newest');
    
    let orderBy;
    switch (validatedSort) {
      case 'popular':
        orderBy = desc(workflows.reviewsCount);
        break;
      case 'top-rated':
        orderBy = desc(workflows.rating);
        break;
      case 'newest':
      default:
        orderBy = desc(workflows.createdAt);
    }

    return await db
      .select()
      .from(workflows)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(clampLimit(limit))
      .offset(offset);
  } catch (error) {
    console.error('[getWorkflows] Error fetching workflows:', error, { params });
    return [];
  }
});

/**
 * Get a single workflow by its URL slug
 */
export const getWorkflowBySlug = cache(async (slug: string): Promise<Workflow | null> => {
  try {
    if (!slug?.trim()) return null;

    const result = await db
      .select()
      .from(workflows)
      .where(eq(workflows.slug, slug.trim()))
      .limit(1);

    return result[0] ?? null;
  } catch (error) {
    console.error('[getWorkflowBySlug] Error fetching workflow:', error, { slug });
    return null;
  }
});

/**
 * Get featured workflows for homepage
 */
export const getFeaturedWorkflows = cache(async (limit: number = 6): Promise<Workflow[]> => {
  try {
    return await db
      .select()
      .from(workflows)
      .where(eq(workflows.isFeatured, true))
      .orderBy(desc(workflows.createdAt))
      .limit(clampLimit(limit));
  } catch (error) {
    console.error('[getFeaturedWorkflows] Error fetching featured workflows:', error);
    return [];
  }
});

/**
 * Get related workflows based on category
 */
export const getRelatedWorkflows = cache(async (
  currentWorkflowId: number, 
  limit: number = 6
): Promise<Workflow[]> => {
  try {
    const currentWorkflow = await db
      .select({ category: workflows.category })
      .from(workflows)
      .where(eq(workflows.id, currentWorkflowId))
      .limit(1);

    if (!currentWorkflow[0]?.category) return [];

    return await db
      .select()
      .from(workflows)
      .where(
        and(
          eq(workflows.category, currentWorkflow[0].category),
          ne(workflows.id, currentWorkflowId)
        )
      )
      .orderBy(desc(workflows.rating))
      .limit(clampLimit(limit));
  } catch (error) {
    console.error('[getRelatedWorkflows] Error fetching related workflows:', error, { currentWorkflowId });
    return [];
  }
});

// ============================================================================
// SHORTCUTS QUERIES
// ============================================================================

/**
 * Get shortcuts with filtering, sorting, and pagination
 */
export const getShortcuts = cache(async (params?: GetShortcutsParams): Promise<Shortcut[]> => {
  try {
    const {
      search,
      category,
      platform,
      difficulty,
      tags,
      sort = 'newest',
      limit,
      offset = 0
    } = params || {};

    const conditions = [];

    // Search filter
    if (search?.trim()) {
      const pattern = searchPattern(search.trim());
      conditions.push(
        or(
          sql`LOWER(${shortcuts.name}) LIKE ${pattern}`,
          sql`LOWER(${shortcuts.description}) LIKE ${pattern}`,
          sql`LOWER(${shortcuts.author}) LIKE ${pattern}`
        )
      );
    }

    // Category filter
    if (category) {
      conditions.push(eq(shortcuts.category, category));
    }

    // Platform filter
    if (platform) {
      conditions.push(eq(shortcuts.platform, platform));
    }

    // Difficulty filter
    if (difficulty) {
      conditions.push(eq(shortcuts.difficulty, difficulty));
    }

    // Tags filter (OR logic)
    if (tags && tags.length > 0) {
      const tagConditions = tags.map(tag => 
        sql`${shortcuts.tags} LIKE ${'%' + tag + '%'}`
      );
      conditions.push(or(...tagConditions));
    }

    // Build order by clause
    const validSorts = ['newest', 'popular', 'top-rated'] as const;
    const validatedSort = validateSort(sort, [...validSorts], 'newest');
    
    let orderBy;
    switch (validatedSort) {
      case 'popular':
        orderBy = desc(shortcuts.reviewsCount);
        break;
      case 'top-rated':
        orderBy = desc(shortcuts.rating);
        break;
      case 'newest':
      default:
        orderBy = desc(shortcuts.createdAt);
    }

    return await db
      .select()
      .from(shortcuts)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(clampLimit(limit))
      .offset(offset);
  } catch (error) {
    console.error('[getShortcuts] Error fetching shortcuts:', error, { params });
    return [];
  }
});

/**
 * Get a single shortcut by its URL slug
 */
export const getShortcutBySlug = cache(async (slug: string): Promise<Shortcut | null> => {
  try {
    if (!slug?.trim()) return null;

    const result = await db
      .select()
      .from(shortcuts)
      .where(eq(shortcuts.slug, slug.trim()))
      .limit(1);

    return result[0] ?? null;
  } catch (error) {
    console.error('[getShortcutBySlug] Error fetching shortcut:', error, { slug });
    return null;
  }
});

/**
 * Get featured shortcuts for homepage
 */
export const getFeaturedShortcuts = cache(async (limit: number = 6): Promise<Shortcut[]> => {
  try {
    return await db
      .select()
      .from(shortcuts)
      .where(eq(shortcuts.isFeatured, true))
      .orderBy(desc(shortcuts.createdAt))
      .limit(clampLimit(limit));
  } catch (error) {
    console.error('[getFeaturedShortcuts] Error fetching featured shortcuts:', error);
    return [];
  }
});

/**
 * Get related shortcuts based on category
 */
export const getRelatedShortcuts = cache(async (
  currentShortcutId: number, 
  limit: number = 6
): Promise<Shortcut[]> => {
  try {
    const currentShortcut = await db
      .select({ category: shortcuts.category })
      .from(shortcuts)
      .where(eq(shortcuts.id, currentShortcutId))
      .limit(1);

    if (!currentShortcut[0]?.category) return [];

    return await db
      .select()
      .from(shortcuts)
      .where(
        and(
          eq(shortcuts.category, currentShortcut[0].category),
          ne(shortcuts.id, currentShortcutId)
        )
      )
      .orderBy(desc(shortcuts.rating))
      .limit(clampLimit(limit));
  } catch (error) {
    console.error('[getRelatedShortcuts] Error fetching related shortcuts:', error, { currentShortcutId });
    return [];
  }
});

// ============================================================================
// MCPS QUERIES
// ============================================================================

/**
 * Get MCPs with filtering, sorting, and pagination
 */
export const getMCPs = cache(async (params?: GetMCPsParams): Promise<MCP[]> => {
  try {
    const {
      search,
      category,
      platform,
      provider,
      integrations,
      sort = 'newest',
      limit,
      offset = 0
    } = params || {};

    const conditions = [];

    // Search filter
    if (search?.trim()) {
      const pattern = searchPattern(search.trim());
      conditions.push(
        or(
          sql`LOWER(${mcps.name}) LIKE ${pattern}`,
          sql`LOWER(${mcps.description}) LIKE ${pattern}`,
          sql`LOWER(${mcps.provider}) LIKE ${pattern}`
        )
      );
    }

    // Category filter
    if (category) {
      conditions.push(eq(mcps.category, category));
    }

    // Platform filter
    if (platform) {
      conditions.push(eq(mcps.platform, platform));
    }

    // Provider filter
    if (provider) {
      conditions.push(eq(mcps.provider, provider));
    }

    // Integrations filter (OR logic)
    if (integrations && integrations.length > 0) {
      const integrationConditions = integrations.map(integration => 
        sql`${mcps.integrations} LIKE ${'%' + integration + '%'}`
      );
      conditions.push(or(...integrationConditions));
    }

    // Build order by clause
    const validSorts = ['newest', 'popular', 'top-rated'] as const;
    const validatedSort = validateSort(sort, [...validSorts], 'newest');
    
    let orderBy;
    switch (validatedSort) {
      case 'popular':
        orderBy = desc(mcps.reviewsCount);
        break;
      case 'top-rated':
        orderBy = desc(mcps.rating);
        break;
      case 'newest':
      default:
        orderBy = desc(mcps.createdAt);
    }

    return await db
      .select()
      .from(mcps)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(clampLimit(limit))
      .offset(offset);
  } catch (error) {
    console.error('[getMCPs] Error fetching MCPs:', error, { params });
    return [];
  }
});

/**
 * Get a single MCP by its URL slug
 */
export const getMCPBySlug = cache(async (slug: string): Promise<MCP | null> => {
  try {
    if (!slug?.trim()) return null;

    const result = await db
      .select()
      .from(mcps)
      .where(eq(mcps.slug, slug.trim()))
      .limit(1);

    return result[0] ?? null;
  } catch (error) {
    console.error('[getMCPBySlug] Error fetching MCP:', error, { slug });
    return null;
  }
});

/**
 * Get featured MCPs for homepage
 */
export const getFeaturedMCPs = cache(async (limit: number = 6): Promise<MCP[]> => {
  try {
    return await db
      .select()
      .from(mcps)
      .where(eq(mcps.isFeatured, true))
      .orderBy(desc(mcps.createdAt))
      .limit(clampLimit(limit));
  } catch (error) {
    console.error('[getFeaturedMCPs] Error fetching featured MCPs:', error);
    return [];
  }
});

/**
 * Get related MCPs based on category
 */
export const getRelatedMCPs = cache(async (
  currentMCPId: number, 
  limit: number = 6
): Promise<MCP[]> => {
  try {
    const currentMCP = await db
      .select({ category: mcps.category })
      .from(mcps)
      .where(eq(mcps.id, currentMCPId))
      .limit(1);

    if (!currentMCP[0]?.category) return [];

    return await db
      .select()
      .from(mcps)
      .where(
        and(
          eq(mcps.category, currentMCP[0].category),
          ne(mcps.id, currentMCPId)
        )
      )
      .orderBy(desc(mcps.rating))
      .limit(clampLimit(limit));
  } catch (error) {
    console.error('[getRelatedMCPs] Error fetching related MCPs:', error, { currentMCPId });
    return [];
  }
});

// ============================================================================
// CREATORS QUERIES
// ============================================================================

/**
 * Get creators with filtering, sorting, and pagination
 */
export const getCreators = cache(async (params?: GetCreatorsParams): Promise<Creator[]> => {
  try {
    const {
      search,
      expertise,
      verified,
      sort = 'newest',
      limit,
      offset = 0
    } = params || {};

    const conditions = [];

    // Search filter
    if (search?.trim()) {
      const pattern = searchPattern(search.trim());
      conditions.push(
        or(
          sql`LOWER(${creators.name}) LIKE ${pattern}`,
          sql`LOWER(${creators.bio}) LIKE ${pattern}`
        )
      );
    }

    // Expertise filter (OR logic)
    if (expertise && expertise.length > 0) {
      const expertiseConditions = expertise.map(exp => 
        sql`${creators.expertise} LIKE ${'%' + exp + '%'}`
      );
      conditions.push(or(...expertiseConditions));
    }

    // Verified filter
    if (verified !== undefined) {
      conditions.push(eq(creators.verified, verified));
    }

    // Build order by clause
    const validSorts = ['newest', 'popular', 'a-z'] as const;
    const validatedSort = validateSort(sort, [...validSorts], 'newest');
    
    let orderBy;
    switch (validatedSort) {
      case 'popular':
        orderBy = desc(creators.createdAt);
        break;
      case 'a-z':
        orderBy = asc(creators.name);
        break;
      case 'newest':
      default:
        orderBy = desc(creators.createdAt);
    }

    return await db
      .select()
      .from(creators)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(clampLimit(limit))
      .offset(offset);
  } catch (error) {
    console.error('[getCreators] Error fetching creators:', error, { params });
    return [];
  }
});

/**
 * Get a single creator by their URL slug
 */
export const getCreatorBySlug = cache(async (slug: string): Promise<Creator | null> => {
  try {
    if (!slug?.trim()) return null;

    const result = await db
      .select()
      .from(creators)
      .where(eq(creators.slug, slug.trim()))
      .limit(1);

    return result[0] ?? null;
  } catch (error) {
    console.error('[getCreatorBySlug] Error fetching creator:', error, { slug });
    return null;
  }
});

/**
 * Get featured creators for homepage
 */
export const getFeaturedCreators = cache(async (limit: number = 6): Promise<Creator[]> => {
  try {
    return await db
      .select()
      .from(creators)
      .where(eq(creators.isFeatured, true))
      .orderBy(desc(creators.createdAt))
      .limit(clampLimit(limit));
  } catch (error) {
    console.error('[getFeaturedCreators] Error fetching featured creators:', error);
    return [];
  }
});

// ============================================================================
// CROSS-CONTENT QUERIES
// ============================================================================

/**
 * Get all content created by a specific creator
 * Note: creatorId columns don't exist in current schema, returning empty arrays
 * 
 * @param creatorId - The creator's ID
 * @returns Object containing arrays of apps, workflows, shortcuts, and MCPs
 */
export const getCreatorContent = cache(async (creatorId: number): Promise<{
  apps: App[];
  workflows: Workflow[];
  shortcuts: Shortcut[];
  mcps: MCP[];
}> => {
  // creatorId columns don't exist in current schema
  // Return empty arrays until schema is updated
  return {
    apps: [],
    workflows: [],
    shortcuts: [],
    mcps: []
  };
});

/**
 * Global search across all content types
 * 
 * @param query - Search query string
 * @param limit - Maximum results per content type (default: 5)
 * @returns Object containing arrays of matching items from each content type
 * 
 * @example
 * const results = await globalSearch('productivity', 10);
 * // Returns { apps: [...], workflows: [...], shortcuts: [...], mcps: [...], creators: [...] }
 */
export const globalSearch = cache(async (
  query: string, 
  limit: number = 5
): Promise<{
  apps: App[];
  workflows: Workflow[];
  shortcuts: Shortcut[];
  mcps: MCP[];
  creators: Creator[];
}> => {
  try {
    if (!query?.trim()) {
      return {
        apps: [],
        workflows: [],
        shortcuts: [],
        mcps: [],
        creators: []
      };
    }

    const pattern = searchPattern(query.trim());
    const resultLimit = clampLimit(limit);

    const [
      matchingApps,
      matchingWorkflows,
      matchingShortcuts,
      matchingMCPs,
      matchingCreators
    ] = await Promise.all([
      // Search apps
      db
        .select()
        .from(apps)
        .where(
          or(
            sql`LOWER(${apps.name}) LIKE ${pattern}`,
            sql`LOWER(${apps.developer}) LIKE ${pattern}`,
            sql`LOWER(${apps.description}) LIKE ${pattern}`,
            sql`LOWER(${apps.category}) LIKE ${pattern}`
          )
        )
        .orderBy(desc(apps.rating))
        .limit(resultLimit),

      // Search workflows
      db
        .select()
        .from(workflows)
        .where(
          or(
            sql`LOWER(${workflows.name}) LIKE ${pattern}`,
            sql`LOWER(${workflows.description}) LIKE ${pattern}`,
            sql`LOWER(${workflows.category}) LIKE ${pattern}`
          )
        )
        .orderBy(desc(workflows.rating))
        .limit(resultLimit),

      // Search shortcuts
      db
        .select()
        .from(shortcuts)
        .where(
          or(
            sql`LOWER(${shortcuts.name}) LIKE ${pattern}`,
            sql`LOWER(${shortcuts.description}) LIKE ${pattern}`,
            sql`LOWER(${shortcuts.category}) LIKE ${pattern}`
          )
        )
        .orderBy(desc(shortcuts.rating))
        .limit(resultLimit),

      // Search MCPs
      db
        .select()
        .from(mcps)
        .where(
          or(
            sql`LOWER(${mcps.name}) LIKE ${pattern}`,
            sql`LOWER(${mcps.description}) LIKE ${pattern}`,
            sql`LOWER(${mcps.provider}) LIKE ${pattern}`,
            sql`LOWER(${mcps.category}) LIKE ${pattern}`
          )
        )
        .orderBy(desc(mcps.rating))
        .limit(resultLimit),

      // Search creators
      db
        .select()
        .from(creators)
        .where(
          or(
            sql`LOWER(${creators.name}) LIKE ${pattern}`,
            sql`LOWER(${creators.bio}) LIKE ${pattern}`
          )
        )
        .orderBy(desc(creators.createdAt))
        .limit(resultLimit)
    ]);

    return {
      apps: matchingApps,
      workflows: matchingWorkflows,
      shortcuts: matchingShortcuts,
      mcps: matchingMCPs,
      creators: matchingCreators
    };
  } catch (error) {
    console.error('[globalSearch] Error performing global search:', error, { query });
    return {
      apps: [],
      workflows: [],
      shortcuts: [],
      mcps: [],
      creators: []
    };
  }
});

// ============================================================================
// UTILITY QUERIES
// ============================================================================

/**
 * Get counts for all content types (useful for stats/dashboard)
 */
export const getContentCounts = cache(async (): Promise<{
  apps: number;
  workflows: number;
  shortcuts: number;
  mcps: number;
  creators: number;
}> => {
  try {
    const [appsCount, workflowsCount, shortcutsCount, mcpsCount, creatorsCount] = await Promise.all([
      db.select({ count: sql<number>`COUNT(*)` }).from(apps),
      db.select({ count: sql<number>`COUNT(*)` }).from(workflows),
      db.select({ count: sql<number>`COUNT(*)` }).from(shortcuts),
      db.select({ count: sql<number>`COUNT(*)` }).from(mcps),
      db.select({ count: sql<number>`COUNT(*)` }).from(creators)
    ]);

    return {
      apps: appsCount[0]?.count ?? 0,
      workflows: workflowsCount[0]?.count ?? 0,
      shortcuts: shortcutsCount[0]?.count ?? 0,
      mcps: mcpsCount[0]?.count ?? 0,
      creators: creatorsCount[0]?.count ?? 0
    };
  } catch (error) {
    console.error('[getContentCounts] Error fetching content counts:', error);
    return {
      apps: 0,
      workflows: 0,
      shortcuts: 0,
      mcps: 0,
      creators: 0
    };
  }
});

/**
 * Get all unique categories across a content type
 */
export const getAppCategories = cache(async (): Promise<string[]> => {
  try {
    const result = await db
      .selectDistinct({ category: apps.category })
      .from(apps)
      .where(sql`${apps.category} IS NOT NULL`)
      .orderBy(asc(apps.category));

    return result.map(r => r.category).filter((c): c is string => c !== null);
  } catch (error) {
    console.error('[getAppCategories] Error fetching categories:', error);
    return [];
  }
});

export const getWorkflowCategories = cache(async (): Promise<string[]> => {
  try {
    const result = await db
      .selectDistinct({ category: workflows.category })
      .from(workflows)
      .where(sql`${workflows.category} IS NOT NULL`)
      .orderBy(asc(workflows.category));

    return result.map(r => r.category).filter((c): c is string => c !== null);
  } catch (error) {
    console.error('[getWorkflowCategories] Error fetching categories:', error);
    return [];
  }
});

export const getShortcutCategories = cache(async (): Promise<string[]> => {
  try {
    const result = await db
      .selectDistinct({ category: shortcuts.category })
      .from(shortcuts)
      .where(sql`${shortcuts.category} IS NOT NULL`)
      .orderBy(asc(shortcuts.category));

    return result.map(r => r.category).filter((c): c is string => c !== null);
  } catch (error) {
    console.error('[getShortcutCategories] Error fetching categories:', error);
    return [];
  }
});

export const getMCPCategories = cache(async (): Promise<string[]> => {
  try {
    const result = await db
      .selectDistinct({ category: mcps.category })
      .from(mcps)
      .where(sql`${mcps.category} IS NOT NULL`)
      .orderBy(asc(mcps.category));

    return result.map(r => r.category).filter((c): c is string => c !== null);
  } catch (error) {
    console.error('[getMCPCategories] Error fetching categories:', error);
    return [];
  }
});