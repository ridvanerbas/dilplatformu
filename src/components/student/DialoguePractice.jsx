import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Volume2,
  RefreshCw,
  Check,
  ChevronRight,
} from "lucide-react";
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

const DialoguePractice = () => {
  const [dialogues, setDialogues] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedDialogue, setSelectedDialogue] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [userResponses, setUserResponses] = useState({});
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock dialogues data (in a real app, this would come from the database)
  const mockDialogues = [
    {
      id: "1",
      title: "Restoranda",
      language_id: "1",
      language: { name: "İspanyolca" },
      level: "Başlangıç",
      exchanges: [
        {
          speaker: "Garson",
          text: "¡Buenas tardes! ¿Puedo tomar su orden?",
          translation: "İyi günler! Siparişinizi alabilir miyim?",
        },
        {
          speaker: "Siz",
          text: "Sí, quisiera una ensalada y agua mineral, por favor.",
          translation: "Evet, bir salata ve maden suyu istiyorum, lütfen.",
          isUserResponse: true,
          options: [
            "Sí, quisiera una ensalada y agua mineral, por favor.",
            "No, todavía no estoy listo.",
            "¿Tiene recomendaciones?",
          ],
        },
        {
          speaker: "Garson",
          text: "Excelente elección. ¿Algo más?",
          translation: "Mükemmel seçim. Başka bir şey?",
        },
        {
          speaker: "Siz",
          text: "No, eso es todo. Gracias.",
          translation: "Hayır, hepsi bu kadar. Teşekkürler.",
          isUserResponse: true,
          options: [
            "No, eso es todo. Gracias.",
            "Sí, también quiero postre.",
            "¿Cuánto cuesta?",
          ],
        },
        {
          speaker: "Garson",
          text: "Muy bien. Su orden estará lista en unos minutos.",
          translation:
            "Çok iyi. Siparişiniz birkaç dakika içinde hazır olacak.",
        },
      ],
    },
    {
      id: "2",
      title: "Otel Rezervasyonu",
      language_id: "1",
      language: { name: "İspanyolca" },
      level: "Orta Seviye",
      exchanges: [
        {
          speaker: "Resepsiyonist",
          text: "Hotel Buena Vista, ¿en qué puedo ayudarle?",
          translation: "Hotel Buena Vista, size nasıl yardımcı olabilirim?",
        },
        {
          speaker: "Siz",
          text: "Buenas tardes. Me gustaría reservar una habitación, por favor.",
          translation:
            "İyi günler. Bir oda rezervasyonu yapmak istiyorum, lütfen.",
          isUserResponse: true,
          options: [
            "Buenas tardes. Me gustaría reservar una habitación, por favor.",
            "¿Cuánto cuesta una habitación?",
            "¿Tiene habitaciones disponibles?",
          ],
        },
        {
          speaker: "Resepsiyonist",
          text: "Por supuesto. ¿Para qué fechas necesita la habitación?",
          translation: "Tabii ki. Hangi tarihler için odaya ihtiyacınız var?",
        },
        {
          speaker: "Siz",
          text: "Del 15 al 20 de julio, por favor.",
          translation: "15-20 Temmuz arası, lütfen.",
          isUserResponse: true,
          options: [
            "Del 15 al 20 de julio, por favor.",
            "Para este fin de semana.",
            "Por una semana, empezando mañana.",
          ],
        },
        {
          speaker: "Resepsiyonist",
          text: "Perfecto. ¿Prefiere una habitación individual o doble?",
          translation:
            "Mükemmel. Tek kişilik mi çift kişilik mi oda tercih edersiniz?",
        },
        {
          speaker: "Siz",
          text: "Una habitación doble, por favor.",
          translation: "Çift kişilik oda, lütfen.",
          isUserResponse: true,
          options: [
            "Una habitación doble, por favor.",
            "Una habitación individual estará bien.",
            "¿Cuál recomienda usted?",
          ],
        },
      ],
    },
  ];

  useEffect(() => {
    fetchLanguages();
    // In a real app, we would fetch dialogues from the database
    setDialogues(mockDialogues);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedLanguage) {
      const filteredDialogues = mockDialogues.filter(
        (dialogue) => dialogue.language_id === selectedLanguage,
      );
      setDialogues(filteredDialogues);
    } else {
      setDialogues(mockDialogues);
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

  const startDialogue = (dialogue) => {
    setSelectedDialogue(dialogue);
    setCurrentStep(0);
    setShowTranslation(false);
    setUserResponses({});
    setCompleted(false);
  };

  const handleSelectResponse = (response) => {
    setUserResponses({
      ...userResponses,
      [currentStep]: response,
    });
  };

  const handleNext = () => {
    if (currentStep < selectedDialogue.exchanges.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowTranslation(false);
    } else {
      setCompleted(true);
      toast({
        title: "Diyalog Tamamlandı",
        description: "Harika iş! Bu diyalog pratiğini tamamladınız.",
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowTranslation(false);
    }
  };

  const playAudio = (text) => {
    // In a real app, this would play audio from a URL or use text-to-speech
    console.log(`Playing audio for: ${text}`);
    // Example using browser's speech synthesis
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const resetDialogue = () => {
    setCurrentStep(0);
    setShowTranslation(false);
    setUserResponses({});
    setCompleted(false);
  };

  const canProceed = () => {
    const currentExchange = selectedDialogue?.exchanges[currentStep];
    return !currentExchange?.isUserResponse || userResponses[currentStep];
  };

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Diyalog Pratiği</h1>
        <div className="w-48">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Dile göre filtrele" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tüm Diller</SelectItem>
              {languages.map((language) => (
                <SelectItem key={language.id} value={language.id}>
                  {language.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!selectedDialogue ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-3 text-center py-12 text-muted-foreground">
              Diyaloglar yükleniyor...
            </div>
          ) : dialogues.length > 0 ? (
            dialogues.map((dialogue) => (
              <Card key={dialogue.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold">{dialogue.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {dialogue.language.name} • {dialogue.level}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {dialogue.exchanges.length} konuşma
                  </p>
                  <Button
                    onClick={() => startDialogue(dialogue)}
                    className="w-full"
                  >
                    Pratiğe Başla
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-muted-foreground">
              Seçilen dil için diyalog bulunamadı.
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedDialogue.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedDialogue.language.name} • {selectedDialogue.level}
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={resetDialogue}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Yeniden Başlat
                </Button>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <Progress
                  value={
                    ((currentStep + 1) / selectedDialogue.exchanges.length) *
                    100
                  }
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Konuşma {currentStep + 1} /{" "}
                  {selectedDialogue.exchanges.length}
                </p>
              </div>

              {completed ? (
                <div className="text-center py-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    Diyalog Tamamlandı!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Bu diyalog pratiğini başarıyla tamamladınız.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button variant="outline" onClick={resetDialogue}>
                      Tekrar Pratik Yap
                    </Button>
                    <Button onClick={() => setSelectedDialogue(null)}>
                      Başka Diyalog Seç
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Current exchange */}
                  <div className="space-y-4">
                    {selectedDialogue.exchanges
                      .slice(0, currentStep + 1)
                      .map((exchange, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg ${exchange.speaker === "Siz" ? "bg-primary/10 ml-12" : "bg-slate-50 mr-12"}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <p className="font-medium">{exchange.speaker}</p>
                            {exchange.speaker !== "Siz" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => playAudio(exchange.text)}
                              >
                                <Volume2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          {exchange.isUserResponse && index === currentStep ? (
                            <div className="space-y-2">
                              {exchange.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className={`p-2 border rounded-md cursor-pointer ${userResponses[currentStep] === option ? "border-primary bg-primary/5" : "hover:bg-slate-100"}`}
                                  onClick={() => handleSelectResponse(option)}
                                >
                                  {option}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p>
                              {exchange.isUserResponse
                                ? userResponses[index]
                                : exchange.text}
                            </p>
                          )}

                          {showTranslation && (
                            <p className="text-sm text-muted-foreground mt-2 italic">
                              {exchange.translation}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>

                  {/* Controls */}
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
                      {currentStep > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePrevious}
                          className="mr-2"
                        >
                          Önceki
                        </Button>
                      )}
                      <Button onClick={handleNext} disabled={!canProceed()}>
                        {currentStep === selectedDialogue.exchanges.length - 1
                          ? "Tamamla"
                          : "İleri"}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DialoguePractice;
