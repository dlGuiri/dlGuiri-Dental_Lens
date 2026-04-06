<<<<<<< HEAD
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
=======
// context/PredictionContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

type PredictionContextType = {
  predictionResult: string | null;
  setPredictionResult: (result: string | null) => void;
};

const PredictionContext = createContext<PredictionContextType | undefined>(undefined);

export const PredictionProvider = ({ children }: { children: ReactNode }) => {
  const [predictionResult, setPredictionResult] = useState<string | null>(null);

  return (
    <PredictionContext.Provider value={{ predictionResult, setPredictionResult }}>
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
      {children}
    </PredictionContext.Provider>
  );
};

<<<<<<< HEAD
// ── Hook ───────────────────────────────────────────────────────────────────
=======
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
export const usePrediction = () => {
  const context = useContext(PredictionContext);
  if (!context) {
    throw new Error("usePrediction must be used within a PredictionProvider");
  }
  return context;
<<<<<<< HEAD
};
=======
};
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
