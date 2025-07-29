import { useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

export default function useCustomSpeechRecognition({ language = "en-IN" }) {
    const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();
    // console.log(transcript);
    if (!browserSupportsSpeechRecognition) {
        console.warn("Browser does not support speech recognition.");
        return null;
    }

    const startRecording = () => {
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
    };
}
