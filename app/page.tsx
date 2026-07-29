"use client";

import React, { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { QuotesSection } from "@/components/QuotesSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ContactSection } from "@/components/ContactSection";
import { BottomNavbar } from "@/components/BottomNavbar";
import { BackgroundOrb } from "@/components/BackgroundOrb";
import { SmoothScroll } from "@/components/SmoothScroll";
import { LoadingScreen } from "@/components/LoadingScreen";
import { NetworkQualityProvider } from "@/components/NetworkQualityProvider";
import { CustomCursor } from "@/components/CustomCursor";

export default function Home() {
  const [isAppReady, setIsAppReady] = useState(false);

  return (
    <NetworkQualityProvider>
      <CustomCursor />
      <LoadingScreen onComplete={() => setIsAppReady(true)} />
      <SmoothScroll>
        <main className={`w-full min-h-screen bg-black text-white relative overflow-x-hidden transition-opacity duration-700 ${isAppReady ? "opacity-100" : "opacity-0"}`}>
          {/* Scroll-driven Live Glowing Orb Background */}
          <BackgroundOrb />

          {/* Page Sections */}
          <HeroSection />

          <QuotesSection />
          
          <ServicesSection />
          
          <ProjectsSection />

          {/* Contact Section */}
          <ContactSection />

          {/* Floating Glass Dock Navbar */}
          <BottomNavbar />
        </main>
      </SmoothScroll>
    </NetworkQualityProvider>
  );
}
