import React, { useState, useEffect } from "react";
import { BookOpen, Volume2, ArrowRight, RefreshCw, Check } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const StoryPractice = () => {
  const [stories, setStories] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedStory, setSelectedStory] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock stories data (in a real app, this would come from the database)
  const mockStories = [
    {
      id: "1",
      title: "The Red Balloon",
      language_id: "1",
      language: { name: "Spanish" },
      level: "Beginner",
      pages: [
        {
          text: "Un día, un niño llamado Pedro encontró un globo rojo en el parque. El globo era grande y brillante.",
          translation:
            "One day, a boy named Pedro found a red balloon in the park. The balloon was big and bright.",
        },
        {
          text: "Pedro llevó el globo a casa. Su madre estaba sorprendida. '¿De dónde sacaste ese globo?' preguntó ella.",
          translation:
            "Pedro took the balloon home. His mother was surprised. 'Where did you get that balloon?' she asked.",
        },
        {
          text: "'Lo encontré en el parque', dijo Pedro. 'Es mágico'. Su madre sonrió. 'Los globos no son mágicos', dijo ella.",
          translation:
            "'I found it in the park', said Pedro. 'It's magical'. His mother smiled. 'Balloons aren't magical', she said.",
        },
        {
          text: "Esa noche, Pedro puso el globo junto a su cama. Cuando se despertó por la mañana, ¡el globo estaba flotando cerca del techo!",
          translation:
            "That night, Pedro put the balloon next to his bed. When he woke up in the morning, the balloon was floating near the ceiling!",
        },
      ],
      quiz: [
        {
          question: "¿Qué encontró Pedro en el parque?",
          options: ["Un perro", "Un globo rojo", "Una pelota", "Un libro"],
          correctAnswer: 1,
        },
        {
          question: "¿Dónde puso Pedro el globo por la noche?",
          options: [
            "En la cocina",
            "En el jardín",
            "Junto a su cama",
            "En el baño",
          ],
          correctAnswer: 2,
        },
        {
          question: "¿Qué pasó con el globo por la mañana?",
          options: [
            "Desapareció",
            "Se desinfló",
            "Cambió de color",
            "Estaba flotando cerca del techo",
          ],
          correctAnswer: 3,
        },
      ],
    },
    {
      id: "2",
      title: "The Lost Cat",
      language_id: "1",
      language: { name: "Spanish" },
      level: "Intermediate",
      pages: [
        {
          text: "María tenía un gato negro llamado Luna. Luna era muy curiosa y le gustaba explorar el vecindario.",
          translation:
            "María had a black cat named Luna. Luna was very curious and liked to explore the neighborhood.",
        },
        {
          text: "Un día, Luna no regresó a casa. María estaba muy preocupada. Buscó a Luna por todas partes, pero no pudo encontrarla.",
          translation:
            "One day, Luna didn't come home. María was very worried. She looked for Luna everywhere, but couldn't find her.",
        },
        {
          text: "María hizo carteles con una foto de Luna y los puso en todo el vecindario. 'GATO PERDIDO. Por favor, llame si la ve.'",
          translation:
            "María made posters with a picture of Luna and put them all over the neighborhood. 'LOST CAT. Please call if you see her.'",
        },
        {
          text: "Tres días después, el teléfono sonó. Era una vecina. 'Creo que tu gato está en mi jardín', dijo. María corrió a ver y, efectivamente, ¡era Luna!",
          translation:
            "Three days later, the phone rang. It was a neighbor. 'I think your cat is in my garden', she said. María ran to see and, indeed, it was Luna!",
        },
      ],
      quiz: [
        {
          question: "¿De qué color era el gato de María?",
          options: ["Blanco", "Gris", "Negro", "Naranja"],
          correctAnswer: 2,
        },
        {
          question: "¿Qué hizo María para encontrar a Luna?",
          options: [
            "Llamó a la policía",
            "Hizo carteles y los puso en el vecindario",
            "No hizo nada",
            "Compró otro gato",
          ],
          correctAnswer: 1,
        },
        {
          question: "¿Dónde encontraron a Luna?",
          options: [
            "En el parque",
            "En el jardín de una vecina",
            "En la calle",
            "Nunca la encontraron",
          ],
          correctAnswer: 1,
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
    if (selectedLanguage) {
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
      setLanguages(data);
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  const startStory = (story) => {
    setSelectedStory(story);
    setCurrentPage(0);
    setShowTranslation(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleNextPage = () => {
    if (currentPage < selectedStory.pages.length - 1) {
      setCurrentPage(currentPage + 1);
      setShowTranslation(false);
    } else if (currentPage === selectedStory.pages.length - 1) {
      // Move to quiz
      setCurrentPage(selectedStory.pages.length);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
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

  const resetStory = () => {
    setCurrentPage(0);
    setShowTranslation(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionIndex]: answerIndex,
    });
  };

  const submitQuiz = () => {
    // Calculate score
    let correctCount = 0;
    selectedStory.quiz.forEach((question, index) => {
      if (quizAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / selectedStory.quiz.length) * 100);

    toast({
      title: "Quiz Completed",
      description: `Your score: ${score}% (${correctCount}/${selectedStory.quiz.length})`,
    });

    setQuizSubmitted(true);
  };

  const isQuizComplete = () => {
    return selectedStory.quiz.every(
      (_, index) => quizAnswers[index] !== undefined,
    );
  };

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Story Practice</h1>
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

      {!selectedStory ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-3 text-center py-12 text-muted-foreground">
              Loading stories...
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
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {story.pages.length} pages • {story.quiz.length} quiz
                    questions
                  </p>
                  <Button onClick={() => startStory(story)} className="w-full">
                    Start Reading
                  </Button>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-muted-foreground">
              No stories available for the selected language.
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
                  Restart
                </Button>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <Progress
                  value={
                    ((currentPage + 1) / (selectedStory.pages.length + 1)) * 100
                  }
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {currentPage < selectedStory.pages.length
                    ? `Page ${currentPage + 1} of ${selectedStory.pages.length}`
                    : "Quiz"}
                </p>
              </div>

              {/* Story content or quiz */}
              {currentPage < selectedStory.pages.length ? (
                <div className="space-y-6">
                  <div className="p-6 bg-slate-50 rounded-lg">
                    <p className="text-lg mb-4">
                      {selectedStory.pages[currentPage].text}
                    </p>
                    {showTranslation && (
                      <p className="text-sm text-muted-foreground italic">
                        {selectedStory.pages[currentPage].translation}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          playAudio(selectedStory.pages[currentPage].text)
                        }
                      >
                        <Volume2 className="mr-2 h-4 w-4" />
                        Listen
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2"
                        onClick={() => setShowTranslation(!showTranslation)}
                      >
                        {showTranslation ? "Hide" : "Show"} Translation
                      </Button>
                    </div>
                    <div>
                      {currentPage > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePrevPage}
                          className="mr-2"
                        >
                          Previous
                        </Button>
                      )}
                      <Button onClick={handleNextPage}>
                        {currentPage === selectedStory.pages.length - 1
                          ? "Go to Quiz"
                          : "Next"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold">Quiz</h3>
                  <p className="text-muted-foreground">
                    Test your understanding of the story by answering these
                    questions.
                  </p>

                  {quizSubmitted ? (
                    <div className="space-y-6">
                      {selectedStory.quiz.map((question, qIndex) => (
                        <div
                          key={qIndex}
                          className="p-4 bg-slate-50 rounded-lg"
                        >
                          <p className="font-medium mb-3">
                            {qIndex + 1}. {question.question}
                          </p>
                          <RadioGroup
                            value={quizAnswers[qIndex]?.toString()}
                            disabled
                          >
                            {question.options.map((option, oIndex) => (
                              <div
                                key={oIndex}
                                className={`flex items-center space-x-2 p-2 rounded ${quizAnswers[qIndex] === oIndex ? (question.correctAnswer === oIndex ? "bg-green-100" : "bg-red-100") : question.correctAnswer === oIndex ? "bg-green-100" : ""}`}
                              >
                                <RadioGroupItem
                                  value={oIndex.toString()}
                                  id={`q${qIndex}-o${oIndex}`}
                                  checked={quizAnswers[qIndex] === oIndex}
                                />
                                <Label
                                  htmlFor={`q${qIndex}-o${oIndex}`}
                                  className="flex-1"
                                >
                                  {option}
                                </Label>
                                {quizAnswers[qIndex] === oIndex &&
                                  question.correctAnswer === oIndex && (
                                    <Check className="h-4 w-4 text-green-600" />
                                  )}
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      ))}

                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentPage(0)}
                        >
                          Read Again
                        </Button>
                        <Button onClick={resetStory}>Try Another Story</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {selectedStory.quiz.map((question, qIndex) => (
                        <div
                          key={qIndex}
                          className="p-4 bg-slate-50 rounded-lg"
                        >
                          <p className="font-medium mb-3">
                            {qIndex + 1}. {question.question}
                          </p>
                          <RadioGroup
                            value={quizAnswers[qIndex]?.toString()}
                            onValueChange={(value) =>
                              handleQuizAnswer(qIndex, parseInt(value))
                            }
                          >
                            {question.options.map((option, oIndex) => (
                              <div
                                key={oIndex}
                                className="flex items-center space-x-2 p-2 rounded hover:bg-slate-100"
                              >
                                <RadioGroupItem
                                  value={oIndex.toString()}
                                  id={`q${qIndex}-o${oIndex}`}
                                />
                                <Label
                                  htmlFor={`q${qIndex}-o${oIndex}`}
                                  className="flex-1"
                                >
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      ))}

                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() =>
                            setCurrentPage(selectedStory.pages.length - 1)
                          }
                        >
                          Back to Story
                        </Button>
                        <Button
                          onClick={submitQuiz}
                          disabled={!isQuizComplete()}
                        >
                          Submit Answers
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StoryPractice;
