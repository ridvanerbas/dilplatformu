import React, { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

// Dictionary form schema
const dictionaryEntrySchema = z.object({
  word: z.string().min(1, { message: "Word is required" }),
  language_id: z.string().min(1, { message: "Language is required" }),
  translation: z.string().min(1, { message: "Translation is required" }),
  part_of_speech: z.string().min(1, { message: "Part of speech is required" }),
  examples: z.string().optional(),
});

const DictionaryManager = () => {
  const [entries, setEntries] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(dictionaryEntrySchema),
    defaultValues: {
      word: "",
      language_id: "",
      translation: "",
      part_of_speech: "",
      examples: "",
    },
  });

  useEffect(() => {
    fetchEntries();
    fetchLanguages();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("dictionary")
        .select(`*, languages(name, code)`);

      if (error) throw error;
      setEntries(data);
    } catch (error) {
      console.error("Error fetching dictionary entries:", error);
      toast({
        title: "Error",
        description: "Failed to load dictionary entries",
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
      console.error("Error fetching languages:", error);
    }
  };

  const handleAddEntry = () => {
    setEditingEntry(null);
    form.reset({
      word: "",
      language_id: "",
      translation: "",
      part_of_speech: "",
      examples: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    form.reset({
      word: entry.word,
      language_id: entry.language_id,
      translation: entry.translation,
      part_of_speech: entry.part_of_speech,
      examples: entry.examples ? entry.examples.join("\n") : "",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteEntry = async (id) => {
    try {
      const { error } = await supabase.from("dictionary").delete().eq("id", id);

      if (error) throw error;

      setEntries(entries.filter((entry) => entry.id !== id));
      toast({
        title: "Success",
        description: "Dictionary entry deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete dictionary entry",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      // Process examples from newline-separated string to array
      const examples = data.examples
        ? data.examples.split("\n").filter((ex) => ex.trim() !== "")
        : [];

      if (editingEntry) {
        // Update existing entry
        const { error } = await supabase
          .from("dictionary")
          .update({ ...data, examples })
          .eq("id", editingEntry.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Dictionary entry updated successfully",
        });
      } else {
        // Add new entry
        const { error } = await supabase
          .from("dictionary")
          .insert([{ ...data, examples }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Dictionary entry added successfully",
        });
      }

      setIsDialogOpen(false);
      fetchEntries(); // Refresh the list
    } catch (error) {
      console.error("Error saving entry:", error);
      toast({
        title: "Error",
        description: "Failed to save dictionary entry",
        variant: "destructive",
      });
    }
  };

  const filteredEntries = entries.filter(
    (entry) =>
      entry.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.languages?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full h-full p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dictionary Management</h2>
        <Button onClick={handleAddEntry}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search dictionary entries..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Table>
        <TableCaption>Dictionary entries for language learning</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Word</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Translation</TableHead>
            <TableHead>Part of Speech</TableHead>
            <TableHead>Examples</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                Loading entries...
              </TableCell>
            </TableRow>
          ) : filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.word}</TableCell>
                <TableCell>{entry.languages?.name || "Unknown"}</TableCell>
                <TableCell>{entry.translation}</TableCell>
                <TableCell>{entry.part_of_speech}</TableCell>
                <TableCell>
                  <ul className="list-disc pl-5">
                    {entry.examples?.map((example, index) => (
                      <li key={index} className="text-sm">
                        {example}
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditEntry(entry)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEntry(entry.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-6 text-muted-foreground"
              >
                No dictionary entries found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEntry
                ? "Edit Dictionary Entry"
                : "Add New Dictionary Entry"}
            </DialogTitle>
            <DialogDescription>
              {editingEntry
                ? "Update the dictionary entry details below."
                : "Fill in the details to add a new word to the dictionary."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="word"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Word</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. casa" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Language</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="translation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Translation</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. house" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="part_of_speech"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Part of Speech</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select part of speech" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="noun">Noun</SelectItem>
                          <SelectItem value="verb">Verb</SelectItem>
                          <SelectItem value="adjective">Adjective</SelectItem>
                          <SelectItem value="adverb">Adverb</SelectItem>
                          <SelectItem value="pronoun">Pronoun</SelectItem>
                          <SelectItem value="preposition">
                            Preposition
                          </SelectItem>
                          <SelectItem value="conjunction">
                            Conjunction
                          </SelectItem>
                          <SelectItem value="interjection">
                            Interjection
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="examples"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Example Sentences</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter example sentences (one per line)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter one example sentence per line
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
                  {editingEntry ? "Update Entry" : "Add Entry"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DictionaryManager;
