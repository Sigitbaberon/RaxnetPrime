import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: featuredArticles = [], isLoading } = useQuery({
    queryKey: ["/api/articles", { featured: "true" }],
  }) as { data: any[], isLoading: boolean };

  useEffect(() => {
    if (featuredArticles.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [featuredArticles.length]);

  if (isLoading || featuredArticles.length === 0) {
    return (
      <div className="mb-12">
        <div className="relative bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden h-96 lg:h-[500px] animate-pulse">
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-32"></div>
              <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-20 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
              <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-40"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentArticle = featuredArticles[currentSlide];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const articleDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - articleDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Baru saja";
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    return `${Math.floor(diffInHours / 24)} hari yang lalu`;
  };

  return (
    <div className="mb-12">
      <div className="relative bg-gray-900 rounded-xl overflow-hidden h-96 lg:h-[500px]">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{
            backgroundImage: `url(${currentArticle.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080'})`,
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 gradient-overlay" />
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <div className="max-w-4xl">
            <div className="flex items-center mb-4">
              <Badge 
                variant="destructive" 
                className="mr-4 bg-news-red text-white"
                data-testid={`badge-category-${currentArticle.category?.slug}`}
              >
                {currentArticle.category?.name || "Berita"}
              </Badge>
              <span className="text-gray-300 text-sm" data-testid="text-publish-time">
                {formatTimeAgo(currentArticle.publishedAt)}
              </span>
            </div>
            <h1 className="text-white text-3xl lg:text-5xl font-bold mb-4 leading-tight text-balance">
              {currentArticle.title}
            </h1>
            <p className="text-gray-200 text-lg mb-6 leading-relaxed line-clamp-3">
              {currentArticle.excerpt}
            </p>
            <Link href={`/article/${currentArticle.slug}`} data-testid="button-read-more">
              <Button className="bg-white text-news-blue hover:bg-gray-100">
                Baca Selengkapnya
              </Button>
            </Link>
          </div>
        </div>

        {/* Navigation Arrows */}
        {featuredArticles.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 glass-effect text-white p-3 rounded-full hover:bg-white/30 transition-all"
              data-testid="button-slider-prev"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 glass-effect text-white p-3 rounded-full hover:bg-white/30 transition-all"
              data-testid="button-slider-next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {featuredArticles.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {featuredArticles.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
                data-testid={`button-indicator-${index}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
