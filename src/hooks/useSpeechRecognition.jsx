import { useRef, useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function useCustomSpeechRecognition({ language = "en-IN" }) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [permissionError, setPermissionError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Check for HTTPS requirement
  const isSecureContext = window.location.protocol === 'https:' || window.location.hostname === 'localhost';

  useEffect(() => {
    // Check browser support and secure context
    if (!browserSupportsSpeechRecognition) {
      console.warn("Browser does not support speech recognition.");
      setIsSupported(false);
      return;
    }

    if (!isSecureContext) {
      console.error("Speech Recognition requires HTTPS or localhost");
      setIsSupported(false);
      return;
    }

    // Check if SpeechRecognition is available
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      console.error("SpeechRecognition API not available");
      setIsSupported(false);
      return;
    }

    // Request microphone permission
    const requestPermission = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Stop the stream immediately as we just needed permission
          stream.getTracks().forEach(track => track.stop());
          setPermissionGranted(true);
          setPermissionError(null);
        }
      } catch (error) {
        console.error("Microphone permission denied:", error);
        setPermissionError(error.message);
        setPermissionGranted(false);
      }
    };

    requestPermission();
  }, [browserSupportsSpeechRecognition, isSecureContext]);

  if (!isSupported) {
    console.warn("Speech recognition not supported in this environment.");
    return {
      startRecording: () => console.warn("Speech recognition not available"),
      stopRecording: () => {},
      isRecording: false,
      transcript: "",
      resetTranscript: () => {},
      error: "Speech recognition not supported",
      permissionGranted: false
    };
  }

  if (!permissionGranted && permissionError) {
    return {
      startRecording: () => console.warn("Microphone permission required"),
      stopRecording: () => {},
      isRecording: false,
      transcript: "",
      resetTranscript: () => {},
      error: permissionError,
      permissionGranted: false
    };
  }

  const startRecording = async () => {
    if (!permissionGranted) {
      console.warn("Microphone permission not granted");
      return;
    }

    if (listening) {
      console.warn("Already listening. Please stop before starting again.");
      resetTranscript();
      return;
    }

    try {
      console.log("Starting speech recognition...", language);
      await SpeechRecognition.startListening({ 
        continuous: true, 
        language,
        interimResults: true
      });
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      setPermissionError(error.message);
    }
  };

  const stopRecording = () => {
    try {
      SpeechRecognition.stopListening();
    } catch (error) {
      console.error("Failed to stop speech recognition:", error);
    }
  };

  return {
    startRecording,
    stopRecording,
    isRecording: listening,
    transcript,
    resetTranscript,
    error: permissionError,
    permissionGranted
  };
}
