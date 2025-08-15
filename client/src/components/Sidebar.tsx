import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Flame, Mail, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function Sidebar() {
  const [email, setEmail] = useState("");

  const { data: trendingArticles = [] } = useQuery({
    queryKey: ["/api/articles", { trending: "true" }],
  }) as { data: any[] };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // TODO: Implement newsletter subscription
      alert("Berhasil berlangganan newsletter!");
      setEmail("");
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="space-y-8">
      {/* Breaking News Banner */}
      <Card className="bg-news-red text-white border-news-red breaking-news">
        <CardContent className="p-4">
          <div className="flex items-center">
            <Badge className="bg-white text-news-red px-3 py-1 rounded-full text-sm font-bold mr-4">
              BREAKING
            </Badge>
            <span className="text-sm font-medium">
              Pemerintah Umumkan Kebijakan Ekonomi Baru untuk Mendorong Pertumbuhan UMKM
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Trending News */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Flame className="h-5 w-5 text-orange-500 mr-2" />
            Trending Hari Ini
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trendingArticles.slice(0, 5).map((article: any, index: number) => (
            <div key={article.id} className="flex items-start space-x-3 group cursor-pointer" data-testid={`trending-item-${index}`}>
              <Badge 
                variant={index === 0 ? "destructive" : index === 1 ? "default" : "secondary"}
                className="w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 rounded-full"
              >
                {index + 1}
              </Badge>
              <div className="flex-1">
                <h4 className="font-medium group-hover:text-news-blue dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {formatNumber(article.views)} pembaca
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Newsletter Signup */}
      <Card className="bg-gradient-to-br from-news-blue to-blue-600 text-white">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Newsletter Premium
          </h3>
          <p className="mb-4 text-blue-100">
            Dapatkan ringkasan berita harian dan analisis mendalam langsung di email Anda.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white text-gray-900 border-white"
              data-testid="input-newsletter-email"
            />
            <Button 
              type="submit"
              className="w-full bg-white text-news-blue hover:bg-gray-100"
              data-testid="button-newsletter-submit"
            >
              Berlangganan Gratis
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Ikuti Kami</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="button-facebook"
            >
              <Facebook className="h-4 w-4" />
              <span className="text-sm font-medium">Facebook</span>
            </Button>
            <Button 
              className="flex items-center justify-center space-x-2 bg-blue-400 hover:bg-blue-500 text-white"
              data-testid="button-twitter"
            >
              <Twitter className="h-4 w-4" />
              <span className="text-sm font-medium">Twitter</span>
            </Button>
            <Button 
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              data-testid="button-instagram"
            >
              <Instagram className="h-4 w-4" />
              <span className="text-sm font-medium">Instagram</span>
            </Button>
            <Button 
              className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white"
              data-testid="button-youtube"
            >
              <Youtube className="h-4 w-4" />
              <span className="text-sm font-medium">YouTube</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
