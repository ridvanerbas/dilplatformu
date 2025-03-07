import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Search,
  Download,
  FileText,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

// Material form schema
const materialSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  language_id: z.string().min(1, { message: "Language is required" }),
  type: z.enum(["audio", "image", "document", "video"], {
    required_error: "Material type is required",
  }),
  description: z.string().optional(),
  file_url: z.string().optional(),
});

const MaterialsManager = () => {
  const [materials, setMaterials] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      title: "",
      language_id: "",
      type: "document",
      description: "",
      file_url: "",
    },
  });

  useEffect(() => {
    fetchMaterials();
    fetchLanguages();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("materials")
        .select(`*, languages(name), users(name)`);

      if (error) throw error;
      setMaterials(data);
    } catch (error) {
      console.error("Error fetching materials:", error);
      toast({
        title: "Error",
        description: "Failed to load materials",
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

  const handleAddMaterial = () => {
    setEditingMaterial(null);
    form.reset({
      title: "",
      language_id: "",
      type: "document",
      description: "",
      file_url: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditMaterial = (material) => {
    setEditingMaterial(material);
    form.reset({
      title: material.title,
      description: material.description || "",
      type: material.type,
      language_id: material.language_id,
      file_url: material.file_url || "",
    });
    setIsDialogOpen(true);
  };

  const handleDeleteMaterial = async (id) => {
    try {
      const { error } = await supabase.from("materials").delete().eq("id", id);

      if (error) throw error;

      setMaterials(materials.filter((material) => material.id !== id));
      toast({
        title: "Success",
        description: "Material deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting material:", error);
      toast({
        title: "Error",
        description: "Failed to delete material",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      // For demo purposes, we'll use a placeholder URL if none is provided
      if (!data.file_url) {
        data.file_url = `https://example.com/${data.type}/${data.title.toLowerCase().replace(/\s+/g, "-")}`;
      }

      // Add file size for demo
      const file_size = `${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 9) + 1} MB`;

      // Get current user ID (for demo, we'll use the admin user)
      const { data: adminUser } = await supabase
        .from("users")
        .select("id")
        .eq("role", "admin")
        .limit(1)
        .single();

      if (editingMaterial) {
        // Update existing material
        const { error } = await supabase
          .from("materials")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingMaterial.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Material updated successfully",
        });
      } else {
        // Add new material
        const { error } = await supabase.from("materials").insert([
          {
            ...data,
            uploaded_by: adminUser?.id,
            file_size,
          },
        ]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Material added successfully",
        });
      }

      setIsDialogOpen(false);
      fetchMaterials(); // Refresh the list
    } catch (error) {
      console.error("Error saving material:", error);
      toast({
        title: "Error",
        description: "Failed to save material",
        variant: "destructive",
      });
    }
  };

  const filteredMaterials = materials.filter(
    (material) =>
      material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (material.languages?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const getTypeIcon = (type) => {
    switch (type) {
      case "audio":
        return "🎵";
      case "image":
        return "🖼️";
      case "document":
        return "📄";
      case "video":
        return "🎬";
      default:
        return "📄";
    }
  };

  return (
    <div className="w-full h-full p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Learning Materials</h2>
        <Button onClick={handleAddMaterial}>
          <PlusCircle className="mr-2 h-4 w-4" />
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

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading materials...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((material) => (
              <Card key={material.id} className="overflow-hidden">
                <div className="h-40 bg-slate-100 flex items-center justify-center">
                  <div className="text-4xl text-slate-400">
                    {getTypeIcon(material.type)}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1">
                    {material.title}
                  </h3>
                  <div className="text-sm text-muted-foreground mb-2">
                    {material.languages?.name || "Unknown"} • {material.type} •{" "}
                    {material.file_size}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Uploaded by {material.users?.name || "Unknown"} on{" "}
                    {new Date(material.created_at).toLocaleDateString()}
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
      )}

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

              <FormField
                control={form.control}
                name="file_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/files/document.pdf"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter a URL for the file or upload below
                    </FormDescription>
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

export default MaterialsManager;
