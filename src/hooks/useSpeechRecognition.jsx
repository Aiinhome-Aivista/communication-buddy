import { useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function useCustomSpeechRecognition({ language = "en-IN" }) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    console.warn("Browser does not support speech recognition.");
    return null;
  }

  const startRecording = () => {
    if (listening) {
      console.warn("Already listening. Please stop before starting again.");
      resetTranscript();
      return;
    }
    console.log("Starting speech recognition...", language, transcript);
    SpeechRecognition.startListening({ continuous: true, language });
  };

  const stopRecording = () => {
    SpeechRecognition.stopListening();
  };

  return {
    startRecording,
    stopRecording,
    isRecording: listening,
    transcript,
    resetTranscript,
  };
}
