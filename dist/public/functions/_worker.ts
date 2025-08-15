import { drizzle } from 'drizzle-orm/d1';
import { articles, categories, comments, admins } from '../shared/d1-schema';
import { eq, desc, like, and } from 'drizzle-orm';

interface Env {
  DB: D1Database;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function seedDatabase(db: any, env: Env) {
  try {
    // Create tables
    await env.DB.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        color TEXT NOT NULL,
        icon TEXT NOT NULL
      );
    `);

    await env.DB.exec(`
      CREATE TABLE IF NOT EXISTS articles (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        excerpt TEXT NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT NOT NULL,
        category_id TEXT NOT NULL,
        author TEXT NOT NULL,
        published_at INTEGER NOT NULL,
        view_count INTEGER DEFAULT 0,
        is_featured INTEGER DEFAULT 0,
        tags TEXT
      );
    `);

    await env.DB.exec(`
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        article_id TEXT NOT NULL,
        author_name TEXT NOT NULL,
        author_email TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        is_approved INTEGER DEFAULT 0
      );
    `);

    await env.DB.exec(`
      CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT DEFAULT 'admin',
        created_at INTEGER NOT NULL
      );
    `);

    // Check if data already exists
    const existingCategories = await db.select().from(categories).limit(1);
    
    if (existingCategories.length === 0) {
      // Insert seed categories
      const seedCategories = [
        { id: crypto.randomUUID(), name: "Politik", slug: "politik", color: "#dc2626", icon: "Vote" },
        { id: crypto.randomUUID(), name: "Ekonomi", slug: "ekonomi", color: "#059669", icon: "TrendingUp" },
        { id: crypto.randomUUID(), name: "Teknologi", slug: "teknologi", color: "#2563eb", icon: "Smartphone" },
        { id: crypto.randomUUID(), name: "Olahraga", slug: "olahraga", color: "#ea580c", icon: "Trophy" },
        { id: crypto.randomUUID(), name: "Hiburan", slug: "hiburan", color: "#7c3aed", icon: "Film" },
        { id: crypto.randomUUID(), name: "Dunia", slug: "dunia", color: "#0891b2", icon: "Globe" },
        { id: crypto.randomUUID(), name: "Trending", slug: "trending", color: "#e11d48", icon: "TrendingUp" }
      ];

      await db.insert(categories).values(seedCategories);

      // Insert admin
      await db.insert(admins).values({
        id: crypto.randomUUID(),
        username: "sigitsetiadi",
        password: "24032000",
        email: "admin@raxnetprime.com",
        role: "admin",
        createdAt: Date.now()
      });

      // Insert sample articles
      const sampleArticles = [
        {
          id: crypto.randomUUID(),
          title: "Perkembangan Politik Terkini Indonesia",
          slug: "perkembangan-politik-terkini-indonesia",
          excerpt: "Analisis mendalam tentang situasi politik Indonesia saat ini dan dampaknya terhadap masyarakat.",
          content: "Content lengkap artikel politik...",
          imageUrl: "https://picsum.photos/800/450?random=1",
          categoryId: seedCategories[0].id,
          author: "Admin Raxnet",
          publishedAt: Date.now(),
          viewCount: 150,
          isFeatured: 1,
          tags: "politik,indonesia,pemerintah"
        },
        {
          id: crypto.randomUUID(),
          title: "Ekonomi Digital Indonesia Meningkat Pesat",
          slug: "ekonomi-digital-indonesia-meningkat-pesat",
          excerpt: "Pertumbuhan ekonomi digital Indonesia mencapai rekor tertinggi dalam 5 tahun terakhir.",
          content: "Content lengkap artikel ekonomi...",
          imageUrl: "https://picsum.photos/800/450?random=2",
          categoryId: seedCategories[1].id,
          author: "Admin Raxnet",
          publishedAt: Date.now() - 3600000,
          viewCount: 89,
          isFeatured: 0,
          tags: "ekonomi,digital,indonesia"
        }
      ];

      await db.insert(articles).values(sampleArticles);
    }

    return true;
  } catch (error) {
    console.error('Database seed error:', error);
    return false;
  }
}

async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const db = drizzle(env.DB);

  try {
    // Initialize database
    if (path === '/api/init' && method === 'GET') {
      const success = await seedDatabase(db, env);
      return Response.json(
        { message: success ? "Database initialized successfully" : "Database initialization failed" },
        { headers: corsHeaders }
      );
    }

    // Categories endpoints
    if (path === '/api/categories' && method === 'GET') {
      const allCategories = await db.select().from(categories);
      return Response.json(allCategories, { headers: corsHeaders });
    }

    // Articles endpoints
    if (path === '/api/articles' && method === 'GET') {
      const categoryId = url.searchParams.get('category');
      const featured = url.searchParams.get('featured');
      const search = url.searchParams.get('search');
      const limit = parseInt(url.searchParams.get('limit') || '10');
      const offset = parseInt(url.searchParams.get('offset') || '0');

      let query = db.select().from(articles);
      const conditions = [];

      if (categoryId) {
        conditions.push(eq(articles.categoryId, categoryId));
      }

      if (featured === 'true') {
        conditions.push(eq(articles.isFeatured, 1));
      }

      if (search) {
        conditions.push(like(articles.title, `%${search}%`));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      const allArticles = await query
        .orderBy(desc(articles.publishedAt))
        .limit(limit)
        .offset(offset);

      return Response.json(allArticles, { headers: corsHeaders });
    }

    // Article by ID
    if (path.startsWith('/api/articles/') && method === 'GET') {
      const id = path.split('/')[3];
      
      const article = await db.select().from(articles).where(eq(articles.id, id)).get();
      
      if (!article) {
        return Response.json(
          { message: "Article not found" },
          { status: 404, headers: corsHeaders }
        );
      }

      // Increment view count
      await db.update(articles)
        .set({ viewCount: (article.viewCount || 0) + 1 })
        .where(eq(articles.id, id));

      return Response.json(article, { headers: corsHeaders });
    }

    // Comments for article
    if (path.match(/^\/api\/articles\/[^/]+\/comments$/) && method === 'GET') {
      const articleId = path.split('/')[3];
      
      const articleComments = await db.select()
        .from(comments)
        .where(and(eq(comments.articleId, articleId), eq(comments.isApproved, 1)))
        .orderBy(desc(comments.createdAt));

      return Response.json(articleComments, { headers: corsHeaders });
    }

    // Post comment
    if (path.match(/^\/api\/articles\/[^/]+\/comments$/) && method === 'POST') {
      const articleId = path.split('/')[3];
      const body = await request.json();

      const newComment = {
        id: crypto.randomUUID(),
        articleId,
        authorName: body.authorName,
        authorEmail: body.authorEmail,
        content: body.content,
        createdAt: Date.now(),
        isApproved: 0
      };

      await db.insert(comments).values(newComment);
      return Response.json(newComment, { status: 201, headers: corsHeaders });
    }

    // Admin login
    if (path === '/api/admin/login' && method === 'POST') {
      const { username, password } = await request.json();

      const admin = await db.select()
        .from(admins)
        .where(and(eq(admins.username, username), eq(admins.password, password)))
        .get();

      if (!admin) {
        return Response.json(
          { message: "Invalid credentials" },
          { status: 401, headers: corsHeaders }
        );
      }

      return Response.json({ 
        message: "Login successful", 
        admin: { id: admin.id, username: admin.username, role: admin.role } 
      }, { headers: corsHeaders });
    }

    // Admin endpoints - comments
    if (path === '/api/admin/comments' && method === 'GET') {
      const allComments = await db.select()
        .from(comments)
        .orderBy(desc(comments.createdAt));

      return Response.json(allComments, { headers: corsHeaders });
    }

    // Approve comment
    if (path.match(/^\/api\/admin\/comments\/[^/]+\/approve$/) && method === 'PUT') {
      const id = path.split('/')[4];

      await db.update(comments)
        .set({ isApproved: 1 })
        .where(eq(comments.id, id));

      return Response.json({ message: "Comment approved" }, { headers: corsHeaders });
    }

    // Delete comment
    if (path.match(/^\/api\/admin\/comments\/[^/]+$/) && method === 'DELETE') {
      const id = path.split('/')[4];

      await db.delete(comments).where(eq(comments.id, id));
      return Response.json({ message: "Comment deleted" }, { headers: corsHeaders });
    }

    // Create article
    if (path === '/api/admin/articles' && method === 'POST') {
      const body = await request.json();

      const newArticle = {
        id: crypto.randomUUID(),
        ...body,
        publishedAt: Date.now(),
        viewCount: 0
      };

      await db.insert(articles).values(newArticle);
      return Response.json(newArticle, { status: 201, headers: corsHeaders });
    }

    // Update article
    if (path.match(/^\/api\/admin\/articles\/[^/]+$/) && method === 'PUT') {
      const id = path.split('/')[4];
      const body = await request.json();

      await db.update(articles)
        .set(body)
        .where(eq(articles.id, id));

      return Response.json({ message: "Article updated" }, { headers: corsHeaders });
    }

    // Delete article
    if (path.match(/^\/api\/admin\/articles\/[^/]+$/) && method === 'DELETE') {
      const id = path.split('/')[4];

      await db.delete(articles).where(eq(articles.id, id));
      return Response.json({ message: "Article deleted" }, { headers: corsHeaders });
    }

    return Response.json(
      { message: "Not found" },
      { status: 404, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Request error:', error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return await handleRequest(request, env);
  },
};