import { type Category, type Article, type Comment, type Admin, type InsertCategory, type InsertArticle, type UpdateArticle, type InsertComment, type InsertAdmin } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Articles
  getArticles(categoryId?: string, limit?: number, offset?: number): Promise<Article[]>;
  getArticleById(id: string): Promise<Article | undefined>;
  getArticleBySlug(slug: string): Promise<Article | undefined>;
  getFeaturedArticles(): Promise<Article[]>;
  getBreakingArticles(): Promise<Article[]>;
  getTrendingArticles(): Promise<Article[]>;
  searchArticles(query: string): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, article: UpdateArticle): Promise<Article | undefined>;
  deleteArticle(id: string): Promise<boolean>;
  incrementArticleViews(id: string): Promise<void>;
  incrementArticleLikes(id: string): Promise<void>;
  
  // Comments
  getCommentsByArticleId(articleId: string): Promise<Comment[]>;
  getPendingComments(): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  approveComment(id: string): Promise<boolean>;
  deleteComment(id: string): Promise<boolean>;
  
  // Admins
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  
  // Analytics
  getTotalArticles(): Promise<number>;
  getTotalComments(): Promise<number>;
  getDailyViews(): Promise<number>;
}

export class MemStorage implements IStorage {
  private categories: Map<string, Category>;
  private articles: Map<string, Article>;
  private comments: Map<string, Comment>;
  private admins: Map<string, Admin>;

  constructor() {
    this.categories = new Map();
    this.articles = new Map();
    this.comments = new Map();
    this.admins = new Map();
    this.seedData();
  }

  private seedData() {
    // Create default admin
    const admin: Admin = {
      id: randomUUID(),
      username: "sigitsetiadi",
      password: "24032000", // In production, this should be hashed
      role: "superadmin",
      createdAt: new Date(),
    };
    this.admins.set(admin.id, admin);

    // Create categories
    const categoriesData = [
      { name: "Politik", slug: "politik", color: "#e53e3e" },
      { name: "Ekonomi", slug: "ekonomi", color: "#1a365d" },
      { name: "Teknologi", slug: "teknologi", color: "#3182ce" },
      { name: "Olahraga", slug: "olahraga", color: "#38a169" },
      { name: "Hiburan", slug: "hiburan", color: "#805ad5" },
      { name: "Dunia", slug: "dunia", color: "#d69e2e" },
      { name: "Trending", slug: "trending", color: "#f56500" },
    ];

    categoriesData.forEach(catData => {
      const category: Category = {
        id: randomUUID(),
        ...catData,
        createdAt: new Date(),
      };
      this.categories.set(category.id, category);
    });

    // Create sample articles
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
        likes: 234,
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
        likes: 189,
      },
      // Add more articles here... (continuing with the pattern)
    ];

    const categoryMap = new Map<string, string>();
    this.categories.forEach(cat => categoryMap.set(cat.slug, cat.id));

    articlesData.forEach(articleData => {
      const categoryId = categoryMap.get(articleData.categorySlug);
      if (categoryId) {
        const article: Article = {
          id: randomUUID(),
          ...articleData,
          categoryId,
          slug: this.createSlug(articleData.title),
          publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        delete (article as any).categorySlug;
        this.articles.set(article.id, article);
      }
    });
  }

  private createSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(cat => cat.slug === slug);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const newCategory: Category = {
      id: randomUUID(),
      ...category,
      slug: this.createSlug(category.name),
      createdAt: new Date(),
    };
    this.categories.set(newCategory.id, newCategory);
    return newCategory;
  }

  async getArticles(categoryId?: string, limit = 20, offset = 0): Promise<Article[]> {
    let articles = Array.from(this.articles.values());
    
    if (categoryId) {
      articles = articles.filter(article => article.categoryId === categoryId);
    }
    
    articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    return articles.slice(offset, offset + limit);
  }

  async getArticleById(id: string): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async getArticleBySlug(slug: string): Promise<Article | undefined> {
    return Array.from(this.articles.values()).find(article => article.slug === slug);
  }

  async getFeaturedArticles(): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.isFeatured)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 5);
  }

  async getBreakingArticles(): Promise<Article[]> {
    return Array.from(this.articles.values())
      .filter(article => article.isBreaking)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async getTrendingArticles(): Promise<Article[]> {
    return Array.from(this.articles.values())
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  }

  async searchArticles(query: string): Promise<Article[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.articles.values())
      .filter(article => 
        article.title.toLowerCase().includes(lowercaseQuery) ||
        article.excerpt.toLowerCase().includes(lowercaseQuery) ||
        article.content.toLowerCase().includes(lowercaseQuery)
      )
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const now = new Date();
    const newArticle: Article = {
      id: randomUUID(),
      ...article,
      slug: this.createSlug(article.title),
      views: 0,
      likes: 0,
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
    };
    this.articles.set(newArticle.id, newArticle);
    return newArticle;
  }

  async updateArticle(id: string, article: UpdateArticle): Promise<Article | undefined> {
    const existing = this.articles.get(id);
    if (!existing) return undefined;

    const updated: Article = {
      ...existing,
      ...article,
      updatedAt: new Date(),
    };

    if (article.title && article.title !== existing.title) {
      updated.slug = this.createSlug(article.title);
    }

    this.articles.set(id, updated);
    return updated;
  }

  async deleteArticle(id: string): Promise<boolean> {
    return this.articles.delete(id);
  }

  async incrementArticleViews(id: string): Promise<void> {
    const article = this.articles.get(id);
    if (article) {
      article.views++;
      this.articles.set(id, article);
    }
  }

  async incrementArticleLikes(id: string): Promise<void> {
    const article = this.articles.get(id);
    if (article) {
      article.likes++;
      this.articles.set(id, article);
    }
  }

  async getCommentsByArticleId(articleId: string): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.articleId === articleId && comment.isApproved)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getPendingComments(): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(comment => !comment.isApproved)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const newComment: Comment = {
      id: randomUUID(),
      ...comment,
      isApproved: false,
      likes: 0,
      createdAt: new Date(),
    };
    this.comments.set(newComment.id, newComment);
    return newComment;
  }

  async approveComment(id: string): Promise<boolean> {
    const comment = this.comments.get(id);
    if (comment) {
      comment.isApproved = true;
      this.comments.set(id, comment);
      return true;
    }
    return false;
  }

  async deleteComment(id: string): Promise<boolean> {
    return this.comments.delete(id);
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find(admin => admin.username === username);
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const newAdmin: Admin = {
      id: randomUUID(),
      ...admin,
      createdAt: new Date(),
    };
    this.admins.set(newAdmin.id, newAdmin);
    return newAdmin;
  }

  async getTotalArticles(): Promise<number> {
    return this.articles.size;
  }

  async getTotalComments(): Promise<number> {
    return this.comments.size;
  }

  async getDailyViews(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Simulate daily views calculation
    return Array.from(this.articles.values())
      .reduce((total, article) => total + article.views, 0);
  }
}

export const storage = new MemStorage();
