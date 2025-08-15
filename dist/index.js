// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  categories;
  articles;
  comments;
  admins;
  constructor() {
    this.categories = /* @__PURE__ */ new Map();
    this.articles = /* @__PURE__ */ new Map();
    this.comments = /* @__PURE__ */ new Map();
    this.admins = /* @__PURE__ */ new Map();
    this.seedData();
  }
  seedData() {
    const admin = {
      id: randomUUID(),
      username: "sigitsetiadi",
      password: "24032000",
      // In production, this should be hashed
      role: "superadmin",
      createdAt: /* @__PURE__ */ new Date()
    };
    this.admins.set(admin.id, admin);
    const categoriesData = [
      { name: "Politik", slug: "politik", color: "#e53e3e" },
      { name: "Ekonomi", slug: "ekonomi", color: "#1a365d" },
      { name: "Teknologi", slug: "teknologi", color: "#3182ce" },
      { name: "Olahraga", slug: "olahraga", color: "#38a169" },
      { name: "Hiburan", slug: "hiburan", color: "#805ad5" },
      { name: "Dunia", slug: "dunia", color: "#d69e2e" },
      { name: "Trending", slug: "trending", color: "#f56500" }
    ];
    categoriesData.forEach((catData) => {
      const category = {
        id: randomUUID(),
        ...catData,
        createdAt: /* @__PURE__ */ new Date()
      };
      this.categories.set(category.id, category);
    });
    const articlesData = [
      {
        title: "Ekonomi Indonesia Tumbuh 5.2% di Kuartal III, Tertinggi Sejak 2020",
        excerpt: "Bank Indonesia melaporkan pertumbuhan ekonomi yang menggembirakan didorong oleh sektor konsumsi domestik dan ekspor komoditas yang kuat...",
        content: `Jakarta - Badan Pusat Statistik (BPS) mengumumkan bahwa ekonomi Indonesia tumbuh 5.2% pada kuartal ketiga tahun 2024, melampaui ekspektasi analis yang memproyeksikan pertumbuhan 4.8%. Angka ini menjadi yang tertinggi sejak kuartal keempat 2020, menunjukkan pemulihan ekonomi yang solid.

Menurut Kepala BPS Margo Yuwono, pertumbuhan ini didorong oleh beberapa faktor utama. Konsumsi rumah tangga tumbuh 5.1%, sementara investasi atau Pembentukan Modal Tetap Bruto (PMTB) naik 4.8%. Ekspor barang dan jasa juga memberikan kontribusi positif dengan pertumbuhan 3.9%.

"Ini adalah momentum yang tepat untuk mendorong investasi lebih lanjut. Kami optimis dapat mempertahankan tren positif ini hingga akhir tahun," ujar Margo Yuwono dalam konferensi pers di Jakarta.

Dari sisi produksi, sektor Industri Pengolahan mencatat pertumbuhan tertinggi sebesar 6.2%, diikuti oleh sektor Informasi dan Komunikasi yang tumbuh 5.8%. Sektor Perdagangan Besar dan Eceran juga menunjukkan kinerja positif dengan pertumbuhan 5.1%.

Kementerian Keuangan menyatakan bahwa pertumbuhan ini memberikan ruang fiskal yang lebih luas untuk program-program pembangunan. Anggaran untuk infrastruktur dan pendidikan diperkirakan akan ditingkatkan pada tahun depan.`,
        imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
        categorySlug: "ekonomi",
        authorName: "Ahmad Rizki",
        authorRole: "Editor Ekonomi",
        isBreaking: true,
        isFeatured: true,
        views: 12500,
        likes: 234
      },
      {
        title: "OpenAI Luncurkan Model AI Terbaru dengan Kemampuan Multimodal",
        excerpt: "Model GPT-5 terbaru mampu memproses teks, gambar, audio, dan video secara bersamaan dengan akurasi tinggi...",
        content: `San Francisco - OpenAI resmi meluncurkan model AI generasi terbaru yang diberi nama GPT-5, dengan kemampuan multimodal yang revolusioner. Model ini dapat memproses dan menghasilkan konten dalam berbagai format termasuk teks, gambar, audio, dan video secara bersamaan.

CEO OpenAI Sam Altman menjelaskan bahwa GPT-5 menandai lompatan besar dalam pengembangan artificial general intelligence (AGI). "Ini bukan hanya peningkatan incremental, tetapi transformasi fundamental dalam cara AI berinteraksi dengan dunia," kata Altman dalam acara peluncuran di San Francisco.

Kemampuan baru yang paling mencolok adalah Vision Pro, yang memungkinkan model untuk menganalisis dan menghasilkan konten visual dengan detail yang belum pernah ada sebelumnya. Model ini juga dilengkapi dengan Voice Synthesis yang dapat meniru berbagai intonasi dan emosi manusia.

Para ahli teknologi merespons positif peluncuran ini. Dr. Fei-Fei Li dari Stanford University menyebut GPT-5 sebagai "milestone penting dalam perjalanan menuju AGI yang aman dan bermanfaat."

Namun, peluncuran ini juga memicu kekhawatiran tentang dampak sosial dan ekonomi. Berbagai organisasi hak digital meminta regulasi yang lebih ketat untuk memastikan teknologi ini tidak disalahgunakan.`,
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080",
        categorySlug: "teknologi",
        authorName: "Sarah Wijaya",
        authorRole: "Reporter Teknologi",
        isFeatured: true,
        views: 8200,
        likes: 189
      }
      // Add more articles here... (continuing with the pattern)
    ];
    const categoryMap = /* @__PURE__ */ new Map();
    this.categories.forEach((cat) => categoryMap.set(cat.slug, cat.id));
    articlesData.forEach((articleData) => {
      const categoryId = categoryMap.get(articleData.categorySlug);
      if (categoryId) {
        const article = {
          id: randomUUID(),
          ...articleData,
          categoryId,
          slug: this.createSlug(articleData.title),
          publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1e3),
          // Random date within last week
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        };
        delete article.categorySlug;
        this.articles.set(article.id, article);
      }
    });
  }
  createSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  async getCategories() {
    return Array.from(this.categories.values());
  }
  async getCategoryById(id) {
    return this.categories.get(id);
  }
  async getCategoryBySlug(slug) {
    return Array.from(this.categories.values()).find((cat) => cat.slug === slug);
  }
  async createCategory(category) {
    const newCategory = {
      id: randomUUID(),
      ...category,
      slug: this.createSlug(category.name),
      createdAt: /* @__PURE__ */ new Date()
    };
    this.categories.set(newCategory.id, newCategory);
    return newCategory;
  }
  async getArticles(categoryId, limit = 20, offset = 0) {
    let articles2 = Array.from(this.articles.values());
    if (categoryId) {
      articles2 = articles2.filter((article) => article.categoryId === categoryId);
    }
    articles2.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    return articles2.slice(offset, offset + limit);
  }
  async getArticleById(id) {
    return this.articles.get(id);
  }
  async getArticleBySlug(slug) {
    return Array.from(this.articles.values()).find((article) => article.slug === slug);
  }
  async getFeaturedArticles() {
    return Array.from(this.articles.values()).filter((article) => article.isFeatured).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 5);
  }
  async getBreakingArticles() {
    return Array.from(this.articles.values()).filter((article) => article.isBreaking).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }
  async getTrendingArticles() {
    return Array.from(this.articles.values()).sort((a, b) => b.views - a.views).slice(0, 5);
  }
  async searchArticles(query) {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.articles.values()).filter(
      (article) => article.title.toLowerCase().includes(lowercaseQuery) || article.excerpt.toLowerCase().includes(lowercaseQuery) || article.content.toLowerCase().includes(lowercaseQuery)
    ).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }
  async createArticle(article) {
    const now = /* @__PURE__ */ new Date();
    const newArticle = {
      id: randomUUID(),
      ...article,
      slug: this.createSlug(article.title),
      views: 0,
      likes: 0,
      publishedAt: now,
      createdAt: now,
      updatedAt: now
    };
    this.articles.set(newArticle.id, newArticle);
    return newArticle;
  }
  async updateArticle(id, article) {
    const existing = this.articles.get(id);
    if (!existing) return void 0;
    const updated = {
      ...existing,
      ...article,
      updatedAt: /* @__PURE__ */ new Date()
    };
    if (article.title && article.title !== existing.title) {
      updated.slug = this.createSlug(article.title);
    }
    this.articles.set(id, updated);
    return updated;
  }
  async deleteArticle(id) {
    return this.articles.delete(id);
  }
  async incrementArticleViews(id) {
    const article = this.articles.get(id);
    if (article) {
      article.views++;
      this.articles.set(id, article);
    }
  }
  async incrementArticleLikes(id) {
    const article = this.articles.get(id);
    if (article) {
      article.likes++;
      this.articles.set(id, article);
    }
  }
  async getCommentsByArticleId(articleId) {
    return Array.from(this.comments.values()).filter((comment) => comment.articleId === articleId && comment.isApproved).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async getPendingComments() {
    return Array.from(this.comments.values()).filter((comment) => !comment.isApproved).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async createComment(comment) {
    const newComment = {
      id: randomUUID(),
      ...comment,
      isApproved: false,
      likes: 0,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.comments.set(newComment.id, newComment);
    return newComment;
  }
  async approveComment(id) {
    const comment = this.comments.get(id);
    if (comment) {
      comment.isApproved = true;
      this.comments.set(id, comment);
      return true;
    }
    return false;
  }
  async deleteComment(id) {
    return this.comments.delete(id);
  }
  async getAdminByUsername(username) {
    return Array.from(this.admins.values()).find((admin) => admin.username === username);
  }
  async createAdmin(admin) {
    const newAdmin = {
      id: randomUUID(),
      ...admin,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.admins.set(newAdmin.id, newAdmin);
    return newAdmin;
  }
  async getTotalArticles() {
    return this.articles.size;
  }
  async getTotalComments() {
    return this.comments.size;
  }
  async getDailyViews() {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from(this.articles.values()).reduce((total, article) => total + article.views, 0);
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  color: text("color").notNull().default("#1a365d"),
  createdAt: timestamp("created_at").defaultNow()
});
var articles = pgTable("articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  categoryId: varchar("category_id").notNull(),
  authorName: text("author_name").notNull().default("Admin"),
  authorRole: text("author_role").notNull().default("Editor"),
  isBreaking: boolean("is_breaking").default(false),
  isFeatured: boolean("is_featured").default(false),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  articleId: varchar("article_id").notNull(),
  authorName: text("author_name").notNull(),
  content: text("content").notNull(),
  isApproved: boolean("is_approved").default(false),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var admins = pgTable("admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true
});
var insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  slug: true,
  views: true,
  likes: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true
});
var updateArticleSchema = insertArticleSchema.partial();
var insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  isApproved: true,
  likes: true,
  createdAt: true
});
var insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true
});

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/categories", async (req, res) => {
    try {
      const categories2 = await storage.getCategories();
      res.json(categories2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });
  app2.get("/api/articles", async (req, res) => {
    try {
      const { category, limit = "20", offset = "0", featured, breaking, trending, search } = req.query;
      let articles2;
      if (featured === "true") {
        articles2 = await storage.getFeaturedArticles();
      } else if (breaking === "true") {
        articles2 = await storage.getBreakingArticles();
      } else if (trending === "true") {
        articles2 = await storage.getTrendingArticles();
      } else if (search) {
        articles2 = await storage.searchArticles(search);
      } else {
        articles2 = await storage.getArticles(
          category,
          parseInt(limit),
          parseInt(offset)
        );
      }
      const categories2 = await storage.getCategories();
      const categoryMap = new Map(categories2.map((cat) => [cat.id, cat]));
      const articlesWithCategory = articles2.map((article) => ({
        ...article,
        category: categoryMap.get(article.categoryId)
      }));
      res.json(articlesWithCategory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });
  app2.get("/api/articles/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const article = await storage.getArticleBySlug(slug);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      await storage.incrementArticleViews(article.id);
      const category = await storage.getCategoryById(article.categoryId);
      res.json({ ...article, category });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });
  app2.post("/api/articles", async (req, res) => {
    try {
      const articleData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid article data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create article" });
    }
  });
  app2.put("/api/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const articleData = updateArticleSchema.parse(req.body);
      const article = await storage.updateArticle(id, articleData);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid article data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update article" });
    }
  });
  app2.delete("/api/articles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteArticle(id);
      if (!success) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json({ message: "Article deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete article" });
    }
  });
  app2.post("/api/articles/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.incrementArticleLikes(id);
      res.json({ message: "Article liked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to like article" });
    }
  });
  app2.get("/api/articles/:id/comments", async (req, res) => {
    try {
      const { id } = req.params;
      const comments2 = await storage.getCommentsByArticleId(id);
      res.json(comments2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });
  app2.post("/api/articles/:id/comments", async (req, res) => {
    try {
      const { id } = req.params;
      const commentData = insertCommentSchema.parse({
        ...req.body,
        articleId: id
      });
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create comment" });
    }
  });
  app2.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      const admin = await storage.getAdminByUsername(username);
      if (!admin || admin.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.json({
        success: true,
        admin: {
          id: admin.id,
          username: admin.username,
          role: admin.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.get("/api/admin/comments/pending", async (req, res) => {
    try {
      const comments2 = await storage.getPendingComments();
      res.json(comments2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending comments" });
    }
  });
  app2.post("/api/admin/comments/:id/approve", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.approveComment(id);
      if (!success) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.json({ message: "Comment approved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to approve comment" });
    }
  });
  app2.delete("/api/admin/comments/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteComment(id);
      if (!success) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });
  app2.get("/api/admin/stats", async (req, res) => {
    try {
      const [totalArticles, totalComments, dailyViews, pendingComments] = await Promise.all([
        storage.getTotalArticles(),
        storage.getTotalComments(),
        storage.getDailyViews(),
        storage.getPendingComments()
      ]);
      res.json({
        totalArticles,
        totalComments,
        dailyViews,
        pendingComments: pendingComments.length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });
  app2.get("/api/rss", async (req, res) => {
    try {
      const articles2 = await storage.getArticles(void 0, 20, 0);
      let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Raxnet Prime</title>
    <description>Portal berita online premium dengan liputan terkini</description>
    <link>https://raxnet-prime.com</link>
    <language>id</language>
    <lastBuildDate>${(/* @__PURE__ */ new Date()).toUTCString()}</lastBuildDate>`;
      articles2.forEach((article) => {
        rss += `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <description><![CDATA[${article.excerpt}]]></description>
      <link>https://raxnet-prime.com/article/${article.slug}</link>
      <guid>https://raxnet-prime.com/article/${article.slug}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
    </item>`;
      });
      rss += `
  </channel>
</rss>`;
      res.set("Content-Type", "application/rss+xml");
      res.send(rss);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate RSS feed" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
