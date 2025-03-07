import React, { useState, useEffect } from "react";
import { PlusCircle, Search, Trash2, BookOpen, Volume2 } from "lucide-react";
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

const vocabularySchema = z.object({
  word_id: z.string().min(1, { message: "Word is required" }),
  notes: z.string().optional(),
});

const VocabularyManager = () => {
  const [vocabulary, setVocabulary] = useState([]);
  const [dictionaryWords, setDictionaryWords] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(vocabularySchema),
    defaultValues: {
      word_id: "",
      notes: "",
    },
  });

  useEffect(() => {
    fetchVocabulary();
    fetchDictionaryWords();
  }, []);

  const fetchVocabulary = async () => {
    try {
      setLoading(true);
      // In a real app, this would filter by the current user's ID
      const { data, error } = await supabase
        .from("user_vocabulary")
        .select(`*, dictionary(*, languages(name))`);

      if (error) throw error;
      setVocabulary(data);
    } catch (error) {
      console.error("Error fetching vocabulary:", error);
      toast({
        title: "Error",
        description: "Failed to load vocabulary",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDictionaryWords = async () => {
    try {
      const { data, error } = await supabase
        .from("dictionary")
        .select(`*, languages(name)`);

      if (error) throw error;
      setDictionaryWords(data);
    } catch (error) {
      console.error("Error fetching dictionary words:", error);
    }
  };

  const handleAddWord = () => {
    form.reset({
      word_id: "",
      notes: "",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteWord = async (id) => {
    try {
      const { error } = await supabase
        .from("user_vocabulary")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setVocabulary(vocabulary.filter((item) => item.id !== id));
      toast({
        title: "Success",
        description: "Word removed from your vocabulary",
      });
    } catch (error) {
      console.error("Error deleting vocabulary item:", error);
      toast({
        title: "Error",
        description: "Failed to remove word",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      // Check if word is already in user's vocabulary
      const { data: existingEntry, error: checkError } = await supabase
        .from("user_vocabulary")
        .select("id")
        .eq("word_id", data.word_id)
        .eq("user_id", "current-user-id") // In a real app, this would be the actual user ID
        .limit(1);

      if (checkError) throw checkError;

      if (existingEntry && existingEntry.length > 0) {
        toast({
          title: "Word Already Added",
          description: "This word is already in your vocabulary",
          variant: "destructive",
        });
        return;
      }

      // Add word to user's vocabulary
      const { error } = await supabase.from("user_vocabulary").insert([
        {
          word_id: data.word_id,
          notes: data.notes,
          user_id: "current-user-id", // In a real app, this would be the actual user ID
          added_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Word added to your vocabulary",
      });

      setIsDialogOpen(false);
      fetchVocabulary(); // Refresh the list
    } catch (error) {
      console.error("Error adding word to vocabulary:", error);
      toast({
        title: "Error",
        description: "Failed to add word to vocabulary",
        variant: "destructive",
      });
    }
  };

  const filteredVocabulary = vocabulary.filter(
    (item) =>
      item.dictionary?.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.dictionary?.translation
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (item.notes || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const playAudio = (word) => {
    // In a real app, this would play audio from a URL or use text-to-speech
    console.log(`Playing audio for: ${word}`);
    // Example using browser's speech synthesis
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Vocabulary</h1>
        <Button onClick={handleAddWord}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Word
        </Button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search your vocabulary..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading vocabulary...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVocabulary.length > 0 ? (
            filteredVocabulary.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {item.dictionary?.word}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {item.dictionary?.translation} •{" "}
                        <span className="italic">
                          {item.dictionary?.part_of_speech}
                        </span>{" "}
                        • {item.dictionary?.languages?.name}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => playAudio(item.dictionary?.word)}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {item.dictionary?.examples && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Examples:
                      </p>
                      <ul className="list-disc pl-5 text-sm">
                        {item.dictionary?.examples.map((example, index) => (
                          <li key={index}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {item.notes && (
                    <div className="mt-2 p-2 bg-slate-50 rounded-md">
                      <p className="text-xs font-medium text-muted-foreground">
                        My Notes:
                      </p>
                      <p className="text-sm">{item.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-between mt-4 pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Added:{" "}
                      {new Date(item.added_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteWord(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-muted-foreground">
              {searchQuery
                ? "No matching words found in your vocabulary."
                : "Your vocabulary is empty. Add words to get started."}
            </div>
          )}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to My Vocabulary</DialogTitle>
            <DialogDescription>
              Select a word from the dictionary to add to your personal
              vocabulary collection.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="word_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Word</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a word" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dictionaryWords.map((word) => (
                          <SelectItem key={word.id} value={word.id}>
                            {word.word} ({word.translation}) -{" "}
                            {word.languages?.name}
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
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Notes (Optional)</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Add your own notes, mnemonics, or context for this word"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Add any personal notes or memory aids for this word
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
                  Cancel
                </Button>
                <Button type="submit">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Add to Vocabulary
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VocabularyManager;
