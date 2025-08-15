export async function onRequest(context: any) {
  const { request, env } = context;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(request.url);
  const path = url.pathname.replace('/api', '');

  // Simple routing for demo
  if (path === '/categories') {
    const categories = [
      { id: "1", name: "Politik", slug: "politik", color: "#dc2626", icon: "Vote" },
      { id: "2", name: "Ekonomi", slug: "ekonomi", color: "#059669", icon: "TrendingUp" },
      { id: "3", name: "Teknologi", slug: "teknologi", color: "#2563eb", icon: "Smartphone" },
      { id: "4", name: "Olahraga", slug: "olahraga", color: "#ea580c", icon: "Trophy" },
      { id: "5", name: "Hiburan", slug: "hiburan", color: "#7c3aed", icon: "Film" },
      { id: "6", name: "Dunia", slug: "dunia", color: "#0891b2", icon: "Globe" },
      { id: "7", name: "Trending", slug: "trending", color: "#e11d48", icon: "TrendingUp" }
    ];
    return Response.json(categories, { headers: corsHeaders });
  }

  if (path === '/articles') {
    const articles = [
      {
        id: "1",
        title: "Perkembangan Politik Terkini Indonesia",
        slug: "perkembangan-politik-terkini-indonesia",
        excerpt: "Analisis mendalam tentang situasi politik Indonesia saat ini dan dampaknya terhadap masyarakat.",
        content: "Content lengkap artikel politik dengan berbagai analisis mendalam...",
        imageUrl: "https://picsum.photos/800/450?random=1",
        categoryId: "1",
        author: "Admin Raxnet",
        publishedAt: Date.now(),
        viewCount: 150,
        isFeatured: 1,
        tags: "politik,indonesia,pemerintah"
      },
      {
        id: "2",
        title: "Ekonomi Digital Indonesia Meningkat Pesat",
        slug: "ekonomi-digital-indonesia-meningkat-pesat",
        excerpt: "Pertumbuhan ekonomi digital Indonesia mencapai rekor tertinggi dalam 5 tahun terakhir.",
        content: "Content lengkap artikel ekonomi dengan data dan statistik...",
        imageUrl: "https://picsum.photos/800/450?random=2",
        categoryId: "2",
        author: "Admin Raxnet",
        publishedAt: Date.now() - 3600000,
        viewCount: 89,
        isFeatured: 0,
        tags: "ekonomi,digital,indonesia"
      },
      {
        id: "3",
        title: "Teknologi AI Revolusioner di Indonesia",
        slug: "teknologi-ai-revolusioner-di-indonesia",
        excerpt: "Perkembangan teknologi AI di Indonesia semakin pesat dengan berbagai inovasi terbaru.",
        content: "Content lengkap artikel teknologi...",
        imageUrl: "https://picsum.photos/800/450?random=3",
        categoryId: "3",
        author: "Admin Raxnet",
        publishedAt: Date.now() - 7200000,
        viewCount: 234,
        isFeatured: 1,
        tags: "teknologi,ai,indonesia"
      }
    ];
    return Response.json(articles, { headers: corsHeaders });
  }

  if (path.startsWith('/articles/') && !path.includes('/comments')) {
    const id = path.split('/')[2];
    const article = {
      id,
      title: "Artikel Detail",
      slug: "artikel-detail",
      excerpt: "Excerpt artikel...",
      content: "Content lengkap artikel...",
      imageUrl: "https://picsum.photos/800/450?random=1",
      categoryId: "1",
      author: "Admin Raxnet",
      publishedAt: Date.now(),
      viewCount: 150,
      isFeatured: 1,
      tags: "tag1,tag2"
    };
    return Response.json(article, { headers: corsHeaders });
  }

  if (path.includes('/comments')) {
    const comments = [];
    return Response.json(comments, { headers: corsHeaders });
  }

  if (path === '/admin/login' && request.method === 'POST') {
    const { username, password } = await request.json();
    
    if (username === 'sigitsetiadi' && password === '24032000') {
      return Response.json({ 
        message: "Login successful", 
        admin: { id: "1", username: "sigitsetiadi", role: "admin" } 
      }, { headers: corsHeaders });
    }
    
    return Response.json(
      { message: "Invalid credentials" },
      { status: 401, headers: corsHeaders }
    );
  }

  return Response.json(
    { message: "Not found" },
    { status: 404, headers: corsHeaders }
  );
}