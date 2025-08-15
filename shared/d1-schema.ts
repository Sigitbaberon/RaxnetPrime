import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  color: text("color").notNull().default("#1a365d"),
  icon: text("icon").notNull().default("Folder"),
});

export const articles = sqliteTable("articles", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  categoryId: text("category_id").notNull(),
  author: text("author").notNull().default("Admin"),
  publishedAt: integer("published_at").notNull(),
  viewCount: integer("view_count").default(0),
  isFeatured: integer("is_featured").default(0), // SQLite uses integers for booleans
  tags: text("tags"),
});

export const comments = sqliteTable("comments", {
  id: text("id").primaryKey(),
  articleId: text("article_id").notNull(),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email").notNull(),
  content: text("content").notNull(),
  createdAt: integer("created_at").notNull(),
  isApproved: integer("is_approved").default(0), // SQLite uses integers for booleans
});

export const admins = sqliteTable("admins", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: integer("created_at").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  slug: true,
  viewCount: true,
  publishedAt: true,
});

export const updateArticleSchema = insertArticleSchema.partial();

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  isApproved: true,
  createdAt: true,
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
});

export type Category = typeof categories.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type Comment = typeof comments.$inferSelect;
export type Admin = typeof admins.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type UpdateArticle = z.infer<typeof updateArticleSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type InsertAdmin = z.infer<typeof insertAdminSchema>;