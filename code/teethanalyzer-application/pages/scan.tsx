"use client";
import { useSession } from "next-auth/react";
import { usePrediction } from "context/PredictionContext";
<<<<<<< HEAD
import { gql, useMutation } from "@apollo/client";
import React, { useState, useRef, useEffect } from 'react';
=======
import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState, useRef, useEffect } from 'react';
import { CldUploadButton } from 'next-cloudinary';
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
import Swal from 'sweetalert2';
import LoadingTeeth from "/public/assets/LoadingTeeth.gif";
import { API_URL } from '@/config';

<<<<<<< HEAD
// ─── LOCAL TESTING FLAG ───────────────────────────────────────────────────────
// Set to TRUE when running locally without Cloudinary / GraphQL backend.
// Set back to FALSE before deploying.
const LOCAL_TEST_MODE = true;
// ─────────────────────────────────────────────────────────────────────────────

const CREATE_SCAN_RECORD = gql`
  mutation CreateScanRecord(
    $user: ID!,
    $result: [String!]!,
    $notes: [String!],
=======
const CREATE_SCAN_RECORD = gql`
  mutation CreateScanRecord(
    $user: ID!, 
    $result: [String!]!, 
    $notes: [String!], 
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
    $imageUrls: [String!],
    $limeVisualizationUrl: String,
  ) {
    createScanRecord(
<<<<<<< HEAD
      user: $user,
      result: $result,
      notes: $notes,
=======
      user: $user, 
      result: $result, 
      notes: $notes, 
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
      imageUrls: $imageUrls,
      limeVisualizationUrl: $limeVisualizationUrl,
    ) {
      _id
      result
      notes
      imageUrls
      limeVisualizationUrl
    }
  }
