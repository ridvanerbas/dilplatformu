import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ContentTabs from "./ContentTabs";
import LanguageManager from "./LanguageManager";
import CourseManager from "./CourseManager";
import DictionaryManager from "./DictionaryManager";
import MaterialsManager from "./MaterialsManager";

const ContentManagement = ({ defaultTab = "languages" }) => {
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
