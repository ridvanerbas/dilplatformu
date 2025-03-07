import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ContentTabs from "./ContentTabs";
import LanguageManager from "./LanguageManager";
import CourseManager from "./CourseManager";
import {
  BookText,
  FileText,
  PlusCircle,
  Pencil,
  Trash2,
  Search,
  Download,
} from "lucide-react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DictionaryEntry {
  id: string;
  word: string;
  language: string;
  translation: string;
  partOfSpeech: string;
  examples: string[];
}

interface Material {
  id: string;
  title: string;
  type: "audio" | "image" | "document" | "video";
  language: string;
  uploadedBy: string;
  uploadDate: string;
  fileSize: string;
  url: string;
}

// Dictionary form schema
const dictionaryEntrySchema = z.object({
  word: z.string().min(1, { message: "Word is required" }),
  language: z.string().min(1, { message: "Language is required" }),
  translation: z.string().min(1, { message: "Translation is required" }),
  partOfSpeech: z.string().min(1, { message: "Part of speech is required" }),
  examples: z.string().optional(),
});

const DictionaryManager = () => {
  const [entries, setEntries] = useState<DictionaryEntry[]>([
    {
      id: "1",
      word: "casa",
      language: "Spanish",
      translation: "house",
      partOfSpeech: "noun",
      examples: ["Mi casa es grande", "Vamos a mi casa"],
    },
    {
      id: "2",
      word: "bonjour",
      language: "French",
      translation: "hello",
      partOfSpeech: "interjection",
      examples: ["Bonjour, comment ça va?"],
    },
    {
      id: "3",
      word: "schnell",
      language: "German",
      translation: "fast",
      partOfSpeech: "adjective",
      examples: ["Das Auto ist sehr schnell"],
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DictionaryEntry | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<z.infer<typeof dictionaryEntrySchema>>({
    resolver: zodResolver(dictionaryEntrySchema),
    defaultValues: {
      word: "",
      language: "",
      translation: "",
      partOfSpeech: "",
      examples: "",
    },
  });

  const handleAddEntry = () => {
    setEditingEntry(null);
    form.reset({
      word: "",
      language: "",
      translation: "",
      partOfSpeech: "",
      examples: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditEntry = (entry: DictionaryEntry) => {
    setEditingEntry(entry);
    form.reset({
      word: entry.word,
      language: entry.language,
      translation: entry.translation,
      partOfSpeech: entry.partOfSpeech,
      examples: entry.examples.join("\n"),
    });
    setIsDialogOpen(true);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const onSubmit = (data: z.infer<typeof dictionaryEntrySchema>) => {
    const examples = data.examples
      ? data.examples.split("\n").filter((ex) => ex.trim() !== "")
      : [];

    if (editingEntry) {
      // Update existing entry
      setEntries(
        entries.map((entry) =>
          entry.id === editingEntry.id
            ? { ...entry, ...data, examples }
            : entry,
        ),
      );
    } else {
      // Add new entry
      const newEntry: DictionaryEntry = {
        id: Math.random().toString(36).substring(2, 9),
        word: data.word,
        language: data.language,
        translation: data.translation,
        partOfSpeech: data.partOfSpeech,
        examples,
      };
      setEntries([...entries, newEntry]);
    }

    setIsDialogOpen(false);
  };

  const filteredEntries = entries.filter(
    (entry) =>
      entry.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.language.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full h-full p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Dictionary Management</h2>
        <Button onClick={handleAddEntry}>
          <BookText className="mr-2 h-4 w-4" />
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
          {filteredEntries.length > 0 ? (
            filteredEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">{entry.word}</TableCell>
                <TableCell>{entry.language}</TableCell>
                <TableCell>{entry.translation}</TableCell>
                <TableCell>{entry.partOfSpeech}</TableCell>
                <TableCell>
                  <ul className="list-disc pl-5">
                    {entry.examples.map((example, index) => (
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
                  name="language"
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
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="German">German</SelectItem>
                          <SelectItem value="Italian">Italian</SelectItem>
                          <SelectItem value="Japanese">Japanese</SelectItem>
                          <SelectItem value="Chinese">Chinese</SelectItem>
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
                  name="partOfSpeech"
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

// Material form schema
const materialSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  language: z.string().min(1, { message: "Language is required" }),
  type: z.enum(["audio", "image", "document", "video"], {
    required_error: "Material type is required",
  }),
  description: z.string().optional(),
});

const MaterialsManager = () => {
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: "1",
      title: "Spanish Pronunciation Guide",
      type: "audio",
      language: "Spanish",
      uploadedBy: "Maria Rodriguez",
      uploadDate: "2023-05-15",
      fileSize: "4.2 MB",
      url: "#",
    },
    {
      id: "2",
      title: "French Vocabulary Flashcards",
      type: "image",
      language: "French",
      uploadedBy: "Jean Dupont",
      uploadDate: "2023-06-02",
      fileSize: "2.8 MB",
      url: "#",
    },
    {
      id: "3",
      title: "German Grammar Guide",
      type: "document",
      language: "German",
      uploadedBy: "Hans Mueller",
      uploadDate: "2023-04-20",
      fileSize: "1.5 MB",
      url: "#",
    },
    {
      id: "4",
      title: "Japanese Conversation Practice",
      type: "video",
      language: "Japanese",
      uploadedBy: "Yuki Tanaka",
      uploadDate: "2023-06-10",
      fileSize: "28.5 MB",
      url: "#",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<z.infer<typeof materialSchema>>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      title: "",
      language: "",
      type: "document",
      description: "",
    },
  });

  const handleAddMaterial = () => {
    setEditingMaterial(null);
    form.reset({
      title: "",
      language: "",
      type: "document",
      description: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    form.reset({
      title: material.title,
      language: material.language,
      type: material.type,
      description: "",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteMaterial = (id: string) => {
    setMaterials(materials.filter((material) => material.id !== id));
  };

  const onSubmit = (data: z.infer<typeof materialSchema>) => {
    const currentDate = new Date().toISOString().split("T")[0];

    if (editingMaterial) {
      // Update existing material
      setMaterials(
        materials.map((material) =>
          material.id === editingMaterial.id
            ? {
                ...material,
                title: data.title,
                language: data.language,
                type: data.type,
              }
            : material,
        ),
      );
    } else {
      // Add new material
      const newMaterial: Material = {
        id: Math.random().toString(36).substring(2, 9),
        title: data.title,
        language: data.language,
        type: data.type,
        uploadedBy: "Current User",
        uploadDate: currentDate,
        fileSize: "0 KB",
        url: "#",
      };
      setMaterials([...materials, newMaterial]);
    }

    setIsDialogOpen(false);
  };

  const filteredMaterials = materials.filter(
    (material) =>
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.language.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full h-full p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Learning Materials</h2>
        <Button onClick={handleAddMaterial}>
          <FileText className="mr-2 h-4 w-4" />
          Upload Material
        </Button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search materials..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map((material) => (
            <Card key={material.id} className="overflow-hidden">
              <div className="h-40 bg-slate-100 flex items-center justify-center">
                {material.type === "audio" && (
                  <div className="text-4xl text-slate-400">🎵</div>
                )}
                {material.type === "image" && (
                  <div className="text-4xl text-slate-400">🖼️</div>
                )}
                {material.type === "document" && (
                  <div className="text-4xl text-slate-400">📄</div>
                )}
                {material.type === "video" && (
                  <div className="text-4xl text-slate-400">🎬</div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{material.title}</h3>
                <div className="text-sm text-muted-foreground mb-2">
                  {material.language} • {material.type} • {material.fileSize}
                </div>
                <div className="text-xs text-muted-foreground">
                  Uploaded by {material.uploadedBy} on {material.uploadDate}
                </div>
                <div className="flex justify-between mt-4">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditMaterial(material)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMaterial(material.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-12 text-muted-foreground">
            No materials found. Upload a new material to get started.
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMaterial ? "Edit Material" : "Upload New Material"}
            </DialogTitle>
            <DialogDescription>
              {editingMaterial
                ? "Update the material details below."
                : "Fill in the details to add a new learning material."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Spanish Pronunciation Guide"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="language"
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
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="German">German</SelectItem>
                          <SelectItem value="Italian">Italian</SelectItem>
                          <SelectItem value="Japanese">Japanese</SelectItem>
                          <SelectItem value="Chinese">Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="audio">Audio</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="document">Document</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Enter a description of this material"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border-t pt-4">
                <FormLabel>File Upload</FormLabel>
                <div className="mt-2 border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                  <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Drag and drop your file here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports audio, images, documents, and videos
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-4"
                  >
                    Browse Files
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  For demo purposes, no actual file upload will occur
                </p>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingMaterial ? "Update Material" : "Upload Material"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ContentManagementProps {
  defaultTab?: string;
}

const ContentManagement = ({
  defaultTab = "languages",
}: ContentManagementProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const location = useLocation();

  // Update active tab based on URL if needed
  useEffect(() => {
    if (location.pathname.includes("/content/languages")) {
      setActiveTab("languages");
    } else if (location.pathname.includes("/content/courses")) {
      setActiveTab("courses");
    } else if (location.pathname.includes("/content/dictionary")) {
      setActiveTab("dictionary");
    } else if (location.pathname.includes("/content/materials")) {
      setActiveTab("materials");
    }
  }, [location.pathname]);

  // Update active tab from props if provided
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "languages":
        return <LanguageManager />;
      case "courses":
        return <CourseManager />;
      case "dictionary":
        return <DictionaryManager />;
      case "materials":
        return <MaterialsManager />;
      default:
        return <LanguageManager />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-background">
      <ContentTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-auto">{renderTabContent()}</div>
    </div>
  );
};

export default ContentManagement;
