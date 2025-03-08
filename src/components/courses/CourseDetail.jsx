import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  Book,
  MessageSquare,
  FileText,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("lessons");

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from your database
      // For demo purposes, we'll use mock data
      const mockCourse = {
        id: courseId || "1",
        title: "İspanyolca Başlangıç Seviyesi",
        description:
          "İspanyolca dilini sıfırdan öğrenmek için kapsamlı bir kurs. Temel kelimeler, gramer ve günlük konuşmalar.",
        language: { name: "İspanyolca" },
        level: "A1 - Başlangıç",
        instructor: "Maria Rodriguez",
        total_lessons: 12,
        completed_lessons: 3,
        progress: 25,
        image_url:
          "https://images.unsplash.com/photo-1551966775-a4ddc8912228?w=800&q=80",
      };

      const mockLessons = [
        {
          id: "1",
          title: "Temel Selamlaşmalar",
          description:
            "İspanyolca'da temel selamlaşma ifadeleri ve tanışma cümleleri.",
          duration: "25 dakika",
          completed: true,
          video_url: "https://example.com/videos/lesson1.mp4",
          thumbnail:
            "https://images.unsplash.com/photo-1528747045269-390fe33c19f2?w=300&q=80",
          vocabulary: [
            {
              word: "Hola",
              translation: "Merhaba",
              example: "¡Hola! ¿Cómo estás?",
            },
            {
              word: "Buenos días",
              translation: "Günaydın",
              example: "Buenos días, profesor.",
            },
            {
              word: "Buenas tardes",
              translation: "İyi günler",
              example: "Buenas tardes a todos.",
            },
            {
              word: "Buenas noches",
              translation: "İyi geceler",
              example: "Buenas noches, hasta mañana.",
            },
            {
              word: "Adiós",
              translation: "Hoşça kal",
              example: "Adiós, nos vemos pronto.",
            },
          ],
          sentences: [
            {
              text: "Me llamo Juan. ¿Cómo te llamas?",
              translation: "Benim adım Juan. Senin adın ne?",
            },
            {
              text: "Mucho gusto en conocerte.",
              translation: "Tanıştığımıza memnun oldum.",
            },
            { text: "¿De dónde eres?", translation: "Nerelisin?" },
            { text: "Soy de Turquía.", translation: "Türkiye'denim." },
          ],
        },
        {
          id: "2",
          title: "Sayılar ve Renkler",
          description: "İspanyolca'da 1-100 arası sayılar ve temel renkler.",
          duration: "30 dakika",
          completed: true,
          video_url: "https://example.com/videos/lesson2.mp4",
          thumbnail:
            "https://images.unsplash.com/photo-1618022325802-7e5e732d97a1?w=300&q=80",
          vocabulary: [
            { word: "Uno", translation: "Bir", example: "Tengo uno libro." },
            { word: "Dos", translation: "İki", example: "Hay dos personas." },
            {
              word: "Tres",
              translation: "Üç",
              example: "Necesito tres manzanas.",
            },
            {
              word: "Rojo",
              translation: "Kırmızı",
              example: "Me gusta el color rojo.",
            },
            { word: "Azul", translation: "Mavi", example: "El cielo es azul." },
            {
              word: "Verde",
              translation: "Yeşil",
              example: "Me gustan las plantas verdes.",
            },
          ],
          sentences: [
            { text: "Tengo cinco hermanos.", translation: "Beş kardeşim var." },
            {
              text: "Mi color favorito es el azul.",
              translation: "En sevdiğim renk mavi.",
            },
            { text: "¿Cuántos años tienes?", translation: "Kaç yaşındasın?" },
            { text: "Tengo veinte años.", translation: "Yirmi yaşındayım." },
          ],
        },
        {
          id: "3",
          title: "Günlük İfadeler",
          description:
            "Günlük hayatta sık kullanılan İspanyolca ifadeler ve kalıplar.",
          duration: "35 dakika",
          completed: true,
          video_url: "https://example.com/videos/lesson3.mp4",
          thumbnail:
            "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=300&q=80",
          vocabulary: [
            {
              word: "Por favor",
              translation: "Lütfen",
              example: "Un café, por favor.",
            },
            {
              word: "Gracias",
              translation: "Teşekkürler",
              example: "Muchas gracias por tu ayuda.",
            },
            {
              word: "De nada",
              translation: "Bir şey değil",
              example: "De nada, fue un placer.",
            },
            {
              word: "Disculpe",
              translation: "Afedersiniz",
              example: "Disculpe, ¿dónde está el baño?",
            },
            {
              word: "Lo siento",
              translation: "Üzgünüm",
              example: "Lo siento, no puedo ir.",
            },
          ],
          sentences: [
            {
              text: "¿Puedes ayudarme, por favor?",
              translation: "Bana yardım edebilir misin, lütfen?",
            },
            {
              text: "No entiendo. ¿Puedes repetir?",
              translation: "Anlamıyorum. Tekrar edebilir misin?",
            },
            {
              text: "¿Dónde está la estación de tren?",
              translation: "Tren istasyonu nerede?",
            },
            {
              text: "Necesito un taxi, por favor.",
              translation: "Bir taksiye ihtiyacım var, lütfen.",
            },
          ],
        },
        {
          id: "4",
          title: "Aile ve İlişkiler",
          description:
            "Aile üyeleri ve ilişkileri tanımlayan İspanyolca kelimeler.",
          duration: "28 dakika",
          completed: false,
          video_url: "https://example.com/videos/lesson4.mp4",
          thumbnail:
            "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=300&q=80",
          vocabulary: [
            {
              word: "Madre",
              translation: "Anne",
              example: "Mi madre es profesora.",
            },
            {
              word: "Padre",
              translation: "Baba",
              example: "Mi padre trabaja en un banco.",
            },
            {
              word: "Hermano",
              translation: "Erkek kardeş",
              example: "Tengo dos hermanos.",
            },
            {
              word: "Hermana",
              translation: "Kız kardeş",
              example: "Mi hermana es médica.",
            },
            {
              word: "Abuelo",
              translation: "Büyükbaba",
              example: "Mi abuelo tiene 80 años.",
            },
          ],
          sentences: [
            {
              text: "Mi familia es muy grande.",
              translation: "Ailem çok kalabalık.",
            },
            {
              text: "¿Tienes hermanos o hermanas?",
              translation: "Erkek veya kız kardeşlerin var mı?",
            },
            {
              text: "Mis padres viven en Madrid.",
              translation: "Annem ve babam Madrid'de yaşıyor.",
            },
            {
              text: "Somos cinco personas en mi familia.",
              translation: "Ailemizde beş kişiyiz.",
            },
          ],
        },
        {
          id: "5",
          title: "Yiyecek ve İçecekler",
          description:
            "İspanyolca'da yiyecek, içecek isimleri ve restoranda sipariş verme.",
          duration: "32 dakika",
          completed: false,
          video_url: "https://example.com/videos/lesson5.mp4",
          thumbnail:
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=80",
          vocabulary: [
            {
              word: "Agua",
              translation: "Su",
              example: "Un vaso de agua, por favor.",
            },
            {
              word: "Pan",
              translation: "Ekmek",
              example: "Me gusta el pan fresco.",
            },
            { word: "Carne", translation: "Et", example: "No como carne." },
            {
              word: "Pescado",
              translation: "Balık",
              example: "El pescado está delicioso.",
            },
            {
              word: "Fruta",
              translation: "Meyve",
              example: "Como fruta todos los días.",
            },
          ],
          sentences: [
            { text: "¿Qué quieres comer?", translation: "Ne yemek istersin?" },
            { text: "La cuenta, por favor.", translation: "Hesap, lütfen." },
            { text: "Está muy rico.", translation: "Çok lezzetli." },
            {
              text: "¿Tienen platos vegetarianos?",
              translation: "Vejetaryen yemekleriniz var mı?",
            },
          ],
        },
      ];

      setCourse(mockCourse);
      setLessons(mockLessons);
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false);
    }
  };

  const [selectedLesson, setSelectedLesson] = useState(null);

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
  };

  const handleBackToLessons = () => {
    setSelectedLesson(null);
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Kurs bilgileri yükleniyor...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Kurs bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg shadow">
      {!selectedLesson ? (
        <>
          {/* Course Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="md:w-1/3">
              <img
                src={course.image_url}
                alt={course.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="md:w-2/3">
              <h1 className="text-2xl font-bold mb-2">{course.title}</h1>
              <p className="text-muted-foreground mb-4">{course.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Dil</p>
                  <p className="font-medium">{course.language.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Seviye</p>
                  <p className="font-medium">{course.level}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Eğitmen</p>
                  <p className="font-medium">{course.instructor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dersler</p>
                  <p className="font-medium">{course.total_lessons}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>İlerleme</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} />
                <p className="text-xs text-muted-foreground">
                  {course.completed_lessons} / {course.total_lessons} ders
                  tamamlandı
                </p>
              </div>
            </div>
          </div>

          {/* Course Content */}
          <Tabs
            defaultValue="lessons"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="lessons">Dersler</TabsTrigger>
              <TabsTrigger value="materials">Materyaller</TabsTrigger>
              <TabsTrigger value="forum">Forum</TabsTrigger>
            </TabsList>

            <TabsContent value="lessons" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Ders Listesi</h2>
              <div className="space-y-4">
                {lessons.map((lesson) => (
                  <Card key={lesson.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4">
                          <img
                            src={lesson.thumbnail}
                            alt={lesson.title}
                            className="w-full h-32 object-cover"
                          />
                        </div>
                        <div className="p-4 md:w-3/4 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between">
                              <h3 className="font-semibold text-lg">
                                {lesson.title}
                              </h3>
                              {lesson.completed && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  Tamamlandı
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {lesson.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Süre: {lesson.duration}
                            </p>
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button onClick={() => handleLessonSelect(lesson)}>
                              {lesson.completed ? "Tekrar İzle" : "Derse Başla"}
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="materials" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Kurs Materyalleri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          İspanyolca Temel Kelimeler PDF
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          2.4 MB • PDF
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      İndir
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          İspanyolca Fiil Çekimleri
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          1.8 MB • PDF
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      İndir
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">İspanyolca Alıştırmalar</h3>
                        <p className="text-sm text-muted-foreground">
                          3.1 MB • PDF
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      İndir
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="forum" className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Kurs Forumu</h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                        <img
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=maria"
                          alt="User"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">
                          Fiil çekimlerini anlamakta zorlanıyorum
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Düzensiz fiillerin çekimlerini ezberlemekte
                          zorlanıyorum. Önerisi olan var mı?
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Ahmet Y. • 2 gün önce
                          </span>
                          <span className="text-xs text-muted-foreground">
                            5 yanıt
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                        <img
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=zeynep"
                          alt="User"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Ek pratik kaynakları</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Derslere ek olarak pratik yapabileceğim kaynak
                          önerileri arıyorum.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Zeynep K. • 5 gün önce
                          </span>
                          <span className="text-xs text-muted-foreground">
                            8 yanıt
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex justify-center mt-4">
                <Button variant="outline">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Yeni Konu Aç
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="space-y-6">
          {/* Lesson Header */}
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={handleBackToLessons}>
              Ders Listesine Dön
            </Button>
            <div className="text-right">
              <h2 className="text-xl font-bold">{selectedLesson.title}</h2>
              <p className="text-sm text-muted-foreground">{course.title}</p>
            </div>
          </div>

          {/* Video Player */}
          <div className="bg-slate-900 aspect-video rounded-lg flex items-center justify-center">
            <div className="text-white text-center">
              <Play className="h-16 w-16 mx-auto mb-4 opacity-70" />
              <p>Video oynatıcı burada görüntülenecek</p>
              <p className="text-sm text-slate-400">
                Süre: {selectedLesson.duration}
              </p>
            </div>
          </div>

          {/* Lesson Content */}
          <Tabs defaultValue="vocabulary">
            <TabsList className="mb-4">
              <TabsTrigger value="vocabulary">Kelimeler</TabsTrigger>
              <TabsTrigger value="sentences">Cümleler</TabsTrigger>
              <TabsTrigger value="notes">Notlar</TabsTrigger>
            </TabsList>

            <TabsContent value="vocabulary" className="space-y-4">
              <h3 className="text-lg font-semibold mb-2">Kelime Listesi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedLesson.vocabulary.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold">{item.word}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.translation}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm mt-2 italic">
                        Örnek: {item.example}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="sentences" className="space-y-4">
              <h3 className="text-lg font-semibold mb-2">Örnek Cümleler</h3>
              <div className="space-y-4">
                {selectedLesson.sentences.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium">{item.text}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.translation}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <h3 className="text-lg font-semibold mb-2">Ders Notları</h3>
              <Card>
                <CardContent className="p-4">
                  <p className="mb-4">
                    Bu derste İspanyolca'da temel ifadeleri öğrendiniz. İşte
                    önemli noktalar:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      İspanyolca'da selamlaşma ifadeleri günün saatine göre
                      değişir.
                    </li>
                    <li>
                      Tanışma sırasında "Mucho gusto" (Tanıştığımıza memnun
                      oldum) ifadesi yaygın kullanılır.
                    </li>
                    <li>
                      İspanyolca'da soru cümleleri, cümlenin başında ve sonunda
                      ters soru işareti (¿) ve normal soru işareti (?) ile
                      belirtilir.
                    </li>
                    <li>
                      Resmi ve gayri resmi hitap şekilleri (tú ve usted)
                      arasındaki farka dikkat edin.
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-blue-50 rounded-md">
                    <h4 className="font-medium text-blue-800 mb-1">İpucu</h4>
                    <p className="text-sm text-blue-700">
                      Günlük konuşma pratiği için İspanyolca podcast'ler
                      dinlemeyi veya basit İspanyolca videolar izlemeyi deneyin.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" disabled={selectedLesson.id === "1"}>
              Önceki Ders
            </Button>
            <Button disabled={!selectedLesson.completed}>Sonraki Ders</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
