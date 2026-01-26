"use client";

import { useState } from "react";
import MainContent from "@/components/MainContent";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";
import ScrollSmoothWrapper from "@/components/ScrollSmoothWrapper";
import Footer from "@/components/Footer";

export default function ClientWrapper() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("fool");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <>
      {/* Navbar - Outside smooth scroll so it stays fixed properly */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      {/* ScrollSmoother Wrapper - Wraps scrollable content */}
      <ScrollSmoothWrapper>
        <MainContent activeTab={activeTab} />
        <Footer />
      </ScrollSmoothWrapper>
    </>
  );
}