`;

const ScanPage = () => {
  const [images, setImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const MAX_IMAGES = 5;
<<<<<<< HEAD

  // ✅ Single usePrediction call — pulls all three values needed
  const { predictionResult, setPredictionResult, setConfidenceScore } = usePrediction();

  const [loading, setLoading] = useState(false);
  const [createScanRecord] = useMutation(CREATE_SCAN_RECORD);

  // These three are kept for the result boxes UI, but Gemini streaming is
  // not wired up yet — boxes will be empty until you add those calls back.
  const [severityResponses, setSeverityResponses] = useState("");
  const [causeResponses, setCauseResponses] = useState("");
  const [symptomResponses, setSymptomResponses] = useState("");

=======
  const { predictionResult, setPredictionResult } = usePrediction();
  const [loading, setLoading] = useState(false);
  const [createScanRecord] = useMutation(CREATE_SCAN_RECORD);
  const [severityResponses, setSeverityResponses] = useState("");
  const [causeResponses, setCauseResponses] = useState("");
  const [symptomResponses, setSymptomResponses] = useState("");
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
  const [confidenceLevel, setConfidenceLevel] = useState<string>("");
  const [isValid, setIsValid] = useState(true);
  const [availableDevices, setAvailableDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  const [limeExplanation, setLimeExplanation] = useState<string | null>(null);
  const [showLimeExplanation, setShowLimeExplanation] = useState(false);
  const [generatingLime, setGeneratingLime] = useState(false);
<<<<<<< HEAD

  // ── Unused state removed: totalPositive, totalNegative, netEvidence ────────

  const isMediaError = (error: unknown): error is DOMException =>
    error instanceof DOMException;

  const hasErrorName = (error: unknown): error is { name: string; message: string } =>
    typeof error === 'object' && error !== null && 'name' in error && 'message' in error;

  // Camera state
=======
  const [totalPositive, setTotalPositive] = useState<number | null>(null);
  const [totalNegative, setTotalNegative] = useState<number | null>(null);
  const [netEvidence, setNetEvidence] = useState<number | null>(null);


  const isMediaError = (error: unknown): error is DOMException => {
    return error instanceof DOMException;
  };

  const hasErrorName = (error: unknown): error is { name: string; message: string } => {
    return typeof error === 'object' && error !== null && 'name' in error && 'message' in error;
  };
  
  useEffect(() => {
    setPredictionResult(""); // Clear the prediction result when ScanPage mounts
    closeCamera();
  }, []);

  // Camera-related state
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

<<<<<<< HEAD
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    setPredictionResult("");
    closeCamera();
  }, []);

  // ── Image upload ──────────────────────────────────────────────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';

=======
  const { data: session, status } = useSession();
  console.log("This is the session: ", session);
  console.log("This is the user id:", session?.user?.id);
  const userId = session?.user?.id;

  // Replace the handleImageUpload function:
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Reset the input value to allow selecting the same files again
    e.target.value = '';
    
    // Check if adding these files would exceed the limit
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
    if (selectedFiles.length + files.length > MAX_IMAGES) {
      Swal.fire({
        icon: 'warning',
        title: 'Upload Limit Exceeded',
        text: `You can only upload a maximum of ${MAX_IMAGES} images.`,
<<<<<<< HEAD
        confirmButtonColor: '#74b0f0',
      });
      return;
    }

    files.forEach(file => {
      setImages(prev => [...prev, URL.createObjectURL(file)]);
=======
        confirmButtonColor: '#74b0f0'
      });
      return;
    }
    
    files.forEach(file => {
      const imageUrl = URL.createObjectURL(file);
      setImages(prev => [...prev, imageUrl]);
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
      setSelectedFiles(prev => [...prev, file]);
    });
  };

<<<<<<< HEAD
  // ── Camera helpers ────────────────────────────────────────────────────────
  const checkCameraPermissions = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia)
        throw new Error('Camera API not supported in this browser');
      const testStream = await navigator.mediaDevices.getUserMedia({ video: true });
      testStream.getTracks().forEach(t => t.stop());
      return true;
    } catch {
=======
  // Camera functions
  const checkCameraPermissions = async () => {
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }

      // Try to get permission first with basic constraints
      const testStream = await navigator.mediaDevices.getUserMedia({ video: true });
      testStream.getTracks().forEach(track => track.stop()); // Stop immediately
      return true;
    } catch (error) {
      console.error('Permission check failed:', error);
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
      return false;
    }
  };

  const getAvailableDevices = async () => {
<<<<<<< HEAD
    if (!await checkCameraPermissions()) throw new Error('Camera permission denied');

    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(d => d.kind === 'videoinput');
    setAvailableDevices(videoDevices);

    const uvcDevice = videoDevices.find(d =>
      ['usb', 'uvc', 'camera 2.0', 'external'].some(kw =>
        d.label.toLowerCase().includes(kw)
      )
    );

    if (uvcDevice) setSelectedDeviceId(uvcDevice.deviceId);
    else if (videoDevices.length > 0) setSelectedDeviceId(videoDevices[0].deviceId);

    return videoDevices;
  };

  const openCamera = async () => {
    let devices;
    try {
      devices = await getAvailableDevices();
    } catch {
      alert('Unable to access camera devices. Please check your browser permissions.');
      return;
    }

    if (devices.length === 0) {
      alert('No camera devices found. Please make sure your camera is connected.');
      return;
    }

    if (!selectedDeviceId && devices.length > 1) {
      setShowDeviceSelector(true);
      return;
    }

    const deviceToUse = selectedDeviceId || devices[0].deviceId;

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceToUse }, width: { ideal: 640 }, height: { ideal: 480 } },
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      setShowDeviceSelector(false);
      setTimeout(() => {
        if (videoRef.current) { videoRef.current.srcObject = mediaStream; videoRef.current.play(); }
      }, 100);
    } catch (error) {
      let msg = 'Unable to access camera. ';
      if (isMediaError(error)) {
        if (error.name === 'NotAllowedError')   msg += 'Permission denied. Check browser settings.';
        else if (error.name === 'NotFoundError') msg += 'No camera found.';
        else if (error.name === 'NotReadableError') msg += 'Camera in use by another app.';
        else if (error.name === 'OverconstrainedError') {
          msg += 'Trying basic settings...';
          try {
            const basic = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(basic); setIsCameraOpen(true);
            setTimeout(() => {
              if (videoRef.current) { videoRef.current.srcObject = basic; videoRef.current.play(); }
            }, 100);
            return;
          } catch { msg += ' Fallback also failed.'; }
        } else msg += `${error.name}: ${error.message}`;
      } else if (hasErrorName(error)) msg += `${error.name}: ${error.message}`;
      else msg += String(error);
      alert(msg);
    }
  };

  const selectAndOpenCamera = async (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    setShowDeviceSelector(false);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId }, width: { ideal: 640 }, height: { ideal: 480 } },
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) { videoRef.current.srcObject = mediaStream; videoRef.current.play(); }
      }, 100);
    } catch (error) {
      let msg = 'Unable to access selected camera. ';
      if (isMediaError(error)) {
        if (error.name === 'NotReadableError') msg += 'Camera may be in use.';
        else if (error.name === 'NotAllowedError') msg += 'Permission denied.';
        else if (error.name === 'NotFoundError') msg += 'Camera not found.';
        else msg += `${error.name}: ${error.message}`;
      } else msg += 'Try a different camera.';
      alert(msg);
      setShowDeviceSelector(true);
=======
    try {
      // First, request basic camera permission
      const hasPermission = await checkCameraPermissions();
      if (!hasPermission) {
        throw new Error('Camera permission denied');
      }

      // Now enumerate devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      console.log('Available video devices:', videoDevices.map(d => ({ 
        label: d.label, 
        deviceId: d.deviceId.substring(0, 20) + '...' 
      })));
      
      setAvailableDevices(videoDevices);
      
      // Auto-select UVC camera if found
      const uvcDevice = videoDevices.find(device => 
        device.label.toLowerCase().includes('usb') || 
        device.label.toLowerCase().includes('uvc') ||
        device.label.toLowerCase().includes('camera 2.0') ||
        device.label.toLowerCase().includes('external')
      );
      
      if (uvcDevice) {
        console.log('UVC camera found:', uvcDevice.label);
        setSelectedDeviceId(uvcDevice.deviceId);
      } else if (videoDevices.length > 0) {
        console.log('Using first available camera:', videoDevices[0].label);
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
      
      return videoDevices;
    } catch (error) {
      console.error('Error getting camera devices:', error);
      
      // Handle the error with proper typing
      if (hasErrorName(error)) {
        throw new Error(`Failed to get camera devices: ${error.message}`);
      } else {
        throw new Error(`Failed to get camera devices: ${String(error)}`);
      }
    }
  };

  const openCamera = async () => {
    try {
      console.log('Opening camera...');
      
      // Get available devices first
      let devices;
      try {
        devices = await getAvailableDevices();
      } catch (error) {
        alert('Unable to access camera devices. Please check your browser permissions.');
        return;
      }
      
      // If no devices found
      if (devices.length === 0) {
        alert('No camera devices found. Please make sure your camera is connected.');
        return;
      }
      
      // If no device selected and multiple devices available, show selector
      if (!selectedDeviceId && devices.length > 1) {
        setShowDeviceSelector(true);
        return;
      }
      
      // Use first device if none selected
      const deviceToUse = selectedDeviceId || devices[0].deviceId;
      console.log('Using camera device:', deviceToUse);
      
      const constraints = {
        video: {
          deviceId: deviceToUse ? { exact: deviceToUse } : undefined,
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      };
      
      console.log('Camera constraints:', constraints);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera stream obtained successfully');
      
      setStream(mediaStream);
      setIsCameraOpen(true);
      setShowDeviceSelector(false);
      
      // Wait a bit for the video element to be rendered
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      }, 100);
      
    } catch (error) {
      console.error('Error opening camera:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Unable to access camera. ';
      
      // Use type guard to safely access error properties
      if (isMediaError(error)) {
        if (error.name === 'NotAllowedError') {
          errorMessage += 'Camera permission was denied. Please allow camera access in your browser settings.';
        } else if (error.name === 'NotFoundError') {
          errorMessage += 'No camera device found. Please make sure your camera is connected.';
        } else if (error.name === 'NotReadableError') {
          errorMessage += 'Camera is already in use by another application.';
        } else if (error.name === 'OverconstrainedError') {
          errorMessage += 'Camera does not support the requested settings. Trying with basic settings...';
          
          // Try with basic constraints as fallback
          try {
            const basicStream = await navigator.mediaDevices.getUserMedia({ video: true });
            setStream(basicStream);
            setIsCameraOpen(true);
            
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current.srcObject = basicStream;
                videoRef.current.play();
              }
            }, 100);
            return;
          } catch (fallbackError) {
            errorMessage += ' Fallback also failed.';
          }
        } else {
          errorMessage += `Error: ${error.name} - ${error.message}`;
        }
      } else if (hasErrorName(error)) {
        // Handle other error types that have name and message
        errorMessage += `Error: ${error.name} - ${error.message}`;
      } else {
        // Handle completely unknown errors
        errorMessage += `Unknown error: ${String(error)}`;
      }
      
      alert(errorMessage);
    }
  };


  // Add this function to handle device selection
  const selectAndOpenCamera = async (deviceId: string) => {
    console.log('Selecting camera device:', deviceId);
    setSelectedDeviceId(deviceId);
    setShowDeviceSelector(false);
    
    try {
      const constraints = {
        video: {
          deviceId: { exact: deviceId },
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      };
      
      console.log('Selected camera constraints:', constraints);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Selected camera stream obtained successfully');
      
      setStream(mediaStream);
      setIsCameraOpen(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }
      }, 100);
      
    } catch (error) {
      console.error('Error opening selected camera:', error);
      
      let errorMessage = 'Unable to access the selected camera. ';
      
      if (isMediaError(error)) {
        if (error.name === 'NotReadableError') {
          errorMessage += 'The camera might be in use by another application.';
        } else if (error.name === 'NotAllowedError') {
          errorMessage += 'Camera permission was denied.';
        } else if (error.name === 'NotFoundError') {
          errorMessage += 'The selected camera was not found.';
        } else {
          errorMessage += `Error: ${error.name} - ${error.message}`;
        }
      } else {
        errorMessage += 'Please try selecting a different camera.';
      }
      
      alert(errorMessage);
      setShowDeviceSelector(true); // Show selector again
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
    }
  };

  const closeCamera = () => {
<<<<<<< HEAD
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (selectedFiles.length >= MAX_IMAGES) {
      Swal.fire({ icon: 'warning', title: 'Maximum Images Reached', text: `Max ${MAX_IMAGES} images.`, confirmButtonColor: '#74b0f0' });
      return;
    }
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current, canvas = canvasRef.current;
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      if (!blob) return;
      const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
      setImages(prev => [...prev, URL.createObjectURL(file)]);
      setSelectedFiles(prev => [...prev, file]);
    }, 'image/jpeg', 0.9);
  };

  // ── Cloudinary helpers (stubbed in LOCAL_TEST_MODE) ───────────────────────
  const base64ToFile = (base64String: string, filename: string): File => {
    const base64Data = base64String.includes('base64,')
      ? base64String.split('base64,')[1] : base64String;
    const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    return new File([new Blob([bytes], { type: 'image/png' })], filename, { type: 'image/png' });
  };

  const uploadToCloudinary = async (files: File[]): Promise<string[]> => {
    // LOCAL_TEST_MODE: skip real upload, return placeholder URLs
    if (LOCAL_TEST_MODE) {
      console.log("[LOCAL] Skipping Cloudinary upload, using placeholder URLs.");
      return files.map((_, i) => `local-test-placeholder-${i}`);
    }
    return Promise.all(files.map(uploadSingleFile));
  };

  const uploadSingleFile = async (file: File): Promise<string> => {
    // LOCAL_TEST_MODE: skip real upload
    if (LOCAL_TEST_MODE) {
      console.log("[LOCAL] Skipping single Cloudinary upload.");
      return `local-test-placeholder-single`;
    }
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', 'patient_teeth');
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: fd }
    );
    if (!res.ok) throw new Error('Cloudinary upload failed');
    return (await res.json()).secure_url;
  };

  // ── Gemini streaming (not wired to handleSubmit yet) ─────────────────────
  // Keep this function for when you're ready to add it back.
  const streamGeminiResponse = async (
    prompt: string,
    imageBase64?: string,
    onChunk?: (chunk: string) => void,
    delayMs = 10,
    charsPerStep = 3
=======
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  // Update the capturePhoto function:
  const capturePhoto = () => {
    if (selectedFiles.length >= MAX_IMAGES) {
      Swal.fire({
        icon: 'warning',
        title: 'Maximum Images Reached',
        text: `Maximum of ${MAX_IMAGES} images allowed.`,
        confirmButtonColor: '#74b0f0'
      });
      return;
    }
    
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          const imageUrl = URL.createObjectURL(file);
          
          setImages(prev => [...prev, imageUrl]);
          setSelectedFiles(prev => [...prev, file]);
        }
      }, 'image/jpeg', 0.9);
    }
  };

  // Function to convert base64 to File
  const base64ToFile = (base64String: string, filename: string): File => {
    // Remove data URL prefix if present
    const base64Data = base64String.includes('base64,') 
      ? base64String.split('base64,')[1] 
      : base64String;
    
    // Convert base64 to binary
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Create blob and convert to File
    const blob = new Blob([bytes], { type: 'image/png' });
    return new File([blob], filename, { type: 'image/png' });
  };

  // Updated streamGeminiResponse function with callback for real-time streaming
  const streamGeminiResponse = async (
    prompt: string, 
    imageBase64?: string,
    onChunk?: (chunk: string) => void,
    delayMs: number = 10,
    charsPerStep: number = 3
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
  ): Promise<string> => {
    const body = imageBase64
      ? JSON.stringify({ prompt, image: imageBase64 })
      : JSON.stringify({ prompt });
<<<<<<< HEAD
    const response = await fetch(`${API_URL}/chat-stream`, { method: "POST", headers: { "Content-Type": "application/json" }, body });
    const reader = response.body?.getReader();
    const decoder = new TextDecoder("utf-8");
    let result = "";
=======

    const response = await fetch(`${API_URL}/chat-stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder("utf-8");
    let result = "";

