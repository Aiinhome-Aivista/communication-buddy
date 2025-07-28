import { useRef, useState } from "react";

export default function useSpeechRecognition({ onResult, onSilence, language = "en-US" }) {
    const recognitionRef = useRef(null);
    const silenceTimeoutRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);

    const startRecording = () => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Speech Recognition not supported");
            return;
        }

        if (recognitionRef.current) recognitionRef.current.abort();

        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = language;

        recognitionRef.current = recognition;
        setIsRecording(true);

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim();
            clearTimeout(silenceTimeoutRef.current);
            if (onResult) onResult(transcript);
            recognition.stop();
            setIsRecording(false);
        };

        recognition.onspeechend = () => {
            silenceTimeoutRef.current = setTimeout(() => {
                recognition.stop();
                setIsRecording(false);
                if (onSilence) onSilence();
            }, 10000); // 10s
        };

        recognition.onerror = () => {
            clearTimeout(silenceTimeoutRef.current);
            setIsRecording(false);
        };

        recognition.onend = () => {
            clearTimeout(silenceTimeoutRef.current);
        };

        recognition.start();
    };

    const stopRecording = () => {
        if (recognitionRef.current) recognitionRef.current.stop();
        setIsRecording(false);
        clearTimeout(silenceTimeoutRef.current);
    };

    return {
        startRecording,
        stopRecording,
        isRecording,
    };
}
