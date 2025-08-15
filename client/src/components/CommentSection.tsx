import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CommentSectionProps {
  articleId: string;
}

export function CommentSection({ articleId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["/api/articles", articleId, "comments"],
  }) as { data: any[], isLoading: boolean };

  const createCommentMutation = useMutation({
    mutationFn: async (commentData: { authorName: string; content: string }) => {
      const response = await apiRequest("POST", `/api/articles/${articleId}/comments`, commentData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles", articleId, "comments"] });
      setNewComment("");
      setAuthorName("");
      toast({
        title: "Komentar berhasil dikirim",
        description: "Komentar Anda akan ditampilkan setelah disetujui moderator.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal mengirim komentar",
        description: "Terjadi kesalahan saat mengirim komentar.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    createCommentMutation.mutate({
      authorName: authorName.trim(),
      content: newComment.trim(),
    });
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Baru saja";
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    return `${Math.floor(diffInHours / 24)} hari yang lalu`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <section className="mt-12 pt-8 border-t border-border">
        <div className="space-y-4">
          <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
          <div className="h-32 bg-muted rounded animate-pulse"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex space-x-4">
                <div className="w-10 h-10 bg-muted rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4 animate-pulse"></div>
                  <div className="h-16 bg-muted rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h3 className="text-2xl font-bold mb-6" data-testid="text-comments-title">
        Komentar ({comments.length})
      </h3>
      
      {/* Comment Form */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="flex space-x-4">
              <Avatar className="w-10 h-10">
                <AvatarFallback>
                  <span className="text-sm">?</span>
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-4">
                <input
                  type="text"
                  placeholder="Nama Anda"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                  required
                  data-testid="input-comment-author"
                />
                <Textarea
                  placeholder="Tulis komentar Anda..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px] resize-none"
                  required
                  data-testid="textarea-comment-content"
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Gunakan bahasa yang sopan dan konstruktif
                  </p>
                  <Button 
                    type="submit" 
                    disabled={createCommentMutation.isPending || !newComment.trim() || !authorName.trim()}
                    data-testid="button-submit-comment"
                  >
                    {createCommentMutation.isPending ? "Mengirim..." : "Kirim Komentar"}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Belum ada komentar. Jadilah yang pertama berkomentar!
              </p>
            </CardContent>
          </Card>
        ) : (
          comments.map((comment: any) => (
            <div key={comment.id} className="flex space-x-4" data-testid={`comment-${comment.id}`}>
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(comment.authorName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold" data-testid={`text-comment-author-${comment.id}`}>
                    {comment.authorName}
                  </h4>
                  <span className="text-muted-foreground text-sm" data-testid={`text-comment-time-${comment.id}`}>
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-foreground mb-3" data-testid={`text-comment-content-${comment.id}`}>
                  {comment.content}
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <button 
                    className="flex items-center space-x-1 hover:text-primary transition-colors"
                    data-testid={`button-like-comment-${comment.id}`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{comment.likes || 0}</span>
                  </button>
                  <button 
                    className="hover:text-primary transition-colors"
                    data-testid={`button-reply-comment-${comment.id}`}
                  >
                    Balas
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {comments.length > 0 && (
        <div className="text-center mt-8">
          <Button variant="ghost" data-testid="button-load-more-comments">
            Muat Komentar Lainnya
          </Button>
        </div>
      )}
    </section>
  );
}
