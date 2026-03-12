import { createContext, useContext, useState, ReactNode } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type PredictionContextType = {
  predictionResult: string | null;
  setPredictionResult: (result: string | null) => void;
  confidenceScore: number;           // 0–100 numeric value for the radial bar
  setConfidenceScore: (score: number) => void;
};

// ── Context ────────────────────────────────────────────────────────────────
const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

// ── Provider ───────────────────────────────────────────────────────────────
export const PredictionProvider = ({ children }: { children: ReactNode }) => {
  const [predictionResult, setPredictionResult] = useState<string | null>(null);
  const [confidenceScore, setConfidenceScore] = useState<number>(0); // ← lives INSIDE the component

  return (
    <PredictionContext.Provider
      value={{ predictionResult, setPredictionResult, confidenceScore, setConfidenceScore }}
    >
      {children}
    </PredictionContext.Provider>
  );
};

// ── Hook ───────────────────────────────────────────────────────────────────
export const usePrediction = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error("usePrediction must be used within a PredictionProvider");
  }
  return context;
};