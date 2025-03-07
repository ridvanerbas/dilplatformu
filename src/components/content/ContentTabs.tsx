import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Languages, BookOpen, BookText, FileText } from "lucide-react";

interface ContentTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const ContentTabs = ({ activeTab, onTabChange }: ContentTabsProps) => {
  return (
    <div className="border-b p-4 bg-white">
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="languages" className="flex items-center gap-2">
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">Languages</span>
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Courses</span>
          </TabsTrigger>
          <TabsTrigger value="dictionary" className="flex items-center gap-2">
            <BookText className="h-4 w-4" />
            <span className="hidden sm:inline">Dictionary</span>
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Materials</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ContentTabs;
