import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { HeroSlider } from "@/components/HeroSlider";
import { NewsCard } from "@/components/NewsCard";
import { Sidebar } from "@/components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

export default function Home() {
  const [currentFilter, setCurrentFilter] = useState<"latest" | "popular">("latest");
  const [visibleArticles, setVisibleArticles] = useState(8);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["/api/articles", { limit: visibleArticles.toString() }],
  }) as { data: any[], isLoading: boolean };

  const { data: breakingNews = [] } = useQuery({
    queryKey: ["/api/articles", { breaking: "true" }],
  }) as { data: any[] };

  const loadMoreArticles = () => {
    setVisibleArticles(prev => prev + 4);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Hero Skeleton */}
        <div className="h-96 lg:h-[500px] bg-muted rounded-xl animate-pulse"></div>
        
        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-muted rounded-xl h-80 animate-pulse"></div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-muted rounded-xl h-64 animate-pulse"></div>
            <div className="bg-muted rounded-xl h-96 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <HeroSlider />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" data-testid="text-section-title">
              Berita Terbaru
            </h2>
            <div className="flex space-x-2">
              <Button
                onClick={() => setCurrentFilter("latest")}
                variant={currentFilter === "latest" ? "default" : "outline"}
                size="sm"
                data-testid="button-filter-latest"
              >
                Terbaru
              </Button>
              <Button
                onClick={() => setCurrentFilter("popular")}
                variant={currentFilter === "popular" ? "default" : "outline"}
                size="sm"
                data-testid="button-filter-popular"
              >
                Populer
              </Button>
            </div>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {articles.slice(0, visibleArticles).map((article: any) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>

          {/* Load More Button */}
          {articles.length > visibleArticles && (
            <div className="text-center">
              <Button 
                onClick={loadMoreArticles}
                className="px-8 py-3"
                data-testid="button-load-more"
              >
                <Plus className="h-4 w-4 mr-2" />
                Muat Lebih Banyak
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <Sidebar />
        </div>
      </div>
    </div>
  );
}
