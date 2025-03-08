import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, BookOpen, Headphones, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PracticeHub = () => {
  const navigate = useNavigate();

  const practiceOptions = [
    {
      title: "Diyaloglar",
      description: "Farklı senaryolarda konuşma pratiği yapın",
      icon: <MessageSquare className="h-8 w-8 text-blue-500" />,
      color: "bg-blue-50",
      path: "/practice/dialogues",
    },
    {
      title: "Hikayeler",
      description:
        "Anlama becerinizi geliştirmek için hikayeler okuyun ve dinleyin",
      icon: <BookOpen className="h-8 w-8 text-purple-500" />,
      color: "bg-purple-50",
      path: "/practice/stories",
    },
    {
      title: "Dinleme Odası",
      description: "Ses içerikleriyle dinleme becerilerinizi geliştirin",
      icon: <Headphones className="h-8 w-8 text-green-500" />,
      color: "bg-green-50",
      path: "/listening-room",
    },
  ];

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg shadow">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Pratik Merkezi</h1>
        <p className="text-muted-foreground">
          Dil becerilerinizi geliştirmek için bir pratik etkinliği seçin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {practiceOptions.map((option, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <div
                className={`${option.color} p-6 flex items-center justify-center`}
              >
                {option.icon}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{option.title}</h2>
                <p className="text-muted-foreground mb-4">
                  {option.description}
                </p>
                <Button
                  onClick={() => navigate(option.path)}
                  className="w-full"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Pratiğe Başla
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-slate-50 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Pratik İstatistikleriniz</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-sm text-muted-foreground">
              Toplam Pratik Süresi
            </p>
            <p className="text-2xl font-bold">12s 30d</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-sm text-muted-foreground">
              Tamamlanan Oturumlar
            </p>
            <p className="text-2xl font-bold">24</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <p className="text-sm text-muted-foreground">Mevcut Seri</p>
            <p className="text-2xl font-bold">5 gün</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeHub;
