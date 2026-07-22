"use client";

import { createContext, useContext, useState } from "react";
import type {
  AiEquipmentRecommendation,
  DispatchAnalysisResult,
  DispatchLocation,
} from "./types";

interface DispatchAnalysisState {
  result: DispatchAnalysisResult;
  location: DispatchLocation;
  equipmentError: boolean;
}

const DispatchAnalysisContext = createContext<{
  analysis: DispatchAnalysisState | null;
  setAnalysis: (analysis: DispatchAnalysisState) => void;
  updateEquipment: (equipment: AiEquipmentRecommendation[]) => void;
} | null>(null);

export function DispatchAnalysisProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [analysis, setAnalysis] = useState<DispatchAnalysisState | null>(null);

  const updateEquipment = (equipment: AiEquipmentRecommendation[]) => {
    setAnalysis((current) =>
      current
        ? {
            ...current,
            equipmentError: false,
            result: { ...current.result, recommendedEquipment: equipment },
          }
        : null,
    );
  };

  return (
    <DispatchAnalysisContext.Provider
      value={{ analysis, setAnalysis, updateEquipment }}
    >
      {children}
    </DispatchAnalysisContext.Provider>
  );
}

export function useDispatchAnalysis() {
  const context = useContext(DispatchAnalysisContext);
  if (!context) throw new Error("DispatchAnalysisProvider is required");
  return context;
}
