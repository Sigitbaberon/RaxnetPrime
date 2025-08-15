import React, { useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Eye, MessageCircle, Heart, Share2, ArrowLeft } from "lucide-react";
import { CommentSection } from "@/components/CommentSection";
import { NewsCard } from "@/components/NewsCard";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["/api/articles", slug],
    enabled: !!slug,
  }) as { data: any, isLoading: boolean, error: any };

  const { data: relatedArticles = [] } = useQuery({
    queryKey: ["/api/articles", { category: article?.categoryId, limit: "3" }],
    enabled: !!article?.categoryId,
  }) as { data: any[] };

  const likeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/articles/${article.id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles", slug] });
    },
  });

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const articleDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - articleDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Baru saja";
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    return `${Math.floor(diffInHours / 24)} hari yang lalu`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getCategoryClass = (slug?: string) => {
    switch (slug) {
      case 'politik': return 'category-politik';
      case 'ekonomi': return 'category-ekonomi';
      case 'teknologi': return 'category-teknologi';
      case 'olahraga': return 'category-olahraga';
      case 'hiburan': return 'category-hiburan';
      case 'dunia': return 'category-dunia';
      case 'trending': return 'category-trending';
      default: return 'category-ekonomi';
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link artikel telah disalin ke clipboard!');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="h-4 bg-muted rounded w-64 animate-pulse"></div>
        <div className="space-y-6">
          <div className="h-8 bg-muted rounded w-1/4 animate-pulse"></div>
          <div className="h-16 bg-muted rounded animate-pulse"></div>
          <div className="h-64 bg-muted rounded animate-pulse"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-4 bg-muted rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Artikel Tidak Ditemukan</h1>
        <p className="text-muted-foreground mb-8">
          Artikel yang Anda cari tidak dapat ditemukan atau telah dihapus.
        </p>
        <Link href="/">
          <Button data-testid="button-back-home">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6" data-testid="breadcrumb-navigation">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/category/${article.category?.slug}`}>
              {article.category?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Artikel</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <article>
        <header className="mb-8">
          <div className="flex items-center mb-4">
            <Badge 
              className={`mr-4 ${getCategoryClass(article.category?.slug)}`}
              data-testid="badge-article-category"
            >
              {article.category?.name || "Berita"}
            </Badge>
            <span className="text-muted-foreground text-sm" data-testid="text-article-time">
              {formatTimeAgo(article.publishedAt)}
            </span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight text-balance" data-testid="text-article-title">
            {article.title}
          </h1>
          
          <div className="flex items-center justify-between border-t border-b border-border py-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(article.authorName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold" data-testid="text-author-name">{article.authorName}</p>
                <p className="text-sm text-muted-foreground" data-testid="text-author-role">{article.authorRole}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-muted-foreground">
              <span className="flex items-center" data-testid="text-article-views">
                <Eye className="h-4 w-4 mr-1" />
                {formatNumber(article.views)}
              </span>
              <span className="flex items-center" data-testid="text-article-comments">
                <MessageCircle className="h-4 w-4 mr-1" />
                0
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => likeMutation.mutate()}
                className="hover:text-red-500 transition-colors"
                data-testid="button-like-article"
              >
                <Heart className="h-4 w-4 mr-1" />
                {formatNumber(article.likes)}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="hover:text-blue-500 transition-colors"
                data-testid="button-share-article"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </header>

        {/* Article Image */}
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-96 object-cover rounded-xl mb-8"
            data-testid="img-article-main"
          />
        )}

        {/* Article Content */}
        <div className="prose-news" data-testid="content-article-body">
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            {article.excerpt}
          </p>

          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>') }}
          />
        </div>

        {/* Comment Section */}
        <CommentSection articleId={article.id} />

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-12 pt-8 border-t border-border">
            <h3 className="text-2xl font-bold mb-6" data-testid="text-related-articles-title">
              Artikel Terkait
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles
                .filter((related: any) => related.id !== article.id)
                .slice(0, 3)
                .map((relatedArticle: any) => (
                  <NewsCard key={relatedArticle.id} article={relatedArticle} />
                ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
