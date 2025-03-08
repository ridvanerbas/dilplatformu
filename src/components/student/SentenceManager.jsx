import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Search,
  Trash2,
  MessageSquare,
  Volume2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const sentenceSchema = z.object({
  sentence: z.string().min(1, { message: "Cümle gereklidir" }),
  translation: z.string().min(1, { message: "Çeviri gereklidir" }),
  language_id: z.string().min(1, { message: "Dil gereklidir" }),
  notes: z.string().optional(),
});

const SentenceManager = () => {
  const [sentences, setSentences] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(sentenceSchema),
    defaultValues: {
      sentence: "",
      translation: "",
      language_id: "",
      notes: "",
    },
  });

  useEffect(() => {
    fetchSentences();
    fetchLanguages();
  }, []);

  const fetchSentences = async () => {
    try {
      setLoading(true);
      // Gerçek bir uygulamada, bu mevcut kullanıcının kimliğine göre filtrelenecektir
      const { data, error } = await supabase
        .from("user_sentences")
        .select(`*, languages(name)`);

      if (error) throw error;
      setSentences(data);
    } catch (error) {
      console.error("Cümleler yüklenirken hata:", error);
      toast({
        title: "Hata",
        description: "Cümleler yüklenemedi",
        variant: "destructive",
      });
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
      setLanguages(data);
    } catch (error) {
      console.error("Diller yüklenirken hata:", error);
    }
  };

  const handleAddSentence = () => {
    form.reset({
      sentence: "",
      translation: "",
      language_id: "",
      notes: "",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteSentence = async (id) => {
    try {
      const { error } = await supabase
        .from("user_sentences")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSentences(sentences.filter((item) => item.id !== id));
      toast({
        title: "Başarılı",
        description: "Cümle koleksiyonunuzdan kaldırıldı",
      });
    } catch (error) {
      console.error("Cümle silinirken hata:", error);
      toast({
        title: "Hata",
        description: "Cümle kaldırılamadı",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      // Cümleyi kullanıcının koleksiyonuna ekle
      const { error } = await supabase.from("user_sentences").insert([
        {
          sentence: data.sentence,
          translation: data.translation,
          language_id: data.language_id,
          notes: data.notes,
          user_id: "current-user-id", // Gerçek bir uygulamada, bu gerçek kullanıcı kimliği olacaktır
          added_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Cümle koleksiyonunuza eklendi",
      });

      setIsDialogOpen(false);
      fetchSentences(); // Listeyi yenile
    } catch (error) {
      console.error("Cümle eklenirken hata:", error);
      toast({
        title: "Hata",
        description: "Cümle eklenemedi",
        variant: "destructive",
      });
    }
  };

  const filteredSentences = sentences.filter(
    (item) =>
      item.sentence.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const playAudio = (text) => {
    // Gerçek bir uygulamada, bu bir URL'den ses çalacak veya metin-konuşma kullanacaktır
    console.log(`Ses çalınıyor: ${text}`);
    // Tarayıcının konuşma sentezi kullanım örneği
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cümlelerim</h1>
        <Button onClick={handleAddSentence}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Cümle Ekle
        </Button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cümlelerinizi arayın..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Cümleler yükleniyor...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSentences.length > 0 ? (
            filteredSentences.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">
                        {item.sentence}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.translation} • {item.languages?.name}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => playAudio(item.sentence)}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {item.notes && (
                    <div className="mt-2 p-2 bg-slate-50 rounded-md">
                      <p className="text-xs font-medium text-muted-foreground">
                        Notlarım:
                      </p>
                      <p className="text-sm">{item.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-between mt-4 pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Eklenme:{" "}
                      {new Date(item.added_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSentence(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 text-muted-foreground">
              {searchQuery
                ? "Koleksiyonunuzda eşleşen cümle bulunamadı."
                : "Cümle koleksiyonunuz boş. Başlamak için cümle ekleyin."}
            </div>
          )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cümlelerime Ekle</DialogTitle>
            <DialogDescription>
              Pratik yapmak için kişisel koleksiyonunuza yeni bir cümle ekleyin.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="language_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dil</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Bir dil seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language.id} value={language.id}>
                            {language.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sentence"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cümle</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Yabancı dilde cümleyi girin"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="translation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Çeviri</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ana dilinizde çeviriyi girin"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kişisel Notlar (İsteğe Bağlı)</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Bağlam, dilbilgisi notları veya kullanım örnekleri ekleyin"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Dilbilgisi, bağlam veya kullanım hakkında kişisel notlar
                      ekleyin
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  İptal
                </Button>
                <Button type="submit">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Cümle Ekle
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SentenceManager;
