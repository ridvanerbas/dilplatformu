import React, { useState, useEffect } from "react";
import { ChevronRight, RefreshCw, Volume2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StoryPractice = () => {
  const [stories, setStories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showTranslation, setShowTranslation] = useState(true);
  const [userAnswers, setUserAnswers] = useState({});
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock stories data (in a real app, this would come from the database)
  const mockStories = [
    {
      id: "1",
      title: "Kırmızı Balon",
      language_id: "1",
      language: { name: "İspanyolca" },
      level: "Başlangıç",
      pages: [
        {
          text: "Un día, un niño llamado Pedro encontró un globo rojo en el parque. El globo era grande y brillante.",
          translation:
            "Bir gün, Pedro adında bir çocuk parkta kırmızı bir balon buldu. Balon büyük ve parlaktı.",
          audio_url: "https://example.com/audio/red-balloon-1.mp3",
        },
        {
          text: "Pedro llevó el globo a casa. Su mamá le dijo: '¡Qué bonito globo tienes, Pedro!'",
          translation:
            "Pedro balonu eve götürdü. Annesi ona: 'Ne güzel bir balonun var, Pedro!' dedi.",
          audio_url: "https://example.com/audio/red-balloon-2.mp3",
        },
        {
          text: "Pedro jugó con el globo todo el día. Estaba muy feliz con su nuevo amigo rojo.",
          translation:
            "Pedro balonla bütün gün oynadı. Yeni kırmızı arkadaşıyla çok mutluydu.",
          audio_url: "https://example.com/audio/red-balloon-3.mp3",
        },
        {
          text: "Cuando Pedro fue a dormir, ató el globo a su cama. 'Buenas noches, globo rojo', dijo Pedro.",
          translation:
            "Pedro uyumaya gittiğinde, balonu yatağına bağladı. 'İyi geceler, kırmızı balon' dedi Pedro.",
          audio_url: "https://example.com/audio/red-balloon-4.mp3",
        },
      ],
      questions: [
        {
          question: "¿Qué encontró Pedro en el parque?",
          translation: "Pedro parkta ne buldu?",
          options: ["Un globo rojo", "Un perro", "Una pelota", "Un juguete"],
          correct_answer: "Un globo rojo",
        },
        {
          question: "¿Dónde llevó Pedro el globo?",
          translation: "Pedro balonu nereye götürdü?",
          options: ["A la escuela", "Al parque", "A casa", "A la tienda"],
          correct_answer: "A casa",
        },
        {
          question: "¿Cómo se sentía Pedro con su globo?",
          translation: "Pedro balonuyla nasıl hissediyordu?",
          options: ["Triste", "Enojado", "Asustado", "Feliz"],
          correct_answer: "Feliz",
        },
      ],
    },
    {
      id: "2",
      title: "Küçük Kedi",
      language_id: "1",
      language: { name: "İspanyolca" },
      level: "Başlangıç",
      pages: [
        {
          text: "Había una vez un gato pequeño llamado Milo. Milo era gris con rayas negras.",
          translation:
            "Bir zamanlar Milo adında küçük bir kedi vardı. Milo siyah çizgili gri bir kediydi.",
          audio_url: "https://example.com/audio/little-cat-1.mp3",
        },
        {
          text: "A Milo le gustaba jugar en el jardín. Perseguía mariposas y saltaba entre las flores.",
          translation:
            "Milo bahçede oynamayı severdi. Kelebekler peşinde koşar ve çiçekler arasında zıplardı.",
          audio_url: "https://example.com/audio/little-cat-2.mp3",
        },
        {
          text: "Un día, Milo vio un pájaro en un árbol. Intentó subir al árbol, pero tenía miedo.",
          translation:
            "Bir gün, Milo bir ağaçta bir kuş gördü. Ağaca tırmanmaya çalıştı, ama korkuyordu.",
          audio_url: "https://example.com/audio/little-cat-3.mp3",
        },
        {
          text: "La niña ayudó a Milo a bajar del árbol. Milo estaba agradecido y ronroneó feliz.",
          translation:
            "Kız Milo'nun ağaçtan inmesine yardım etti. Milo minnettardı ve mutlulukla mırıldandı.",
          audio_url: "https://example.com/audio/little-cat-4.mp3",
        },
      ],
      questions: [
        {
          question: "¿De qué color era Milo?",
          translation: "Milo ne renkti?",
          options: [
            "Blanco con manchas marrones",
            "Negro",
            "Gris con rayas negras",
            "Naranja",
          ],
          correct_answer: "Gris con rayas negras",
        },
        {
          question: "¿Dónde le gustaba jugar a Milo?",
          translation: "Milo nerede oynamayı severdi?",
          options: [
            "En la casa",
            "En el jardín",
            "En la calle",
            "En el parque",
          ],
          correct_answer: "En el jardín",
        },
      ],
    },
  ];

  useEffect(() => {
    fetchLanguages();
    // In a real app, we would fetch stories from the database
    setStories(mockStories);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedLanguage && selectedLanguage !== "all") {
      const filteredStories = mockStories.filter(
        (story) => story.language_id === selectedLanguage,
      );
      setStories(filteredStories);
    } else {
      setStories(mockStories);
    }
  }, [selectedLanguage]);

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

  const startStory = (story) => {
    setSelectedStory(story);
    setCurrentPage(0);
    setShowTranslation(true);
    setUserAnswers({});
    setCompleted(false);
  };

  const handleNextPage = () => {
    if (currentPage < selectedStory.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else if (currentPage === selectedStory.pages.length - 1) {
      // Show quiz after reading all pages
      setCurrentPage(selectedStory.pages.length);
    } else if (
      currentPage >= selectedStory.pages.length &&
      currentPage <
        selectedStory.pages.length + selectedStory.questions.length - 1
    ) {
      // Navigate through quiz questions
      setCurrentPage(currentPage + 1);
    } else {
      // Complete the story
      setCompleted(true);
      toast({
        title: "Hikaye Tamamlandı",
        description: "Harika iş! Bu hikaye ve quizi tamamladınız.",
      });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const playAudio = (audioUrl) => {
    // In a real app, this would play audio from a URL
    console.log(`Playing audio: ${audioUrl}`);
    // Example using browser's speech synthesis for demo
    if ("speechSynthesis" in window) {
      const currentPage = selectedStory.pages[currentPage];
      const utterance = new SpeechSynthesisUtterance(currentPage.text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const resetStory = () => {
    setCurrentPage(0);
    setShowTranslation(true);
    setUserAnswers({});
    setCompleted(false);
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: answer,
    });
  };

  const calculateScore = () => {
    if (!selectedStory || !userAnswers) return 0;

    let correctAnswers = 0;
    selectedStory.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correct_answer) {
        correctAnswers++;
      }
    });

    return Math.round((correctAnswers / selectedStory.questions.length) * 100);
  };

  const renderStoryPage = () => {
    const page = selectedStory.pages[currentPage];
    return (
      <div className="space-y-6">
        <div className="p-6 bg-slate-50 rounded-lg">
          <p className="text-lg mb-4">{page.text}</p>
          {showTranslation && (
            <p className="text-sm text-muted-foreground italic">
              {page.translation}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => playAudio(page.audio_url)}
            >
              <Volume2 className="mr-2 h-4 w-4" />
              Dinle
            </Button>
          </div>
          <div>
            {currentPage > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                className="mr-2"
              >
                Önceki
              </Button>
            )}
            <Button onClick={handleNextPage}>
              İleri
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderQuizQuestion = () => {
    const questionIndex = currentPage - selectedStory.pages.length;
    const question = selectedStory.questions[questionIndex];

    return (
      <div className="space-y-6">
        <div className="p-6 bg-slate-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Soru {questionIndex + 1}</h3>
          <p className="text-lg mb-2">{question.question}</p>
          {showTranslation && (
            <p className="text-sm text-muted-foreground italic mb-4">
              {question.translation}
            </p>
          )}

          <div className="space-y-2 mt-4">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={`p-3 border rounded-md cursor-pointer ${userAnswers[questionIndex] === option ? "border-primary bg-primary/5" : "hover:bg-slate-100"}`}
                onClick={() => handleAnswerSelect(questionIndex, option)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTranslation(!showTranslation)}
            >
              {showTranslation ? "Çeviriyi Gizle" : "Çeviriyi Göster"}
            </Button>
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              className="mr-2"
            >
              Önceki
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={userAnswers[questionIndex] === undefined}
            >
              {questionIndex === selectedStory.questions.length - 1
                ? "Bitir"
                : "İleri"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hikaye Pratiği</h1>
        <div className="w-48">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Dile göre filtrele" />
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
        </div>
      </div>

      {!selectedStory ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-3 text-center py-12 text-muted-foreground">
              Hikayeler yükleniyor...
            </div>
          ) : stories.length > 0 ? (
            stories.map((story) => (
              <Card key={story.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold">{story.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {story.language.name} • {story.level}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                      >
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                        <path d="M8 7h6" />
                        <path d="M8 11h8" />
                        <path d="M8 15h6" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {story.pages.length} sayfa • {story.questions.length} soru
                  </p>
                  <Button onClick={() => startStory(story)} className="w-full">
                    Okumaya Başla
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-muted-foreground">
              Seçilen dil için hikaye bulunamadı.
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">{selectedStory.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedStory.language.name} • {selectedStory.level}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={resetStory}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Yeniden Başlat
                </Button>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <Progress
                  value={
                    ((currentPage + 1) /
                      (selectedStory.pages.length +
                        selectedStory.questions.length)) *
                    100
                  }
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {currentPage < selectedStory.pages.length
                    ? `Sayfa ${currentPage + 1} / ${selectedStory.pages.length}`
                    : `Soru ${currentPage - selectedStory.pages.length + 1} / ${selectedStory.questions.length}`}
                </p>
              </div>

              {completed ? (
                <div className="text-center py-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-600"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Hikaye Tamamlandı!</h3>
                  <p className="text-muted-foreground mb-2">
                    Bu hikaye ve quizi başarıyla tamamladınız.
                  </p>
                  <div className="mb-6">
                    <div className="inline-block px-4 py-2 bg-slate-100 rounded-full">
                      <span className="font-bold text-lg">
                        Puan: {calculateScore()}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" onClick={resetStory}>
                      Tekrar Oku
                    </Button>
                    <Button onClick={() => setSelectedStory(null)}>
                      Başka Hikaye Seç
                    </Button>
                  </div>
                </div>
              ) : currentPage < selectedStory.pages.length ? (
                renderStoryPage()
              ) : (
                renderQuizQuestion()
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StoryPractice;
