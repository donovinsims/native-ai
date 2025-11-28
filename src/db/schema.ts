import { sqliteTable, integer, text, real, index } from 'drizzle-orm/sqlite-core';

// Auth tables for better-auth
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

// Bookmarks table for saving favorite content
export const bookmark = sqliteTable("bookmark", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  contentId: text("content_id").notNull(),
  contentType: text("content_type").notNull(), // "app", "workflow", "shortcut", "mcp", or "creator"
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
}, (table) => ({
  userIdIdx: index("bookmark_user_id_idx").on(table.userId),
  contentTypeIdx: index("bookmark_content_type_idx").on(table.contentType),
  uniqueBookmark: index("bookmark_unique_idx").on(table.userId, table.contentType, table.contentId),
}));

// Apps table for iOS/macOS apps
export const apps = sqliteTable("apps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  developer: text("developer").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  platform: text("platform").notNull(),
  isPaid: integer("is_paid", { mode: "boolean" }).notNull(),
  price: text("price"),
  rating: real("rating"),
  reviewsCount: integer("reviews_count").default(0),
  iconUrl: text("icon_url").notNull(),
  screenshotUrls: text("screenshot_urls", { mode: "json" }).notNull(),
  appStoreUrl: text("app_store_url").notNull(),
  websiteUrl: text("website_url"),
  tags: text("tags", { mode: "json" }).$defaultFn(() => []),
  features: text("features", { mode: "json" }).$defaultFn(() => []),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
}, (table) => ({
  slugIdx: index("apps_slug_idx").on(table.slug),
  categoryIdx: index("apps_category_idx").on(table.category),
  platformIdx: index("apps_platform_idx").on(table.platform),
  isPaidIdx: index("apps_is_paid_idx").on(table.isPaid),
  isFeaturedIdx: index("apps_is_featured_idx").on(table.isFeatured),
  createdAtIdx: index("apps_created_at_idx").on(table.createdAt),
  updatedAtIdx: index("apps_updated_at_idx").on(table.updatedAt),
}));

// Workflows table for n8n workflows
export const workflows = sqliteTable("workflows", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(), // "Beginner", "Intermediate", or "Advanced"
  author: text("author").notNull(),
  authorUrl: text("author_url"),
  thumbnailUrl: text("thumbnail_url").notNull(),
  n8nUrl: text("n8n_url").notNull(),
  rating: real("rating"),
  reviewsCount: integer("reviews_count").default(0),
  tags: text("tags", { mode: "json" }).$defaultFn(() => []), // JSON array
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
}, (table) => ({
  slugIdx: index("workflows_slug_idx").on(table.slug),
  categoryIdx: index("workflows_category_idx").on(table.category),
  difficultyIdx: index("workflows_difficulty_idx").on(table.difficulty),
  isFeaturedIdx: index("workflows_is_featured_idx").on(table.isFeatured),
  createdAtIdx: index("workflows_created_at_idx").on(table.createdAt),
  updatedAtIdx: index("workflows_updated_at_idx").on(table.updatedAt),
}));

// Shortcuts table for iOS Shortcuts
export const shortcuts = sqliteTable("shortcuts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  platform: text("platform").notNull(), // "iOS", "macOS", or "Both"
  difficulty: text("difficulty").notNull(), // "Beginner", "Intermediate", or "Advanced"
  author: text("author").notNull(),
  authorUrl: text("author_url"),
  iconUrl: text("icon_url").notNull(),
  downloadUrl: text("download_url").notNull(),
  videoUrl: text("video_url"),
  actions: integer("actions").notNull(),
  requirements: text("requirements", { mode: "json" }).$defaultFn(() => []), // JSON array
  rating: real("rating"),
  reviewsCount: integer("reviews_count").default(0),
  tags: text("tags", { mode: "json" }).$defaultFn(() => []), // JSON array
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
}, (table) => ({
  slugIdx: index("shortcuts_slug_idx").on(table.slug),
  categoryIdx: index("shortcuts_category_idx").on(table.category),
  platformIdx: index("shortcuts_platform_idx").on(table.platform),
  difficultyIdx: index("shortcuts_difficulty_idx").on(table.difficulty),
  isFeaturedIdx: index("shortcuts_is_featured_idx").on(table.isFeatured),
  createdAtIdx: index("shortcuts_created_at_idx").on(table.createdAt),
  updatedAtIdx: index("shortcuts_updated_at_idx").on(table.updatedAt),
}));

// MCPs table for Model Context Protocols
export const mcps = sqliteTable("mcps", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  platform: text("platform").notNull(), // e.g., "Claude Desktop", "Any MCP Client"
  provider: text("provider").notNull(), // e.g., "Anthropic", "Community"
  author: text("author").notNull(),
  authorUrl: text("author_url"),
  iconUrl: text("icon_url").notNull(),
  repositoryUrl: text("repository_url").notNull(),
  documentationUrl: text("documentation_url"),
  integrations: text("integrations", { mode: "json" }).$defaultFn(() => []), // JSON array
  rating: real("rating"),
  reviewsCount: integer("reviews_count").default(0),
  tags: text("tags", { mode: "json" }).$defaultFn(() => []), // JSON array
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
}, (table) => ({
  slugIdx: index("mcps_slug_idx").on(table.slug),
  categoryIdx: index("mcps_category_idx").on(table.category),
  platformIdx: index("mcps_platform_idx").on(table.platform),
  providerIdx: index("mcps_provider_idx").on(table.provider),
  isFeaturedIdx: index("mcps_is_featured_idx").on(table.isFeatured),
  createdAtIdx: index("mcps_created_at_idx").on(table.createdAt),
  updatedAtIdx: index("mcps_updated_at_idx").on(table.updatedAt),
}));

// Creators table for content creators
export const creators = sqliteTable("creators", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  bio: text("bio").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  websiteUrl: text("website_url"),
  twitterUrl: text("twitter_url"),
  githubUrl: text("github_url"),
  expertise: text("expertise", { mode: "json" }).$defaultFn(() => []), // JSON array
  verified: integer("verified", { mode: "boolean" }).default(false),
  isFeatured: integer("is_featured", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
}, (table) => ({
  slugIdx: index("creators_slug_idx").on(table.slug),
  verifiedIdx: index("creators_verified_idx").on(table.verified),
  isFeaturedIdx: index("creators_is_featured_idx").on(table.isFeatured),
  createdAtIdx: index("creators_created_at_idx").on(table.createdAt),
}));