"use client";
import { usePrediction } from "context/PredictionContext";
import { gql, useMutation } from "@apollo/client";
import React, { useState } from 'react';

const CREATE_SCAN_RECORD = gql`
  mutation CreateScanRecord($user: ID!, $result: String!) {
    createScanRecord(user: $user, result: $result) {
      _id
      result
    }
  }
`;

const ScanPage = () => {
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { predictionResult, setPredictionResult } = usePrediction();
  const [loading, setLoading] = useState(false);
  const [createScanRecord] = useMutation(CREATE_SCAN_RECORD);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setSelectedFile(file); // store the actual File object
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Prediction failed");
      }

      const data = await response.json();
      setPredictionResult(data.prediction);

      await createScanRecord({
        variables: {
          user: "683135d97a2c370d25d861e0", // Replace with dynamic user ID if needed
          result: data.prediction,
        },
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      setPredictionResult("Error: could not get prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="h-[370px] bg-gradient-to-br from-[#4fa1f2] via-[#74b0f0] to-[#d3eaff] 
        backdrop-blur-md bg-opacity-30 rounded-3xl p-6 shadow-md hover:shadow-blue-300 
        transition-shadow duration-500"
      >
        <h2 className="text-2xl font-bold text-white">Ready to check your Teeth's Health?</h2>
        <p className="text-white">Scan Results:</p>
        {predictionResult && (
          <p className="text-4xl text-white font-semibold mt-2">
            {predictionResult}
          </p>
        )}
      </div>

      <div className="h-[370px] bg-gradient-to-br from-white via-[#f0f0f0] to-[#e6e6e6]
        backdrop-blur-md bg-opacity-50 rounded-3xl p-6 shadow-md hover:shadow-gray-300
        transition-shadow duration-500"
      >
        <h2 className="text-2xl font-bold text-[#74b0f0] mb-4">Upload Images Here:</h2>

        <div>
          <label 
          htmlFor="fileUpload" 
          className="cursor-pointer px-4 py-2 bg-[#74b0f0] text-white rounded-3xl hover:bg-[#5a9bd8] transition inline-block"
        >Choose Image</label>
        <input 
          id="fileUpload"
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          className="hidden"
        />
        </div>
        

        {image && (
          <div>
            <p className="text-gray-600 mb-2">Image Preview:</p>
            <img 
              src={image} 
              alt="Uploaded Preview" 
              className="w-60 h-auto rounded-xl shadow-md"
            />
          </div>
        )}

        <button 
          onClick={handleSubmit}
          disabled={loading || !selectedFile}
          className="mt-4 px-4 py-2 bg-[#74b0f0] text-white rounded-3xl hover:bg-[#5a9bd8] transition"
        >
          {loading ? "Analyzing..." : "Analyze Image"}
        </button>
      </div>
    </>
  );
};

export default ScanPage;
