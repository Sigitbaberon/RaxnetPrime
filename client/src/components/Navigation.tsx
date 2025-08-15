import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Moon, Sun, Search, Menu, Newspaper } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export function Navigation() {
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  }) as { data: any[] };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results - would implement in full app
      console.log("Search for:", searchQuery);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const categoryLinks = [
    { name: "Beranda", href: "/", slug: "" },
    ...categories.map((cat: any) => ({
      name: cat.name,
      href: `/category/${cat.slug}`,
      slug: cat.slug,
    })),
  ];

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Newspaper className="h-8 w-8 text-news-blue dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-news-blue dark:text-blue-400">
                Raxnet Prime
              </h1>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Cari berita..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </form>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            <Link href="/superadmin-panel-98217" data-testid="link-admin">
              <Button variant="ghost" size="sm" className="hidden lg:inline-flex">
                Admin
              </Button>
            </Link>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-news-blue dark:bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-3 scrollbar-hide">
            {categoryLinks.map((link) => (
              <Link key={link.href} href={link.href} data-testid={`link-category-${link.slug || 'home'}`}>
                <span
                  className={`whitespace-nowrap text-sm font-medium hover:text-blue-200 transition-colors cursor-pointer ${
                    location === link.href
                      ? "text-yellow-300 border-b-2 border-yellow-300 pb-1"
                      : ""
                  } ${
                    link.name === "Trending" ? "text-yellow-300" : ""
                  }`}
                >
                  {link.name === "Trending" && "🔥 "}
                  {link.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
