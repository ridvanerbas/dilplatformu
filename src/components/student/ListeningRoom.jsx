import React, { useState, useEffect } from "react";
import {
  Headphones,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const ListeningRoom = () => {
  const [audioTracks, setAudioTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAudioTracks();
  }, []);

  const fetchAudioTracks = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from your database
      // For demo purposes, we'll use mock data
      const mockTracks = [
        {
          id: "1",
          title: "Temel İspanyolca Konuşma",
          artist: "Maria Rodriguez",
          language: "İspanyolca",
          duration: 180, // seconds
          level: "Başlangıç",
          cover_image:
            "https://images.unsplash.com/photo-1590002893558-64f0d58dcca4?w=300&q=80",
          audio_url: "https://example.com/audio/spanish-conversation.mp3",
        },
        {
          id: "2",
          title: "Fransızca Telaffuz Rehberi",
          artist: "Jean Dupont",
          language: "Fransızca",
          duration: 240,
          level: "Orta Seviye",
          cover_image:
            "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&q=80",
          audio_url: "https://example.com/audio/french-pronunciation.mp3",
        },
        {
          id: "3",
          title: "Almanca İş Kelime Hazinesi",
          artist: "Hans Mueller",
          language: "Almanca",
          duration: 300,
          level: "İleri Seviye",
          cover_image:
            "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?w=300&q=80",
          audio_url: "https://example.com/audio/german-business.mp3",
        },
        {
          id: "4",
          title: "Japonca Selamlaşmalar",
          artist: "Yuki Tanaka",
          language: "Japonca",
          duration: 210,
          level: "Başlangıç",
          cover_image:
            "https://images.unsplash.com/photo-1528164344705-47542687000d?w=300&q=80",
          audio_url: "https://example.com/audio/japanese-greetings.mp3",
        },
      ];

      setAudioTracks(mockTracks);
      setCurrentTrack(mockTracks[0]);
    } catch (error) {
      console.error("Error fetching audio tracks:", error);
      toast({
        title: "Hata",
        description: "Ses parçaları yüklenemedi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control the audio playback
  };

  const handlePrevious = () => {
    const currentIndex = audioTracks.findIndex(
      (track) => track.id === currentTrack.id,
    );
    const prevIndex =
      currentIndex > 0 ? currentIndex - 1 : audioTracks.length - 1;
    setCurrentTrack(audioTracks[prevIndex]);
    setProgress(0);
  };

  const handleNext = () => {
    const currentIndex = audioTracks.findIndex(
      (track) => track.id === currentTrack.id,
    );
    const nextIndex =
      currentIndex < audioTracks.length - 1 ? currentIndex + 1 : 0;
    setCurrentTrack(audioTracks[nextIndex]);
    setProgress(0);
  };

  const handleTrackSelect = (track) => {
    setCurrentTrack(track);
    setProgress(0);
    setIsPlaying(true);
  };

  const handleProgressChange = (value) => {
    setProgress(value[0]);
    // In a real app, this would seek the audio to the specified position
  };

  const handleVolumeChange = (value) => {
    setVolume(value[0]);
    // In a real app, this would adjust the audio volume
  };

  // Simulate progress updates when playing
  useEffect(() => {
    let interval;
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= currentTrack.duration) {
            clearInterval(interval);
            setIsPlaying(false);
            return currentTrack.duration;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg shadow">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dinleme Odası</h1>
        <p className="text-muted-foreground">
          Farklı dillerde ses içerikleriyle dinleme becerilerinizi geliştirin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Audio Player */}
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            {currentTrack && (
              <div>
                <div
                  className="h-64 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${currentTrack.cover_image})`,
                  }}
                ></div>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold">{currentTrack.title}</h2>
                    <p className="text-muted-foreground">
                      {currentTrack.artist} • {currentTrack.language} •{" "}
                      {currentTrack.level}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <Slider
                      value={[progress]}
                      max={currentTrack.duration}
                      step={1}
                      onValueChange={handleProgressChange}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{formatTime(progress)}</span>
                      <span>{formatTime(currentTrack.duration)}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex justify-center items-center space-x-4">
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
                        <Play className="h-6 w-6" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleNext}>
                      <SkipForward className="h-6 w-6" />
                    </Button>
                  </div>

                  {/* Volume control */}
                  <div className="flex items-center mt-6">
                    <Volume2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Slider
                      value={[volume]}
                      max={100}
                      step={1}
                      onValueChange={handleVolumeChange}
                      className="w-32"
                    />
                  </div>
                </CardContent>
              </div>
            )}
          </Card>
        </div>

        {/* Track List */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Mevcut Parçalar</h2>
          <div className="space-y-3 overflow-auto max-h-[500px] pr-2">
            {audioTracks.map((track) => (
              <div
                key={track.id}
                className={`p-3 rounded-md cursor-pointer transition-colors ${currentTrack?.id === track.id ? "bg-primary/10 border-primary" : "bg-slate-50 hover:bg-slate-100"}`}
                onClick={() => handleTrackSelect(track)}
              >
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded bg-slate-200 mr-3 overflow-hidden">
                    <img
                      src={track.cover_image}
                      alt={track.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{track.title}</h3>
                    <p className="text-xs text-muted-foreground truncate">
                      {track.language} • {formatTime(track.duration)}
                    </p>
                  </div>
                  {currentTrack?.id === track.id && isPlaying && (
                    <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium mb-2">Dinleme İpuçları</h3>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Her parçayı birkaç kez dinleyin</li>
              <li>• Anahtar kelime ve ifadeleri belirlemeye çalışın</li>
              <li>• Duyduklarınızı tekrar etmeyi deneyin</li>
              <li>• Yeni kelimeler için not alın</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeningRoom;
