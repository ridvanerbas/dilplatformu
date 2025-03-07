import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";

const ListeningRoom = () => {
  const [audioMaterials, setAudioMaterials] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchLanguages();
    fetchAudioMaterials();
  }, []);

  useEffect(() => {
    if (selectedLanguage) {
      fetchAudioMaterials(selectedLanguage);
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

  const fetchAudioMaterials = async (languageId = null) => {
    try {
      setLoading(true);
      let query = supabase
        .from("materials")
        .select(`*, languages(name)`)
        .eq("type", "audio");

      if (languageId) {
        query = query.eq("language_id", languageId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAudioMaterials(data);

      // Set first audio as current if none selected
      if (data.length > 0 && !currentAudio) {
        setCurrentAudio(data[0]);
      }
    } catch (error) {
      console.error("Error fetching audio materials:", error);
      toast({
        title: "Error",
        description: "Failed to load audio materials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    // In a real app, this would control an actual audio player
    setIsPlaying(!isPlaying);
    toast({
      title: isPlaying ? "Paused" : "Playing",
      description: `${currentAudio?.title}`,
    });
  };

  const handleNext = () => {
    if (!audioMaterials.length) return;

    const currentIndex = audioMaterials.findIndex(
      (audio) => audio.id === currentAudio?.id,
    );
    const nextIndex = (currentIndex + 1) % audioMaterials.length;
    setCurrentAudio(audioMaterials[nextIndex]);
    setProgress(0);

    if (isPlaying) {
      // Simulate restarting playback
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 100);
    }
  };

  const handlePrevious = () => {
    if (!audioMaterials.length) return;

    const currentIndex = audioMaterials.findIndex(
      (audio) => audio.id === currentAudio?.id,
    );
    const prevIndex =
      (currentIndex - 1 + audioMaterials.length) % audioMaterials.length;
    setCurrentAudio(audioMaterials[prevIndex]);
    setProgress(0);

    if (isPlaying) {
      // Simulate restarting playback
      setIsPlaying(false);
      setTimeout(() => setIsPlaying(true), 100);
    }
  };

  const handleVolumeChange = (value) => {
    setVolume(value[0]);
    if (isMuted && value[0] > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleProgressChange = (value) => {
    setProgress(value[0]);
    // In a real app, this would seek the audio to the specified position
  };

  const selectAudio = (audio) => {
    setCurrentAudio(audio);
    setProgress(0);
    setIsPlaying(true);
  };

  // Simulate progress updates when playing
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + 0.5;
          if (newProgress >= 100) {
            handleNext();
            return 0;
          }
          return newProgress;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Listening Room</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Audio Player */}
        <div className="md:col-span-2">
          <Card className="bg-slate-50">
            <CardContent className="p-6">
              {currentAudio ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold">
                        {currentAudio.title}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {currentAudio.languages?.name} •{" "}
                        {currentAudio.file_size}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                      <Volume2 className="h-6 w-6 text-primary-foreground" />
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <Slider
                      value={[progress]}
                      min={0}
                      max={100}
                      step={0.1}
                      onValueChange={handleProgressChange}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>
                        {Math.floor(progress / 60)}:
                        {Math.floor(progress % 60)
                          .toString()
                          .padStart(2, "0")}
                      </span>
                      <span>3:45</span> {/* Placeholder duration */}
                    </div>
                  </div>

                  {/* Playback controls */}
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePrevious}
                    >
                      <SkipBack className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="default"
                      size="icon"
                      className="h-12 w-12 rounded-full"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6 ml-1" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleNext}>
                      <SkipForward className="h-6 w-6" />
                    </Button>
                  </div>

                  {/* Volume control */}
                  <div className="flex items-center space-x-2 mt-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      className="h-8 w-8"
                    >
                      {isMuted ? (
                        <VolumeX className="h-4 w-4" />
                      ) : (
                        <Volume2 className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="w-full">
                      <Slider
                        value={[isMuted ? 0 : volume]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  {currentAudio.description && (
                    <div className="mt-6 p-4 bg-white rounded-md">
                      <h3 className="text-sm font-medium mb-2">Description</h3>
                      <p className="text-sm text-muted-foreground">
                        {currentAudio.description}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <Volume2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    No audio content selected
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Audio List */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="mb-4">
                <Input
                  placeholder="Search audio content..."
                  className="w-full"
                />
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {loading ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Loading audio content...
                  </div>
                ) : audioMaterials.length > 0 ? (
                  audioMaterials.map((audio) => (
                    <div
                      key={audio.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${currentAudio?.id === audio.id ? "bg-primary/10" : "hover:bg-slate-100"}`}
                      onClick={() => selectAudio(audio)}
                    >
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                          {currentAudio?.id === audio.id && isPlaying ? (
                            <Pause className="h-4 w-4 text-primary" />
                          ) : (
                            <Play className="h-4 w-4 ml-0.5 text-primary" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm line-clamp-1">
                            {audio.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {audio.languages?.name} • {audio.file_size}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No audio content available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ListeningRoom;
