import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Newspaper, 
  Users, 
  MessageCircle, 
  Tags, 
  Edit, 
  Trash2, 
  Check, 
  X,
  Plus,
  BarChart3,
  TrendingUp,
  Eye,
  LogOut
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { getStoredAuth, clearStoredAuth, isAuthenticated } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [user] = useState(getStoredAuth());

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/superadmin-panel-98217");
    }
  }, [navigate]);

  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
  }) as { data: any, isLoading: boolean };

  const { data: articles = [] } = useQuery({
    queryKey: ["/api/articles", { limit: "10" }],
  }) as { data: any[] };

  const { data: pendingComments = [] } = useQuery({
    queryKey: ["/api/admin/comments/pending"],
  }) as { data: any[] };

  const approveCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await apiRequest("POST", `/api/admin/comments/${commentId}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/comments/pending"] });
      toast({
        title: "Komentar disetujui",
        description: "Komentar berhasil disetujui dan akan ditampilkan.",
      });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await apiRequest("DELETE", `/api/admin/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/comments/pending"] });
      toast({
        title: "Komentar dihapus",
        description: "Komentar berhasil dihapus.",
      });
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (articleId: string) => {
      await apiRequest("DELETE", `/api/articles/${articleId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      toast({
        title: "Artikel dihapus",
        description: "Artikel berhasil dihapus.",
      });
    },
  });

  const handleLogout = () => {
    clearStoredAuth();
    navigate("/superadmin-panel-98217");
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const itemDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60));
    
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <Card className="bg-gradient-to-r from-news-blue to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-blue-100">
                Kelola konten dan pengaturan Raxnet Prime
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-semibold" data-testid="text-admin-name">
                  {user?.username || "Admin"}
                </p>
                <p className="text-sm text-blue-200">
                  {user?.role === "superadmin" ? "Super Admin" : "Admin"}
                </p>
              </div>
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-white text-news-blue">
                  {getInitials(user?.username || "Admin")}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-white/20"
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Artikel</p>
                <p className="text-3xl font-bold" data-testid="text-total-articles">
                  {statsLoading ? "..." : stats.totalArticles || 0}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <Newspaper className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            {!statsLoading && (
              <div className="mt-4">
                <span className="text-green-500 text-sm font-medium">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  Aktif
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Views</p>
                <p className="text-3xl font-bold" data-testid="text-daily-views">
                  {statsLoading ? "..." : formatNumber(stats.dailyViews || 0)}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <Eye className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            {!statsLoading && (
              <div className="mt-4">
                <span className="text-green-500 text-sm font-medium">
                  Hari ini
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Komentar</p>
                <p className="text-3xl font-bold" data-testid="text-total-comments">
                  {statsLoading ? "..." : stats.totalComments || 0}
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            {!statsLoading && (
              <div className="mt-4">
                <span className="text-green-500 text-sm font-medium">
                  Semua waktu
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Pending</p>
                <p className="text-3xl font-bold" data-testid="text-pending-comments">
                  {statsLoading ? "..." : pendingComments.length}
                </p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-full">
                <MessageCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            {!statsLoading && (
              <div className="mt-4">
                <span className="text-orange-500 text-sm font-medium">
                  Perlu review
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Article Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Manajemen Artikel</CardTitle>
              <Button size="sm" data-testid="button-new-article">
                <Plus className="h-4 w-4 mr-2" />
                Artikel Baru
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {articles.slice(0, 5).map((article: any) => (
              <div 
                key={article.id} 
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                data-testid={`article-item-${article.id}`}
              >
                <div className="flex-1">
                  <h3 className="font-semibold line-clamp-1">{article.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {article.category?.name} • {formatTimeAgo(article.publishedAt)} • {formatNumber(article.views)} views
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    data-testid={`button-edit-article-${article.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => deleteArticleMutation.mutate(article.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    data-testid={`button-delete-article-${article.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {articles.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Newspaper className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada artikel</p>
              </div>
            )}

            <div className="text-center pt-4">
              <Button variant="ghost" data-testid="button-view-all-articles">
                Lihat Semua Artikel →
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comment Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Komentar Terbaru</CardTitle>
              {pendingComments.length > 0 && (
                <Badge variant="destructive" data-testid="badge-pending-count">
                  {pendingComments.length} Pending
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingComments.slice(0, 5).map((comment: any) => (
              <div 
                key={comment.id} 
                className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                data-testid={`pending-comment-${comment.id}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(comment.authorName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{comment.authorName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900">
                    Pending
                  </Badge>
                </div>
                <p className="text-sm text-foreground mb-3 line-clamp-2">
                  {comment.content}
                </p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => approveCommentMutation.mutate(comment.id)}
                    disabled={approveCommentMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    data-testid={`button-approve-comment-${comment.id}`}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Setujui
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteCommentMutation.mutate(comment.id)}
                    disabled={deleteCommentMutation.isPending}
                    data-testid={`button-reject-comment-${comment.id}`}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Tolak
                  </Button>
                </div>
              </div>
            ))}

            {pendingComments.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Tidak ada komentar pending</p>
              </div>
            )}

            <div className="text-center pt-4">
              <Button variant="ghost" data-testid="button-view-all-comments">
                Kelola Semua Komentar →
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart Placeholder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Analytics Overview
            </CardTitle>
            <select className="border border-border rounded-lg px-3 py-2 bg-background text-foreground">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
              <option>3 Bulan Terakhir</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Analytics Chart</p>
              <p className="text-sm text-muted-foreground">Chart.js integration required</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
