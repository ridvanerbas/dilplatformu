import React, { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, Search } from "lucide-react";
import { useForm } from "react-hook-form";

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
  DialogTrigger,
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

interface Language {
  id: string;
  name: string;
  code: string;
  status: "active" | "inactive";
  createdAt: string;
}

interface LanguageFormValues {
  name: string;
  code: string;
  status: "active" | "inactive";
}

const LanguageManager = ({
  languages = defaultLanguages,
}: {
  languages?: Language[];
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm<LanguageFormValues>({
    defaultValues: {
      name: "",
      code: "",
      status: "active",
    },
  });

  const handleAddLanguage = () => {
    setEditingLanguage(null);
    form.reset({
      name: "",
      code: "",
      status: "active",
    });
    setIsDialogOpen(true);
  };

  const handleEditLanguage = (language: Language) => {
    setEditingLanguage(language);
    form.reset({
      name: language.name,
      code: language.code,
      status: language.status,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: LanguageFormValues) => {
    // Here you would typically save the data to your backend
    console.log("Form submitted:", data);
    setIsDialogOpen(false);
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
          {filteredLanguages.length > 0 ? (
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
                  {new Date(language.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditLanguage(language)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
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

// Default mock data
const defaultLanguages: Language[] = [
  {
    id: "1",
    name: "English",
    code: "en",
    status: "active",
    createdAt: "2023-01-15T08:30:00Z",
  },
  {
    id: "2",
    name: "Spanish",
    code: "es",
    status: "active",
    createdAt: "2023-01-20T10:15:00Z",
  },
  {
    id: "3",
    name: "French",
    code: "fr",
    status: "active",
    createdAt: "2023-02-05T14:45:00Z",
  },
  {
    id: "4",
    name: "German",
    code: "de",
    status: "active",
    createdAt: "2023-02-10T09:20:00Z",
  },
  {
    id: "5",
    name: "Japanese",
    code: "ja",
    status: "inactive",
    createdAt: "2023-03-01T11:30:00Z",
  },
];

export default LanguageManager;
