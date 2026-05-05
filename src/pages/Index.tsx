import { useState } from "react";
import Header from "@/components/Header";
import SymptomInput from "@/components/SymptomInput";
import PredictButton from "@/components/PredictButton";
import ResultSection from "@/components/ResultSection";
import doctorImg from "@/assets/doctor.png";

const API_BASE = "http://localhost:8000";

interface PredictionResult {
  predicted_disease?: string;
  description?: string;
  medications?: unknown;
  diet?: unknown;
  workout?: unknown;
  precautions?: unknown;
}

const Index = () => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: symptoms.join(",") }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 pb-16">
      <Header />

      {/* Doctor Image + Input Section */}
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
        {/* Doctor Image - Above the input */}
        <div className="flex-shrink-0">
          <img
            src={doctorImg}
            alt="Friendly doctor illustration"
            width={280}
            height={373}
            className="drop-shadow-lg"
          />
        </div>

        {/* Symptom Input Section */}
        <div className="w-full max-w-2xl">
          <SymptomInput selected={symptoms} onChange={setSymptoms} />

          <PredictButton
            disabled={symptoms.length === 0}
            loading={loading}
            onClick={handlePredict}
          />
        </div>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto mt-8 rounded-xl bg-destructive/10 border border-destructive/30 p-5 text-center text-destructive font-medium fade-in">
          {error}
        </div>
      )}

      {result && <ResultSection result={result} />}
    </div>
  );
};

export default Index;
