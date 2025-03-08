import React, { useState } from "react";
import {
  MessageSquare,
  Search,
  Filter,
  Plus,
  ThumbsUp,
  MessageCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ForumHome = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Mock forum posts data
  const forumPosts = [
    {
      id: "1",
      title: "İspanyolca fiil çekimlerini anlamakta zorlanıyorum",
      content:
        "Merhaba, İspanyolca'da düzensiz fiillerin çekimlerini ezberlemekte zorlanıyorum. Önerileriniz var mı?",
      author: {
        name: "Ahmet Yılmaz",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ahmet",
      },
      category: "grammar",
      language: "İspanyolca",
      likes: 15,
      comments: 8,
      timestamp: "2023-06-15T10:30:00Z",
    },
    {
      id: "2",
      title: "Fransızca telaffuz için podcast önerileri",
      content:
        "Fransızca telaffuzumu geliştirmek için dinleyebileceğim podcast önerileri arıyorum. Başlangıç seviyesi için uygun olanlar nelerdir?",
      author: {
        name: "Zeynep Kaya",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zeynep",
      },
      category: "resources",
      language: "Fransızca",
      likes: 24,
      comments: 12,
      timestamp: "2023-06-14T15:45:00Z",
    },
    {
      id: "3",
      title: "Almanca dil sınavına hazırlanıyorum",
      content:
        "Merhaba, 3 ay sonra Almanca B2 sınavına gireceğim. Hazırlık için önerileriniz nelerdir? Hangi kaynaklara odaklanmalıyım?",
      author: {
        name: "Mehmet Demir",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mehmet",
      },
      category: "exams",
      language: "Almanca",
      likes: 18,
      comments: 15,
      timestamp: "2023-06-13T09:15:00Z",
    },
    {
      id: "4",
      title: "İtalyanca öğrenmek için film önerileri",
      content:
        "İtalyanca öğrenmeye yeni başladım ve film izleyerek pratik yapmak istiyorum. Başlangıç seviyesi için uygun film önerileri nelerdir?",
      author: {
        name: "Ayşe Şahin",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ayse",
      },
      category: "resources",
      language: "İtalyanca",
      likes: 32,
      comments: 20,
      timestamp: "2023-06-12T14:20:00Z",
    },
  ];

  // Filter posts based on search query and active tab
  const filteredPosts = forumPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || post.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case "grammar":
        return { label: "Dilbilgisi", variant: "default" };
      case "resources":
        return { label: "Kaynaklar", variant: "secondary" };
      case "exams":
        return { label: "Sınavlar", variant: "outline" };
      default:
        return { label: "Genel", variant: "outline" };
    }
  };

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dil Öğrenme Forumu</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Konu Aç
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Forum konularını ara..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList>
              <TabsTrigger value="all">Tümü</TabsTrigger>
              <TabsTrigger value="grammar">Dilbilgisi</TabsTrigger>
              <TabsTrigger value="resources">Kaynaklar</TabsTrigger>
              <TabsTrigger value="exams">Sınavlar</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="space-y-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage
                      src={post.author.avatar}
                      alt={post.author.name}
                    />
                    <AvatarFallback>
                      {post.author.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      <Badge variant={getCategoryBadge(post.category).variant}>
                        {getCategoryBadge(post.category).label}
                      </Badge>
                      <Badge variant="secondary">{post.language}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatDate(post.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            Arama kriterlerinize uygun konu bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumHome;
