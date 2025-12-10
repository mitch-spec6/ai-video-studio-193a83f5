import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import HomePage from "@/pages/HomePage";
import CreatePage from "@/pages/CreatePage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import SettingsPage from "@/pages/SettingsPage";

const Index = () => {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onGetStarted={() => setCurrentPage("create")} />;
      case "create":
        return <CreatePage />;
      case "analytics":
        return <AnalyticsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <HomePage onGetStarted={() => setCurrentPage("create")} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
    </div>
  );
};

export default Index;
