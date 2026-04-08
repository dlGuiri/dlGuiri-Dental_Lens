import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import { usePrediction } from "context/PredictionContext";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const GET_USER_BY_ID = gql`
  query GetUserById($userId: ID!) {
    getUserById(userId: $userId) {
      name
      teeth_status
      scanRecords {
        date
        result
        notes
      }
    }
  }
`;

type ScanRecord = {
  date: string;
  result: string[] | string;
  notes: string[];
};

const getGradientColors = (val: number): [string, string] => {
  if (val <= 25) return ["#22c55e", "#4ade80"]; // green
  if (val <= 50) return ["#eab308", "#facc15"]; // yellow
  if (val <= 75) return ["#f97316", "#fb923c"]; // orange
  return          ["#ef4444", "#f87171"];        // red
};

const RadialConfidence = ({ value }: { value: number }) => {
  const [from, to] = getGradientColors(value);

  const options: ApexCharts.ApexOptions = {
    chart: {
      height: 360,
      type: "radialBar",
      toolbar: { show: false },
      background: "transparent",
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        hollow: {
          margin: 0,
          size: "80%",
          background: "transparent",
          dropShadow: { enabled: true, top: 3, left: 0, blur: 6, opacity: 0.3 },
        },
        track: {
          background: "rgba(255,255,255,0.2)",
          strokeWidth: "67%",
          margin: 0,
          dropShadow: { enabled: true, top: -3, left: 0, blur: 4, opacity: 0.4 },
        },
        dataLabels: {
          show: true,
          name: {
            offsetY: 20,
            show: true,
            color: "rgba(255,255,255,0.85)",
            fontSize: "13px",
            fontWeight: 500,
          },
          value: {
            offsetY: -22,
            formatter: (val: number) => String(Math.round(val)),
            color: "#ffffff",
            fontSize: "72px",
            fontWeight: 700,
            show: true,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        shadeIntensity: 0.5,
        gradientToColors: [to],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
        colorStops: [
          { offset: 0,   color: from, opacity: 1 },
          { offset: 100, color: to,   opacity: 1 },
        ],
      },
    },
    stroke: { lineCap: "round", dashArray: 0 },
    labels: ["Confidence"],
  };

  return (
    <div className="relative flex items-center justify-center">
      <ReactApexChart
        options={options}
        series={[value]}
        type="radialBar"
        height={360}
        width={360}
      />
      <span
        className="absolute text-white/80 font-semibold pointer-events-none"
        style={{ fontSize: "22px", top: "100px", left: "calc(50% + 34px)" }}
      >
        %
      </span>
    </div>
  );
};

// ── metric prop removed — confidence now comes from context ────────────────
const HomeCard1 = ({ className = "" }: { className?: string }) => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // ✅ Single usePrediction call — gets both values at once
  const { predictionResult, confidenceScore } = usePrediction();

  const { data, loading, error, refetch } = useQuery(GET_USER_BY_ID, {
    variables: { userId },
    skip: !userId,
  });

  useEffect(() => {
    if (predictionResult && userId) refetch();
  }, [predictionResult, userId]);

  const name = session?.user?.name || "User";
  const scanRecords: ScanRecord[] = Array.isArray(data?.getUserById?.scanRecords)
    ? data.getUserById.scanRecords
    : [];

  // Use live predictionResult first; fall back to latest DB record
  let displayResultRaw =
    predictionResult &&
    predictionResult !== "" &&
    predictionResult !== "Invalid image: Please upload a clear image of an actual tongue."
      ? predictionResult
      : scanRecords[scanRecords.length - 1]?.result;

  let displayResult = Array.isArray(displayResultRaw)
    ? displayResultRaw.join(", ")
    : String(displayResultRaw ?? "");

  // ── Recommended action based on result ────────────────────────────────────
  let recommendedAction = "Please consult a doctor about your tongue condition.";
  if (displayResult?.toLowerCase() === "no disease detected") {
    displayResult = "None";
    recommendedAction = "Tongue appears healthy. Maintain current healthy lifestyle";
  }

  // ── Helper: derive health status from the result array ───────────────────
  // Checks the result field (not notes) so it works with the new note format:
  // "Model Prediction: X (Y% confidence)"
  const isHealthyRecord = (record: ScanRecord) => {
    const r = Array.isArray(record.result)
      ? record.result.join(", ")
      : String(record.result ?? "");
    return r.toLowerCase().includes("no disease") || r.toLowerCase().includes("healthy");
  };

  const [showHistory, setShowHistory] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ScanRecord | null>(null);

  const latestRecord = scanRecords[scanRecords.length - 1];
  const firstRecord  = scanRecords[0];

  // Format Confidence Score
  const parseConfidenceFromNotes = (notes: string[]): number => {
    if (!notes?.length) return 0;
    const match = notes[0]?.match(/\((\d+(\.\d+)?)%\s*confidence\)/i);
    return match ? parseFloat(match[1]) : 0;
  };
  
  // ── Confidence value drives the radial bar ────────────────────────────────
  // confidenceScore is 0–100, sourced directly from the scan result via context
  const confidenceValue = confidenceScore > 0
    ? confidenceScore
    : parseConfidenceFromNotes(latestRecord?.notes ?? []);

  const confidenceLabel =
    confidenceValue <= 25 ? "Low Risk"
    : confidenceValue <= 50 ? "Moderate Risk"
    : confidenceValue <= 75 ? "High Risk"
    : "Very High Risk";
  
  return (
    <div
      className={`bg-gradient-to-tr from-[#6a8ff7] via-[#7eb8f7] to-[#b2ede8]
        backdrop-blur-md bg-opacity-30 rounded-3xl p-6 shadow-md hover:shadow-blue-300
        transition-shadow duration-500 ${className}`}
    >
      <h2 className="text-2xl font-semibold text-white mb-1">Welcome {name}!</h2>
      <h2 className="text-lg font-semibold text-white mb-4">Tongue Assessment Overview</h2>

      {!showHistory ? (
        <div className="flex items-start justify-between gap-4">

          {/* LEFT — First scan on record */}
          <div className="w-80 h-55 bg-white/20 backdrop-blur-md rounded-3xl p-4 shadow-inner text-white flex-shrink-0">
            <p className="text-lg font-semibold mb-2">Tongue Assessment History</p>
            {firstRecord ? (
              <>
                <p className="text-sm mb-1">
                  Date:{" "}
                  {new Date(Number(firstRecord.date)).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </p>
                {/* ✅ Checks result field, not notes */}
                <p className="text-sm mb-1">
                  Result:{" "}
                  {isHealthyRecord(firstRecord) ? "Healthy tongue" : "Condition detected"}
                </p>
                <p className="text-sm mb-1">Conditions Present:</p>
                <p className="text-sm mb-3 capitalize">
                  {Array.isArray(firstRecord.result)
                    ? firstRecord.result.join(", ")
                    : firstRecord.result}
                </p>
                <div className="flex justify-center">
                  <button
                    className="px-4 py-2 bg-white/30 text-white rounded-3xl hover:bg-[#608cc4]/40 transition-colors duration-200"
                    onClick={() => setShowHistory(true)}
                  >
                    See History
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm">No scans found.</p>
            )}
          </div>

          {/* CENTER — Radial Confidence Chart + Scan Button */}
          <div className="flex flex-col items-center flex-shrink-0 self-end">
            <div className="flex flex-col items-center px-6 pt-4 pb-2">
              <p className="text-white font-semibold text-base mb-1">Tongue Scan Confidence</p>
              <RadialConfidence value={confidenceValue} />
              <p className="text-white/80 text-sm -mt-2 mb-3">{confidenceLabel}</p>
            </div>
            <Link href="/scan">
              <button className="mt-5 px-10 py-4 bg-[#a8edd8] text-[#1a6b52] font-semibold rounded-full shadow-md hover:bg-[#7edfc0] transition-colors duration-200 flex items-center gap-2">
                Proceed to Scan
                <span className="text-lg">→</span>
              </button>
            </Link>
          </div>

          {/* RIGHT — Latest scan result */}
          <div className="w-80 h-55 bg-white/20 backdrop-blur-md rounded-3xl p-4 shadow-inner text-white flex-shrink-0">
            <p className="text-lg font-semibold mb-2">Latest Result:</p>
            {latestRecord ? (
              <>
                <p className="text-sm mb-1">
                  Date:{" "}
                  {new Date(Number(latestRecord.date)).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric",
                  })}
                </p>
                {/* ✅ Checks result field, not notes */}
                <p className="text-sm mb-1">
                  Result:{" "}
                  {isHealthyRecord(latestRecord)
                    ? "Healthy Assessment"
                    : `Signs of ${Array.isArray(latestRecord.result)
                        ? latestRecord.result.join(", ")
                        : latestRecord.result} detected`}
                </p>
                <p className="text-sm mb-1">Percentage of Risk:</p>
                <p className="text-sm mb-4">
                  {(() => {
                    const fromContext = confidenceScore > 0 ? confidenceScore : null;
                    const fromNotes = parseConfidenceFromNotes(latestRecord.notes ?? []);
                    const val = fromContext ?? fromNotes;
                    return val > 0 ? `${val.toFixed(1)}%` : "N/A";
                  })()}
                </p>

                <p className="text-sm font-medium mb-1">Actions to be taken:</p>
                <p className="text-sm">{recommendedAction}</p>
              </>
            ) : (
              <p className="text-sm">No scans found.</p>
            )}
          </div>

        </div>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-white mb-4">Scan History</h2>
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-4 shadow-inner text-white mb-4 max-h-[308px] min-h-[308px] relative">
            <p className="text-md font-medium mb-2">Past Scan Results:</p>
            <div className="max-h-64 overflow-y-auto pr-2">
              <ul className="text-md text-white/80 list-disc list-inside ml-4">
                {scanRecords.map((record, i) => (
                  <li
                    key={i}
                    className="cursor-pointer hover:text-white mb-4"
                    onClick={() => setSelectedRecord(record)}
                  >
                    {new Date(Number(record.date)).toLocaleString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </li>
                ))}
              </ul>
            </div>

            {selectedRecord && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
                onClick={() => setSelectedRecord(null)}
              >
                <div
                  className="bg-gradient-to-br from-[#4fa1f2] via-[#74b0f0] to-[#66acf4] backdrop-blur-md rounded-3xl p-6 shadow-lg text-white w-11/12 max-w-md relative"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    className="absolute top-2 right-4 text-white text-xl hover:text-red-300"
                    onClick={() => setSelectedRecord(null)}
                  >
                    &times;
                  </button>
                  <p className="text-base font-semibold mb-2">Scan Details</p>
                  <p className="text-sm mb-1">
                    Date:{" "}
                    {new Date(Number(selectedRecord.date)).toLocaleDateString("en-US", {
                      year: "numeric", month: "long", day: "numeric",
                    })}
                  </p>
                  {/* ✅ Checks result field, not notes */}
                  <p className="text-sm mb-1">
                    Result:{" "}
                    {isHealthyRecord(selectedRecord) ? "Healthy tongue" : "Condition detected"}
                  </p>
                  <p className="text-sm mb-1">Conditions Present:</p>
                  <p className="text-sm mb-1 capitalize">
                    {Array.isArray(selectedRecord.result)
                      ? selectedRecord.result.join(", ")
                      : selectedRecord.result}
                  </p>
                </div>
              </div>
            )}

            <div className="absolute bottom-4 w-full flex justify-center left-0">
              <button
                className="px-4 py-2 bg-white/30 text-white rounded-3xl hover:bg-[#608cc4]/40 transition-colors duration-200"
                onClick={() => setShowHistory(false)}
              >
                Back
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomeCard1;