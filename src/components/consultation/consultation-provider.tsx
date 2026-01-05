"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import ConsultationPanel from "./consultation-panel";

interface ConsultationContextType {
  isOpen: boolean;
  openConsultation: () => void;
  closeConsultation: () => void;
}

const ConsultationContext = createContext<ConsultationContextType>({
  isOpen: false,
  openConsultation: () => {},
  closeConsultation: () => {},
});

export const useConsultation = () => useContext(ConsultationContext);

export default function ConsultationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const openConsultation = () => {
    // Open form immediately
    setIsOpen(true);
  };

  const closeConsultation = () => {
    setIsOpen(false);
    // Scroll restoration is handled in ConsultationPanel
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <ConsultationContext.Provider
      value={{ isOpen, openConsultation, closeConsultation }}
    >
      {/* Main Content - shifts down when form is open using margin-top */}
      <div
        data-consultation-content
        style={{
          willChange: "margin-top",
        }}
      >
        {children}
      </div>
      <ConsultationPanel />
    </ConsultationContext.Provider>
  );
}
