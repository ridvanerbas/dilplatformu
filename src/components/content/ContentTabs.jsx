import React from "react";
import { BookOpen, Globe, BookText, FileText } from "lucide-react";

const ContentTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: "languages",
      label: "Languages",
      icon: <Globe className="h-4 w-4" />,
    },
    {
      id: "courses",
      label: "Courses",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      id: "dictionary",
      label: "Dictionary",
      icon: <BookText className="h-4 w-4" />,
    },
    {
      id: "materials",
      label: "Materials",
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  return (
    <div className="border-b">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center px-4 py-3 text-sm font-medium ${
              activeTab === tab.id
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            <span className="ml-2">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContentTabs;
