import React, { useState, useEffect } from "react";
import { MessageSquare, Volume2, ArrowRight, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const DialoguePractice = () => {
  const [dialogues, setDialogues] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedDialogue, setSelectedDialogue] = useState(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [userResponse, setUserResponse] = useState("");
  const [showTranslation, setShowTranslation] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock dialogues data (in a real app, this would come from the database)
  const mockDialogues = [
    {
      id: "1",
      title: "At the Restaurant",
      language_id: "1",
      language: { name: "Spanish" },
      level: "Beginner",
      lines: [
        {
          speaker: "Waiter",
          text: "¡Buenas tardes! ¿Tienen una reserva?",
          translation: "Good afternoon! Do you have a reservation?",
        },
        {
          speaker: "Customer",
          text: "Sí, tenemos una reserva para dos personas a nombre de García.",
          translation:
            "Yes, we have a reservation for two people under the name García.",
        },
        {
          speaker: "Waiter",
          text: "Perfecto. Por favor, síganme a su mesa.",
          translation: "Perfect. Please follow me to your table.",
        },
        {
          speaker: "Customer",
          text: "Gracias. ¿Podemos ver el menú?",
          translation: "Thank you. Can we see the menu?",
        },
        {
          speaker: "Waiter",
          text: "Por supuesto, aquí tienen. ¿Desean algo de beber mientras deciden?",
          translation:
            "Of course, here you are. Would you like something to drink while you decide?",
        },
      ],
    },
    {
      id: "2",
      title: "At the Hotel",
      language_id: "1",
      language: { name: "Spanish" },
      level: "Intermediate",
      lines: [
        {
          speaker: "Receptionist",
          text: "Bienvenido al Hotel Plaza. ¿En qué puedo ayudarle?",
          translation: "Welcome to Hotel Plaza. How can I help you?",
        },
        {
          speaker: "Guest",
          text: "Tengo una reserva a nombre de Smith para tres noches.",
          translation:
            "I have a reservation under the name Smith for three nights.",
        },
        {
          speaker: "Receptionist",
          text: "Un momento, déjeme verificar... Sí, aquí está. Una habitación doble con vista al mar.",
          translation:
            "One moment, let me check... Yes, here it is. A double room with sea view.",
        },
        {
          speaker: "Guest",
          text: "Perfecto. ¿El desayuno está incluido?",
          translation: "Perfect. Is breakfast included?",
        },
        {
          speaker: "Receptionist",
          text: "Sí, el desayuno se sirve de 7 a 10 en el restaurante del primer piso.",
          translation:
            "Yes, breakfast is served from 7 to 10 in the restaurant on the first floor.",
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
      setLanguages(data);
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  const startDialogue = (dialogue) => {
    setSelectedDialogue(dialogue);
    setCurrentLineIndex(0);
    setUserResponse("");
    setShowTranslation(false);
  };

  const handleNext = () => {
    if (currentLineIndex < selectedDialogue.lines.length - 1) {
      setCurrentLineIndex(currentLineIndex + 1);
      setUserResponse("");
      setShowTranslation(false);
    } else {
      // End of dialogue
      toast({
        title: "Dialogue Completed",
        description: "Great job! You've completed this dialogue.",
      });
    }
  };

  const handleSubmitResponse = () => {
    const currentLine = selectedDialogue.lines[currentLineIndex];
    // In a real app, we would check the response against the expected text
    // For now, we'll just show a success message
    toast({
      title: "Response Submitted",
      description: "Your response has been recorded.",
    });
    handleNext();
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
    setCurrentLineIndex(0);
    setUserResponse("");
    setShowTranslation(false);
  };

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dialogue Practice</h1>
        <div className="w-48">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Languages</SelectItem>
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
              Loading dialogues...
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
                    {dialogue.lines.length} exchanges
                  </p>
                  <Button
                    onClick={() => startDialogue(dialogue)}
                    className="w-full"
                  >
                    Start Practice
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-muted-foreground">
              No dialogues available for the selected language.
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
                  Restart
                </Button>
              </div>

              <div className="space-y-4">
                {selectedDialogue.lines.map((line, index) => {
                  if (index > currentLineIndex) return null;

                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${index === currentLineIndex ? "bg-primary/5 border border-primary/20" : "bg-slate-50"}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">{line.speaker}:</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => playAudio(line.text)}
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-lg mb-2">{line.text}</p>
                      {(showTranslation || index < currentLineIndex) && (
                        <p className="text-sm text-muted-foreground italic">
                          {line.translation}
                        </p>
                      )}

                      {index === currentLineIndex && (
                        <div className="mt-4">
                          {line.speaker === "Customer" ||
                          line.speaker === "Guest" ? (
                            <div className="space-y-4">
                              <Input
                                placeholder="Type your response..."
                                value={userResponse}
                                onChange={(e) =>
                                  setUserResponse(e.target.value)
                                }
                              />
                              <div className="flex justify-between">
                                <Button
                                  variant="outline"
                                  onClick={() => setShowTranslation(true)}
                                  disabled={showTranslation}
                                >
                                  Show Translation
                                </Button>
                                <Button
                                  onClick={handleSubmitResponse}
                                  disabled={!userResponse.trim()}
                                >
                                  Submit
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between mt-4">
                              <Button
                                variant="outline"
                                onClick={() => setShowTranslation(true)}
                                disabled={showTranslation}
                              >
                                Show Translation
                              </Button>
                              <Button onClick={handleNext}>
                                Continue <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {currentLineIndex >= selectedDialogue.lines.length && (
                  <div className="p-6 bg-green-50 rounded-lg text-center">
                    <h3 className="text-lg font-bold text-green-800 mb-2">
                      Dialogue Completed!
                    </h3>
                    <p className="text-green-700 mb-4">
                      Great job! You've successfully completed this dialogue.
                    </p>
                    <Button onClick={resetDialogue}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Practice Again
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DialoguePractice;