>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
    if (reader) {
      let done = false;
      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
<<<<<<< HEAD
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          result += chunk;
          if (onChunk) {
            for (let i = 0; i < chunk.length; i += charsPerStep) {
              onChunk(chunk.slice(i, i + charsPerStep));
              await new Promise(r => setTimeout(r, delayMs));
=======

        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          result += chunk;

          if (onChunk) {
            for (let i = 0; i < chunk.length; i += charsPerStep) {
              const chars = chunk.slice(i, i + charsPerStep);
              onChunk(chars);
              await new Promise((resolve) => setTimeout(resolve, delayMs));
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
            }
          }
        }
      }
    }
<<<<<<< HEAD
    return result;
  };

  // ── Main submit ───────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return;

    // Reset all display state
=======

    return result;
  };

  const generateLimeExplanation = async () => {
    if (selectedFiles.length === 0) {
      alert('Please upload an image first');
      return;
    }

    setGeneratingLime(true);
    setLimeExplanation(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFiles[0]); // Use first image

      const response = await fetch(`${API_URL}/predict-with-lime?num_samples=100`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('LIME explanation failed');
      }

      const data = await response.json();
      setLimeExplanation(data.explanation_image);
      setShowLimeExplanation(true);
      
    } catch (error) {
      console.error('Error generating LIME explanation:', error);
      alert('Failed to generate LIME explanation. Please try again.');
    } finally {
      setGeneratingLime(false);
    }
  };

  // Function to upload files to Cloudinary
  const uploadToCloudinary = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(file => uploadSingleFile(file));
    return Promise.all(uploadPromises);
  };

  // Function to upload a single file to Cloudinary
  const uploadSingleFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'patient_teeth'); // Your preset name
    
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      if (!response.ok) {
        throw new Error('Cloudinary upload failed');
      }
      
      const result = await response.json();
      return result.secure_url; // Returns the Cloudinary URL
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  // Submit Images
  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return;

    // Reset ALL states at the beginning
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
    setPredictionResult("");
    setIsValid(true);
    setSeverityResponses("");
    setCauseResponses("");
    setSymptomResponses("");
    setConfidenceLevel("");
    setLimeExplanation(null);
    setGeneratingLime(true);

    try {
      setLoading(true);

<<<<<<< HEAD
      // STEP 0: Cloudinary upload (stubbed locally)
      console.log(LOCAL_TEST_MODE ? "[LOCAL] Skipping Cloudinary..." : "Uploading to Cloudinary...");
      const cloudinaryUrls = await uploadToCloudinary(selectedFiles);

      // STEP 1: Fast prediction — this always runs (needs your backend running locally)
=======
      // Upload images to Cloudinary
      console.log("Uploading to Cloudinary...");
      const cloudinaryUrls = await uploadToCloudinary(selectedFiles);
      console.log("Cloudinary URLs:", cloudinaryUrls);  

      // ===== STEP 1: FAST PREDICTION (NO LIME) =====
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
      console.log("Getting fast prediction...");
      const fastFormData = new FormData();
      fastFormData.append('file', selectedFiles[0]);

      const fastResponse = await fetch(`${API_URL}/predict-fast`, {
        method: 'POST',
        body: fastFormData,
      });

<<<<<<< HEAD
      if (!fastResponse.ok) throw new Error("Fast prediction failed");

      const fastData = await fastResponse.json();
      const prediction = fastData.prediction.prediction;

      // ✅ Update context — this drives HomeCard1's radial bar
      const confidenceNum = parseFloat((fastData.prediction.confidence * 100).toFixed(1));
      setConfidenceScore(confidenceNum);       // → HomeCard1 radial bar updates
      setConfidenceLevel(`${confidenceNum}%`); // → local scan page display

      setPredictionResult(prediction);
      console.log("Fast prediction received:", prediction, `(${confidenceNum}%)`);
      setLoading(false);

      // STEP 2: LIME in background
      // In LOCAL_TEST_MODE, LIME still runs if your backend supports it.
      // Comment out this entire block if your backend isn't ready for LIME yet.
      console.log("Generating LIME explanation in background...");
      const limeFormData = new FormData();
      limeFormData.append('file', selectedFiles[0]);

      fetch(`${API_URL}/generate-lime?num_samples=100`, { method: 'POST', body: limeFormData })
        .then(async limeResponse => {
          if (!limeResponse.ok) {
            console.error("LIME generation failed:", limeResponse.status);
            setGeneratingLime(false);
            return;
          }

          const limeData = await limeResponse.json();
          setLimeExplanation(limeData.explanation_image);
          setGeneratingLime(false);

          // STEP 3: Save to DB (skipped in LOCAL_TEST_MODE)
          if (LOCAL_TEST_MODE) {
            console.log("[LOCAL] Skipping Cloudinary LIME upload and DB save.");
            return;
          }

          const limeFile = base64ToFile(limeData.explanation_image, 'lime-explanation.png');
          const limeCloudinaryUrl = await uploadSingleFile(limeFile);

          const notes = [
            `Model Prediction: ${prediction} (${confidenceNum.toFixed(1)}% confidence)`,
          ];

          await createScanRecord({
            variables: {
              user: userId,
              result: [prediction],
              notes,
              imageUrls: cloudinaryUrls,
              limeVisualizationUrl: limeCloudinaryUrl,
            },
          });
          console.log("Scan record saved!");
        })
        .catch(error => {
=======
      if (!fastResponse.ok) {
        throw new Error("Fast prediction failed");
      }

      const fastData = await fastResponse.json();

      // Extract prediction from fast response
      const prediction = fastData.prediction.prediction;
      setPredictionResult(prediction);
      setConfidenceLevel(`${(fastData.prediction.confidence * 100).toFixed(1)}%`);
      console.log("Fast prediction received:", prediction);

      setLoading(false);

      // ===== STEP 2: GENERATE LIME IN BACKGROUND =====
      console.log("Generating LIME explanation in background...");
      
      const limeFormData = new FormData();
      limeFormData.append('file', selectedFiles[0]);

      fetch(`${API_URL}/generate-lime?num_samples=100`, {
        method: 'POST',
        body: limeFormData,
      })
        .then(async (limeResponse) => {
          if (limeResponse.ok) {
            const limeData = await limeResponse.json();

            // Store LIME visualization
            setLimeExplanation(limeData.explanation_image);
            setGeneratingLime(false);

            // Convert base64 LIME image to File and upload to Cloudinary
            console.log("Uploading LIME visualization to Cloudinary...");
            const limeImageFile = base64ToFile(limeData.explanation_image, 'lime-explanation.png');
            const limeCloudinaryUrl = await uploadSingleFile(limeImageFile);
            console.log("LIME Cloudinary URL:", limeCloudinaryUrl);

            // Prepare comprehensive notes array
            const notes = [
              `Model Prediction: ${fastData.prediction.prediction} (${(fastData.prediction.confidence * 100).toFixed(1)}% confidence)`,
            ];

            // Save to database with LIME data
            await createScanRecord({
              variables: {
                user: userId,
                result: [prediction],
                notes: notes,
                imageUrls: cloudinaryUrls,
                limeVisualizationUrl: limeCloudinaryUrl,
              },
            });

            console.log("LIME explanation ready and saved!");
          } else {
            console.error("LIME generation failed:", limeResponse.status);
            setGeneratingLime(false);
          }
        })
        .catch((error) => {
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
          console.error("Error generating LIME:", error);
          setGeneratingLime(false);
        });

    } catch (error) {
      console.error("Error during analysis:", error);
      setPredictionResult("Error: could not get prediction.");
      setLoading(false);
      setGeneratingLime(false);
    }
  };

<<<<<<< HEAD
  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Results panel */}
      <div className="h-[370px] bg-gradient-to-tr from-[#6a8ff7] via-[#7eb8f7] to-[#b2ede8]
        backdrop-blur-md bg-opacity-30 rounded-3xl p-6 shadow-md hover:shadow-blue-300
        transition-shadow duration-500 relative"
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center pt-4 rounded-3xl z-10">
            <img src={LoadingTeeth.src} alt="Loading..." className="w-40 h-auto" />
          </div>
        )}

        <div className="flex justify-between">
          <h2 className="text-2xl font-bold text-white">Ready to check your Tongue's Health?</h2>

          {generatingLime && (
            <div className="flex items-center gap-3 px-4 py-2 bg-blue-500/80 rounded-3xl">
              <span className="text-white text-sm font-medium">
                Generating AI Explanation, please wait...
=======
  return (
    <>
      <div className="h-[370px] bg-gradient-to-br from-[#4fa1f2] via-[#74b0f0] to-[#66acf4] 
        backdrop-blur-md bg-opacity-30 rounded-3xl p-6 shadow-md hover:shadow-blue-300 
        transition-shadow duration-500 relative"
      >       
        {/* Loading GIF overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center pt-4 rounded-3xl z-10">
            <img 
              src={LoadingTeeth.src} 
              alt="Loading..." 
              className="w-40 h-auto" // Adjust size as needed
            />
          </div>
        )}
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold text-white">Ready to check your Teeth's Health?</h2>
          {/* Show loading state while generating LIME */}
          {generatingLime && (
            <div className="flex items-center gap-3 px-4 py-2 bg-blue-500/80 rounded-3xl">
              <span className="text-white text-sm font-medium">
                Please wait for 30 seconds, Image Explanation Generating...
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
              </span>
            </div>
          )}

<<<<<<< HEAD
=======
          {/* Show button when LIME is ready */}
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
          {!generatingLime && limeExplanation && (
            <button
              onClick={() => setShowLimeExplanation(true)}
              className="px-6 py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-600 transition"
            >
              🔍 View AI Explanation
            </button>
          )}
<<<<<<< HEAD
        </div>

        <p className="text-2xl text-white font-semibold mt-2">Scan Results</p>

        {/* LOCAL_TEST_MODE badge — visible reminder, remove for production */}
        {LOCAL_TEST_MODE && (
          <span className="absolute top-4 right-4 text-xs bg-yellow-400 text-yellow-900 font-bold px-2 py-1 rounded-full">
            LOCAL TEST MODE
          </span>
        )}

        {predictionResult !== "" ? (
          isValid ? (
            <div className="flex items-start gap-10 mt-4">
              {/* Condition result */}
              <div className="text-xl text-white">
                <p className="mb-2 font-semibold">Tongue Condition:</p>
                <ul className="list-disc list-inside">
                  <li className="font-semibold capitalize">{predictionResult}</li>
                  <li>Confidence: {confidenceLevel}</li>
                </ul>
              </div>

              {/* Info boxes — populated when Gemini streaming is wired up */}
              <div className="w-80 h-55 bg-white/20 backdrop-blur-md rounded-3xl p-4 shadow-inner text-white">
                <p className="text-sm font-medium mb-2">Severity:</p>
                <p className="text-sm">{severityResponses || "—"}</p>
              </div>
              <div className="w-80 h-55 bg-white/20 backdrop-blur-md rounded-3xl p-4 shadow-inner text-white">
                <p className="text-sm font-medium mb-2">Possible Causes:</p>
                <p className="text-sm">{causeResponses || "—"}</p>
              </div>
              <div className="w-80 h-55 bg-white/20 backdrop-blur-md rounded-3xl p-4 shadow-inner text-white">
                <p className="text-sm font-medium mb-2">Symptoms:</p>
                <p className="text-sm">{symptomResponses || "—"}</p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-2xl text-white font-semibold">{predictionResult}</p>
=======
        </div>     
        <p className="text-2xl text-white font-semibold mt-2">Scan Results</p>
        {predictionResult !== "" ? (
          isValid ? (
            <div className="flex items-start gap-10 mt-4">
              {/* Prediction list on the left */}
              <div className="text-xl text-white">
                <p className="mb-2 font-semibold">Diseases Present:</p>
                <ul className="list-disc list-inside">
                  {predictionResult ? (
                    <>
                      <li className="font-semibold capitalize">{predictionResult}</li>
                      <li>Confidence: {confidenceLevel}</li>
                    </>
                  ) : (
                    <li>{predictionResult}</li>
                  )}
                </ul>
              </div>

              {/* Status boxes */}
              <div className="w-80 h-55 bg-white/20 backdrop-blur-md rounded-3xl p-4 shadow-inner text-white">
                <p className="text-sm font-medium mb-2">Severity of Disease:</p>
                <p className="text-sm">{severityResponses}</p>
              </div>
              <div className="w-80 h-55 bg-white/20 backdrop-blur-md rounded-3xl p-4 shadow-inner text-white">
                <p className="text-sm font-medium mb-2">Possible Causes:</p>
                <p className="text-sm">{causeResponses}</p>
              </div>
              <div className="w-80 h-55 bg-white/20 backdrop-blur-md rounded-3xl p-4 shadow-inner text-white">
                <p className="text-sm font-medium mb-2">Symptoms:</p>
                <p className="text-sm">{symptomResponses}</p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-2xl text-white font-semibold">
              {predictionResult}
            </p>
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
          )
        ) : null}
      </div>

<<<<<<< HEAD
      {/* Upload panel */}
      <div className="h-[370px] bg-gradient-to-br from-white via-[#f0f0f0] to-[#e6e6e6]
        backdrop-blur-md bg-opacity-50 rounded-3xl p-6 shadow-md hover:shadow-gray-300
        transition-shadow duration-500 relative"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#74b0f0]">Upload Tongue Image:</h2>

          <div className="flex gap-2 items-center flex-wrap">
            {availableDevices.length > 1 && !isCameraOpen && (
              <select
                value={selectedDeviceId}
                onChange={e => setSelectedDeviceId(e.target.value)}
                className="px-3 py-2 rounded-3xl border border-gray-300 text-sm max-w-48"
              >
                <option value="">Select Camera</option>
                {availableDevices.map((d, i) => (
                  <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${i + 1}`}</option>
                ))}
              </select>
            )}

            {!isCameraOpen ? (
              <button onClick={openCamera} className="px-4 py-2 bg-[#74b0f0] text-white rounded-3xl hover:bg-[#5a9bd8] transition">
                📷 Open Camera
              </button>
            ) : (
              <button onClick={closeCamera} className="px-4 py-2 bg-red-500 text-white rounded-3xl hover:bg-red-600 transition">
=======
      <div className="h-[370px] bg-gradient-to-br from-white via-[#f0f0f0] to-[#e6e6e6]
        backdrop-blur-md bg-opacity-50 rounded-3xl p-6 shadow-md hover:shadow-gray-300
        transition-shadow duration-500 relative"
      >     
        <div className="flex justify-between items-center mb-4">  
          <h2 className="text-2xl font-bold text-[#74b0f0]">Upload Images Here:</h2>
          
          {/* Camera controls on the right */}
          <div className="flex gap-2 items-center flex-wrap">          
            {/* Device selector dropdown */}
            {availableDevices.length > 1 && !isCameraOpen && (
              <select
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="px-3 py-2 rounded-3xl border border-gray-300 text-sm max-w-48"
              >
                <option value="">Select Camera</option>
                {availableDevices.map((device, index) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${index + 1}`}
                  </option>
                ))}
              </select>
            )}
            
            {!isCameraOpen ? (
              <button
                onClick={openCamera}
                className="px-4 py-2 bg-[#74b0f0] text-white rounded-3xl hover:bg-[#5a9bd8] transition"
              >
                📷 Open Camera
              </button>
            ) : (
              <button
                onClick={closeCamera}
                className="px-4 py-2 bg-red-500 text-white rounded-3xl hover:bg-red-600 transition"
              >
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
                ✕ Close Camera
              </button>
            )}
          </div>

<<<<<<< HEAD
=======
          {/* Device selector modal */}
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
          {showDeviceSelector && (
            <div className="absolute top-20 right-6 z-20 bg-white p-4 rounded-xl shadow-lg border max-w-80">
              <p className="text-gray-800 mb-3 font-medium">Select Camera:</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
<<<<<<< HEAD
                {availableDevices.map((d, i) => (
                  <button key={d.deviceId} onClick={() => selectAndOpenCamera(d.deviceId)}
                    className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm border">
                    <div className="font-medium">{d.label || `Camera ${i + 1}`}</div>
                    <div className="text-xs text-gray-500 truncate">ID: {d.deviceId.substring(0, 30)}...</div>
                  </button>
                ))}
              </div>
              <button onClick={() => setShowDeviceSelector(false)} className="mt-3 px-3 py-1 bg-gray-500 text-white rounded-lg text-sm">Cancel</button>
=======
                {availableDevices.map((device, index) => (
                  <button
                    key={device.deviceId}
                    onClick={() => selectAndOpenCamera(device.deviceId)}
                    className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm border"
                  >
                    <div className="font-medium">
                      {device.label || `Camera ${index + 1}`}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      ID: {device.deviceId.substring(0, 30)}...
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowDeviceSelector(false)}
                className="mt-3 px-3 py-1 bg-gray-500 text-white rounded-lg text-sm"
              >
                Cancel
              </button>
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
            </div>
          )}
        </div>

<<<<<<< HEAD
=======
        {/* Camera view - Absolute positioned to not affect layout */}
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
        {isCameraOpen && (
          <div className="absolute top-20 right-6 z-10">
            <p className="text-gray-600 mb-2 text-sm">Camera View:</p>
            <div className="relative">
<<<<<<< HEAD
              <video ref={videoRef} autoPlay playsInline muted
                className="w-48 h-36 rounded-xl shadow-md bg-black object-cover"
                onLoadedMetadata={() => videoRef.current?.play()}
              />
              <button onClick={capturePhoto}
                className="mt-2 px-3 py-1 bg-[#74b0f0] text-white text-sm rounded-3xl hover:bg-[#5a9bd8] transition block">
=======
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-48 h-36 rounded-xl shadow-md bg-black object-cover"
                onLoadedMetadata={() => {
                  if (videoRef.current) {
                    videoRef.current.play();
                  }
                }}
              />
              <button
                onClick={capturePhoto}
                className="mt-2 px-3 py-1 bg-[#74b0f0] text-white text-sm rounded-3xl hover:bg-[#5a9bd8] transition block"
              >
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
                📸 Capture Photo
              </button>
            </div>
          </div>
        )}

<<<<<<< HEAD
        <div className="flex gap-4 h-[calc(100%-120px)]">
          <div className="flex-1">
            <div className="mb-4">
              <label htmlFor="fileUpload"
                className="cursor-pointer px-4 py-2 bg-[#74b0f0] text-white rounded-3xl hover:bg-[#5a9bd8] transition inline-block">
                Choose Image
              </label>
              <input id="fileUpload" type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            </div>

=======
        {/* Main content area with fixed height */}
        <div className="flex gap-4 h-[calc(100%-120px)]">
          {/* Left side - Upload and preview */}
          <div className="flex-1">
            <div className="mb-4">
              <label 
                htmlFor="fileUpload" 
                className="cursor-pointer px-4 py-2 bg-[#74b0f0] text-white rounded-3xl hover:bg-[#5a9bd8] transition inline-block"
              >
                Choose Image
              </label>
              <input 
                id="fileUpload"
                type="file" 
                accept="image/*" 
                multiple
                onChange={handleImageUpload} 
                className="hidden"
              />
            </div>

            {/* Replace the single image preview with: */}
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
            {images.length > 0 && (
              <div className="overflow-hidden">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-600">Image Preview ({images.length}/{MAX_IMAGES}):</p>
<<<<<<< HEAD
                  <button onClick={() => { setImages([]); setSelectedFiles([]); }} className="text-[#4fa1f2] text-sm hover:text-blue-700">Clear All</button>
=======
                  <button
                    onClick={() => {
                      setImages([]);
                      setSelectedFiles([]);
                    }}
                    className="text-[#4fa1f2] text-sm hover:text-blue-700"
                  >
                    Clear All
                  </button>
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
                </div>
                <div className="flex flex-wrap gap-6 max-h-[180px] overflow-y-auto justify-center">
                  {images.map((img, index) => (
                    <div key={index} className="relative">
<<<<<<< HEAD
                      <img src={img} alt={`Preview ${index + 1}`} className="w-[150px] h-[150px] object-cover rounded-xl shadow-md" />
=======
                      <img 
                        src={img} 
                        alt={`Preview ${index + 1}`} 
                        className="w-[150px] h-[150px] object-cover rounded-xl shadow-md"
                      />
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
                      <button
                        onClick={() => {
                          setImages(prev => prev.filter((_, i) => i !== index));
                          setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="absolute -top-1 right-0 bg-red-400 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
<<<<<<< HEAD
                      >×</button>
=======
                      >
                        ×
                      </button>
                      
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

<<<<<<< HEAD
        <div className="absolute bottom-6 right-6">
          <button onClick={handleSubmit} disabled={loading || selectedFiles.length === 0}
            className="px-6 py-3 bg-[#74b0f0] text-white rounded-3xl hover:bg-[#5a9bd8] transition disabled:opacity-50 font-medium">
=======
        {/* Fixed position button at bottom center */}
        <div className="absolute bottom-6 right-6">
          <button 
            onClick={handleSubmit}
            disabled={loading || selectedFiles.length === 0}
            className="px-6 py-3 bg-[#74b0f0] text-white rounded-3xl hover:bg-[#5a9bd8] transition disabled:opacity-50 font-medium"
          >
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
            {loading ? "Analyzing..." : "Analyze Image"}
          </button>
        </div>

<<<<<<< HEAD
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      {/* LIME Modal */}
      {showLimeExplanation && limeExplanation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-2xl bg-opacity-50"
          onClick={() => setShowLimeExplanation(false)}>
          <div className="bg-white rounded-3xl p-6 max-w-6xl max-h-[95vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl font-bold text-gray-800">🔍 AI Explanation - LIME Analysis</h3>
              <button onClick={() => setShowLimeExplanation(false)} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>
            <div className="mb-2 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700"><strong>How to read:</strong></p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>🟢 Green regions = Areas supporting the tongue condition diagnosis</li>
=======
        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      {/* LIME Explanation Modal */}
      {showLimeExplanation && limeExplanation && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-2xl bg-opacity-50"
          onClick={() => setShowLimeExplanation(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 max-w-6xl max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-2xl font-bold text-gray-800">
                🔍 AI Explanation - LIME Analysis
              </h3>
              <button
                onClick={() => setShowLimeExplanation(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-2 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>How to read:</strong>
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>🟢 Green regions = Areas supporting the diagnosis</li>
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
                <li>🔴 Red regions = Areas contradicting the diagnosis</li>
                <li>⚪ Neutral areas = Not significant for diagnosis</li>
              </ul>
            </div>
<<<<<<< HEAD
            <img src={`data:image/png;base64,${limeExplanation}`} alt="LIME Explanation" className="w-full rounded-lg shadow-lg" />
            <div className="mt-4 text-center">
              <button onClick={() => setShowLimeExplanation(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-3xl hover:bg-gray-700 transition">Close</button>
=======

            <img
              src={`data:image/png;base64,${limeExplanation}`}
              alt="LIME Explanation"
              className="w-full rounded-lg shadow-lg"
            />

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowLimeExplanation(false)}
                className="px-6 py-2 bg-gray-600 text-white rounded-3xl hover:bg-gray-700 transition"
              >
                Close
              </button>
>>>>>>> 213da0601e3090184f4f0c6350c299b67eaec917
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ScanPage;