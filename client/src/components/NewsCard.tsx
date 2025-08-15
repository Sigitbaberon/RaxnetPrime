import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MessageCircle, Heart } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";

interface NewsCardProps {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    imageUrl?: string;
    category?: {
      name: string;
      slug: string;
      color: string;
    };
    authorName: string;
    views: number;
    likes: number;
    publishedAt: string;
  };
}

export function NewsCard({ article }: NewsCardProps) {
  const queryClient = useQueryClient();

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

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await apiRequest("POST", `/api/articles/${article.id}/like`);
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
    } catch (error) {
      console.error("Failed to like article:", error);
    }
  };

  return (
    <Link href={`/article/${article.slug}`} data-testid={`link-article-${article.id}`}>
      <Card className="news-card cursor-pointer">
        {article.imageUrl && (
          <div className="relative overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-48 object-cover"
              loading="lazy"
              data-testid={`img-article-${article.id}`}
            />
          </div>
        )}
        <CardContent className="p-6">
          <div className="flex items-center mb-3">
            <Badge 
              className={`mr-3 text-xs font-medium ${getCategoryClass(article.category?.slug)}`}
              data-testid={`badge-category-${article.category?.slug}`}
            >
              {article.category?.name || "Berita"}
            </Badge>
            <span className="text-muted-foreground text-sm" data-testid="text-publish-time">
              {formatTimeAgo(article.publishedAt)}
            </span>
          </div>
          
          <h3 className="text-lg font-semibold mb-2 group-hover:text-news-blue dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {article.title}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center" data-testid={`text-views-${article.id}`}>
                <Eye className="h-4 w-4 mr-1" />
                {formatNumber(article.views)}
              </span>
              <span className="flex items-center" data-testid={`text-comments-${article.id}`}>
                <MessageCircle className="h-4 w-4 mr-1" />
                0
              </span>
              <button
                onClick={handleLike}
                className="flex items-center hover:text-red-500 transition-colors"
                data-testid={`button-like-${article.id}`}
              >
                <Heart className="h-4 w-4 mr-1" />
                {formatNumber(article.likes)}
              </button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-news-blue dark:text-blue-400 font-medium"
              data-testid="button-read-article"
            >
              Baca →
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
