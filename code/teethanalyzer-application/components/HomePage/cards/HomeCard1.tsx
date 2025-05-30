import { useState } from "react";
import Image from "next/image";
import logo from "/public/assets/Tooth Image V3.png";
import arrow from "/public/assets/scan arrow V2.png";
import { gql, useQuery } from "@apollo/client";
import { usePrediction } from "context/PredictionContext";

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

const HomeCard1 = ({ className = "", metric = 100, userId }: { className?: string; metric?: number; userId: string }) => {
  const { predictionResult } = usePrediction();
  const { data, loading, error } = useQuery(GET_USER_BY_ID, {
    variables: { userId },
  });

  const name = data?.getUserById?.name || "User";
  const teethStatus = data?.getUserById?.teeth_status || "No Teeth Status Yet";
  const scanRecords = data?.getUserById?.scanRecords || ["N.D", "No Results Yet", "No Notes Yet"];

  const displayResult = predictionResult ?? scanRecords[scanRecords.length - 1]?.result;
  const [showHistory, setShowHistory] = useState(false);

  // Filter classes to change the color of the tooth image based on the metric
  let filterClass = "";

  if (metric < 50) {
    // Severe discoloration: brown to black
    filterClass = "filter sepia brightness-[30%] contrast-125 hue-rotate-30";

  } else if (metric < 80) {
    // Moderate discoloration: yellow-brown
    filterClass = "filter sepia brightness-75 hue-rotate-15";
  } else if (metric < 90) {
    // Mild discoloration: yellow
    filterClass = "filter sepia brightness-90";
  } else {
    // Healthy: white
    filterClass = "";
  }

  return (
    <div className={`bg-gradient-to-br from-[#4fa1f2] via-[#74b0f0] to-[#d3eaff] 
      backdrop-blur-md bg-opacity-30 rounded-3xl p-6 shadow-md hover:shadow-blue-300 
      transition-shadow duration-500 ${className}`}
      >
      {!showHistory ? (
        <>
          <h2 className="text-2xl font-semibold text-white mb-2">Welcome {name}!</h2>
          <h2 className="text-lg font-semibold text-white mb-2">Teeth Health Overview</h2>

          {/* Step 3: Wrap Image in filtered div */}
          <div className="flex justify-center mb-4 -mt-8">
            <div className={`relative w-[420px]`}>
              <div className={filterClass}>
                <Image src={logo} alt="Tooth Logo" width={220} height={220} className="mx-auto"/>
              </div>

              {/* Arrow */}
              <div className="absolute top-11 left-[260px]">
                <Image src={arrow} alt="Scan Arrow" width={140} height={140} />
              </div>

              {/* New: Semi-transparent card at the arrow tip */}
              <div className="absolute top-[40px] left-[389px] w-80 h-55 bg-white/20 backdrop-blur-md rounded-3xl p-4 shadow-inner text-white">
                <p className="text-sm font-medium mb-2">Latest Teeth Status:</p>
                {scanRecords.length > 0 ? (
                  <>
                    <p className="text-sm mb-1">Date: {new Date(Number(scanRecords[scanRecords.length - 1]?.date)).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    {/* <p className="text-sm mb-1">Result: {scanRecords[0].result}</p> */}
                    <p className="text-sm mb-1">Result: {displayResult}</p>
                    <p className="text-sm mb-1">Additional Details:</p>
                    <p className="text-sm mb-5">{scanRecords[0].notes}</p>
                    <p className="text-sm font-medium mb-2">Actions to be taken:</p>
                    <p className="text-sm mb-1">Go to a dentist</p>
                  </>
                ) : (
                  <p>No scans found.</p>
                )}
              </div>
            </div>
          </div>

          
          <div className="w-80 h-55 bg-white/20 backdrop-blur-md rounded-3xl p-4 shadow-inner text-white mb-4 -mt-63">
            <p className="text-base font-medium mb-2">Teeth Scan History</p>
            
            {scanRecords.length > 0 ? (
              <>
                <p className="text-sm mb-1">Date: {new Date(Number(scanRecords[0]?.date)).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm mb-1">Result: {scanRecords[0].result}</p>
                <p className="text-sm mb-1">Additional Details:</p>
                <p className="text-sm mb-1">{scanRecords[0].notes}</p>
              </>
            ) : (
              <p>No scans found.</p>
            )}

            <div className="flex flex-col items-center">
              <button 
              className="mt-5 px-4 py-2 bg-white/30 text-white rounded-3xl hover:bg-[#608cc4]/40 transition-colors duration-200"
              onClick={() => setShowHistory(true)}
              >
                See History
              </button>
            </div> 
          </div>
        </>
      ) : (
        // HISTORY VIEW
        <>
          <h2 className="text-2xl font-semibold text-white mb-4">
            Scan History
          </h2>
          <div className="bg-white/20 backdrop-blur-md rounded-3xl p-4 shadow-inner text-white mb-4">
            <p className="text-sm font-medium mb-2">Past Scan Results:</p>
            <ul className="text-xs text-white/80 list-disc list-inside">
              <li>2025-05-01: Excellent</li>
              <li>2025-04-15: Moderate Plaque</li>
              <li>2025-04-01: Mild Discolorationn</li>
            </ul>
          </div>
          <div className="flex justify-center">
            <button
              className="mt-4 px-4 py-2 bg-white/30 text-white rounded-3xl hover:bg-[#608cc4]/40 transition-colors duration-200"
              onClick={() => setShowHistory(false)}
            >
              Back
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HomeCard1;
