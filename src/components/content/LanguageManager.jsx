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

// Language form schema
const languageSchema = z.object({
  name: z.string().min(1, { message: "Language name is required" }),
  code: z.string().min(1, { message: "Language code is required" }),
  status: z.enum(["active", "inactive"], {
    required_error: "Status is required",
  }),
});

const LanguageManager = () => {
  const [languages, setLanguages] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      name: "",
      code: "",
      status: "active",
    },
  });

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("languages")
        .select("*")
        .order("name");

      if (error) throw error;
      setLanguages(data);
    } catch (error) {
      console.error("Error fetching languages:", error);
      toast({
        title: "Error",
        description: "Failed to load languages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddLanguage = () => {
    setEditingLanguage(null);
    form.reset({
      name: "",
      code: "",
      status: "active",
    });
    setIsDialogOpen(true);
  };

  const handleEditLanguage = (language) => {
    setEditingLanguage(language);
    form.reset({
      name: language.name,
      code: language.code,
      status: language.status,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteLanguage = async (id) => {
    try {
      // Check if language is used in courses, dictionary, or materials
      const { data: coursesUsingLanguage, error: coursesError } = await supabase
        .from("courses")
        .select("id")
        .eq("language_id", id)
        .limit(1);

      if (coursesError) throw coursesError;

      if (coursesUsingLanguage.length > 0) {
        toast({
          title: "Cannot Delete",
          description: "This language is being used in one or more courses",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("languages").delete().eq("id", id);

      if (error) throw error;

      setLanguages(languages.filter((language) => language.id !== id));
      toast({
        title: "Success",
        description: "Language deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting language:", error);
      toast({
        title: "Error",
        description: "Failed to delete language",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data) => {
    try {
      if (editingLanguage) {
        // Update existing language
        const { error } = await supabase
          .from("languages")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingLanguage.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Language updated successfully",
        });
      } else {
        // Check if language code already exists
        const { data: existingLanguage, error: checkError } = await supabase
          .from("languages")
          .select("id")
          .eq("code", data.code)
          .limit(1);

        if (checkError) throw checkError;

        if (existingLanguage.length > 0) {
          toast({
            title: "Error",
            description: "A language with this code already exists",
            variant: "destructive",
          });
          return;
        }

        // Add new language
        const { error } = await supabase.from("languages").insert([data]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Language added successfully",
        });
      }

      setIsDialogOpen(false);
      fetchLanguages(); // Refresh the list
    } catch (error) {
      console.error("Error saving language:", error);
      toast({
        title: "Error",
        description: "Failed to save language",
        variant: "destructive",
      });
    }
  };

  const filteredLanguages = languages.filter(
    (language) =>
      language.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      language.code.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Language Management</h2>
        <Button onClick={handleAddLanguage}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Language
        </Button>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search languages..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Table>
        <TableCaption>List of available languages in the platform</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-6">
                Loading languages...
              </TableCell>
            </TableRow>
          ) : filteredLanguages.length > 0 ? (
            filteredLanguages.map((language) => (
              <TableRow key={language.id}>
                <TableCell className="font-medium">{language.name}</TableCell>
                <TableCell>{language.code}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${language.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    {language.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(language.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditLanguage(language)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteLanguage(language.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-6 text-muted-foreground"
              >
                No languages found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLanguage ? "Edit Language" : "Add New Language"}
            </DialogTitle>
            <DialogDescription>
              {editingLanguage
                ? "Update the language details below."
                : "Fill in the details to add a new language to the platform."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. English" {...field} />
                    </FormControl>
                    <FormDescription>
                      The full name of the language as it will appear to users.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. en" {...field} />
                    </FormControl>
                    <FormDescription>
                      The ISO code for the language (e.g., 'en' for English).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Whether this language is currently available to users.
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
                  {editingLanguage ? "Update Language" : "Add Language"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LanguageManager;
