import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArticleSchema, insertCommentSchema, updateArticleSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Articles
  app.get("/api/articles", async (req, res) => {
    try {
      const { category, limit = "20", offset = "0", featured, breaking, trending, search } = req.query;
      
      let articles;
      
      if (featured === "true") {
        articles = await storage.getFeaturedArticles();
      } else if (breaking === "true") {
        articles = await storage.getBreakingArticles();
      } else if (trending === "true") {
        articles = await storage.getTrendingArticles();
      } else if (search) {
        articles = await storage.searchArticles(search as string);
      } else {
        articles = await storage.getArticles(
          category as string,
          parseInt(limit as string),
          parseInt(offset as string)
        );
      }
      
      // Include category information
      const categories = await storage.getCategories();
      const categoryMap = new Map(categories.map(cat => [cat.id, cat]));
      
      const articlesWithCategory = articles.map(article => ({
        ...article,
        category: categoryMap.get(article.categoryId)
      }));
      
      res.json(articlesWithCategory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const article = await storage.getArticleBySlug(slug);
      
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      
      // Increment views
      await storage.incrementArticleViews(article.id);
      
      // Get category info
      const category = await storage.getCategoryById(article.categoryId);
      
      res.json({ ...article, category });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post("/api/articles", async (req, res) => {
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

  app.put("/api/articles/:id", async (req, res) => {
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

  app.delete("/api/articles/:id", async (req, res) => {
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

  app.post("/api/articles/:id/like", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.incrementArticleLikes(id);
      res.json({ message: "Article liked successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to like article" });
    }
  });

  // Comments
  app.get("/api/articles/:id/comments", async (req, res) => {
    try {
      const { id } = req.params;
      const comments = await storage.getCommentsByArticleId(id);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/articles/:id/comments", async (req, res) => {
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

  // Admin routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const admin = await storage.getAdminByUsername(username);
      
      if (!admin || admin.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // In a real app, you'd use JWT or sessions here
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

  app.get("/api/admin/comments/pending", async (req, res) => {
    try {
      const comments = await storage.getPendingComments();
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending comments" });
    }
  });

  app.post("/api/admin/comments/:id/approve", async (req, res) => {
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

  app.delete("/api/admin/comments/:id", async (req, res) => {
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

  app.get("/api/admin/stats", async (req, res) => {
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

  // RSS Feed
  app.get("/api/rss", async (req, res) => {
    try {
      const articles = await storage.getArticles(undefined, 20, 0);
      
      let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Raxnet Prime</title>
    <description>Portal berita online premium dengan liputan terkini</description>
    <link>https://raxnet-prime.com</link>
    <language>id</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`;

      articles.forEach(article => {
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

      res.set('Content-Type', 'application/rss+xml');
      res.send(rss);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate RSS feed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
