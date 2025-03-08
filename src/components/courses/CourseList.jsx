import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, Filter, ChevronRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CourseList = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
    fetchLanguages();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from your database
      // For demo purposes, we'll use mock data
      const mockCourses = [
        {
          id: "1",
          title: "İspanyolca Başlangıç Seviyesi",
          description:
            "İspanyolca dilini sıfırdan öğrenmek için kapsamlı bir kurs.",
          language: { id: "1", name: "İspanyolca" },
          level: "A1 - Başlangıç",
          instructor: "Maria Rodriguez",
          total_lessons: 12,
          completed_lessons: 3,
          progress: 25,
          enrolled: true,
          image_url:
            "https://images.unsplash.com/photo-1551966775-a4ddc8912228?w=800&q=80",
        },
        {
          id: "2",
          title: "Fransızca Günlük Konuşma",
          description:
            "Günlük hayatta kullanabileceğiniz pratik Fransızca konuşma becerileri.",
          language: { id: "2", name: "Fransızca" },
          level: "A2 - Temel",
          instructor: "Jean Dupont",
          total_lessons: 15,
          completed_lessons: 8,
          progress: 53,
          enrolled: true,
          image_url:
            "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
        },
        {
          id: "3",
          title: "Almanca İş İletişimi",
          description:
            "İş dünyasında kullanılan Almanca terimler ve iletişim becerileri.",
          language: { id: "3", name: "Almanca" },
          level: "B1 - Orta",
          instructor: "Hans Mueller",
          total_lessons: 20,
          completed_lessons: 0,
          progress: 0,
          enrolled: false,
          image_url:
            "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=800&q=80",
        },
        {
          id: "4",
          title: "İtalyanca Temel Seviye",
          description:
            "İtalyanca dilini temel seviyede öğrenmek için başlangıç kursu.",
          language: { id: "4", name: "İtalyanca" },
          level: "A1 - Başlangıç",
          instructor: "Sofia Bianchi",
          total_lessons: 10,
          completed_lessons: 0,
          progress: 0,
          enrolled: false,
          image_url:
            "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80",
        },
        {
          id: "5",
          title: "Japonca Günlük İfadeler",
          description:
            "Japonya'da seyahat ederken kullanabileceğiniz temel ifadeler ve kelimeler.",
          language: { id: "5", name: "Japonca" },
          level: "A1 - Başlangıç",
          instructor: "Yuki Tanaka",
          total_lessons: 8,
          completed_lessons: 0,
          progress: 0,
          enrolled: false,
          image_url:
            "https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80",
        },
      ];

      setCourses(mockCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLanguages = async () => {
    try {
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .eq("status", "active");

      if (error) throw error;
      setLanguages(data || []);
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  const handleCourseSelect = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesLanguage =
      selectedLanguage === "all" || course.language.id === selectedLanguage;
    const matchesLevel =
      selectedLevel === "all" || course.level.includes(selectedLevel);
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLanguage && matchesLevel && matchesSearch;
  });

  const enrolledCourses = filteredCourses.filter((course) => course.enrolled);
  const availableCourses = filteredCourses.filter((course) => !course.enrolled);

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kurslarım</h1>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Kurs ara..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Dil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Diller</SelectItem>
              {languages.map((language) => (
                <SelectItem key={language.id} value={language.id}>
                  {language.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Seviye" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Seviyeler</SelectItem>
              <SelectItem value="A1">A1 - Başlangıç</SelectItem>
              <SelectItem value="A2">A2 - Temel</SelectItem>
              <SelectItem value="B1">B1 - Orta</SelectItem>
              <SelectItem value="B2">B2 - Orta Üstü</SelectItem>
              <SelectItem value="C1">C1 - İleri</SelectItem>
              <SelectItem value="C2">C2 - Ustalaşmış</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Kurslar yükleniyor...
        </div>
      ) : (
        <div className="space-y-8">
          {/* Enrolled Courses */}
          {enrolledCourses.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Kayıtlı Olduğum Kurslar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="relative h-40">
                      <img
                        src={course.image_url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary">
                          {course.language.name}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {course.description}
                      </p>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span>{course.level}</span>
                        <span>{course.instructor}</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>İlerleme</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} />
                        <p className="text-xs text-muted-foreground">
                          {course.completed_lessons} / {course.total_lessons}{" "}
                          ders tamamlandı
                        </p>
                      </div>
                      <Button
                        className="w-full mt-4"
                        onClick={() => handleCourseSelect(course.id)}
                      >
                        Kursa Devam Et
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Available Courses */}
          {availableCourses.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Mevcut Kurslar</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableCourses.map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="relative h-40">
                      <img
                        src={course.image_url}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary">
                          {course.language.name}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-1">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {course.description}
                      </p>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span>{course.level}</span>
                        <span>{course.instructor}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm mb-4">
                        <span>
                          <BookOpen className="inline h-4 w-4 mr-1" />
                          {course.total_lessons} ders
                        </span>
                        <span>Ücretsiz</span>
                      </div>
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => handleCourseSelect(course.id)}
                      >
                        Kursu İncele
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {filteredCourses.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Arama kriterlerinize uygun kurs bulunamadı.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseList;
