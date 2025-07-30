import React, { useEffect, useState, useRef } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useParams } from "react-router";
import { fatchedPostRequest, postURL } from "../../../services/ApiService";
import { useTopic } from "../../../provider/TopicProvider";
import { formatTime } from "../../../utils/Timer";

export default function PracticeAndTest() {
  const { getTopicData } = useTopic();
  const { id } = useParams();

  const [chatStarted, setChatStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [getQes, setQes] = useState([]);
  const [getErrorMsg, setErrorMsg] = useState(null);
  const [questionStatus, setQuestionStatus] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [languagePromptSpoken, setLanguagePromptSpoken] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const silenceTimeoutRef = useRef(null);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const speakText = (text, lang = "en-IN") => {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.lang === lang &&
        /female|zira|susan|neural/i.test(v.name)
    );
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.voice = preferredVoice || voices.find((v) => v.lang === lang);
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    synth.cancel();
    synth.speak(utterance);
  };

  // Load voices on mount
  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);

  // Ask for language once
  useEffect(() => {
    if (!chatStarted && !languagePromptSpoken) {
      speakText("Please choose a language. English or Hindi");
      setLanguagePromptSpoken(true);
    }
  }, [chatStarted, languagePromptSpoken]);

  // Timer
  useEffect(() => {
    if (!chatStarted) return;
    const timer = setInterval(() => setTimeLeft((t) => Math.max(t - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [chatStarted]);

  // Read question aloud
  useEffect(() => {
    if (chatStarted && getQes[currentQuestionIndex]) {
      speakText(getQes[currentQuestionIndex].question, selectedLanguage);
    }
  }, [currentQuestionIndex, chatStarted]);

  // Auto-stop on silence
  useEffect(() => {
    if (transcript && isListening) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = setTimeout(stopAndSaveTranscript, 10000);
    }
  }, [transcript]);

  const stopAndSaveTranscript = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
    saveAnswer(transcript.trim());
    resetTranscript();
  };

  const saveAnswer = (text) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentQuestionIndex] = text;
      return updated;
    });
    setQuestionStatus((prev) => {
      const updated = [...prev];
      updated[currentQuestionIndex] = "answered";
      return updated;
    });
    if (currentQuestionIndex < getQes.length - 1) {
      setTimeout(() => setCurrentQuestionIndex((i) => i + 1), 1500);
    }
  };

  const handleSkip = () => {
    if (isListening) {
      SpeechRecognition.stopListening();
      setIsListening(false);
    }
    setQuestionStatus((prev) => {
      const updated = [...prev];
      if (updated[currentQuestionIndex] === "unanswered") {
        updated[currentQuestionIndex] = "skipped";
      }
      return updated;
    });
    if (currentQuestionIndex < getQes.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    }
  };

  const startRecording = () => {
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      language: selectedLanguage || "en-IN",
    });
    setIsListening(true);
  };

  const handleOnStartSession = async () => {
    if (!id) return setErrorMsg("Topic ID is required.");
    const topic = getTopicData.find((t) => t.topic_name === id);
    if (!topic) return setErrorMsg("Topic not found");

    const body = {
      user_id: sessionStorage.getItem("user_id"),
      hr_id: topic.hr_id,
      topic: id,
    };

    try {
      const res = await fatchedPostRequest(postURL.getQuestions, body);
      if (res.status !== 200 || !res.success) {
        setErrorMsg(res.message);
        setChatStarted(false);
        return;
      }
      if (Array.isArray(res.questions)) {
        setQes(res.questions);
        setAnswers(Array(res.questions.length).fill(""));
        setQuestionStatus(Array(res.questions.length).fill("unanswered"));
        setChatStarted(true);
      }
    } catch (err) {
      console.error("Session error:", err);
      setChatStarted(false);
    }
  };

  const handleSubmit = () => {
    alert("Test Submitted!");
    console.log("Answers:", answers);
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-[76vh] bg-[#0f1d2e] text-white">
      {getErrorMsg && <div className="text-red-500 mb-4">{getErrorMsg}</div>}

      {!chatStarted && !selectedLanguage ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg">Please choose a language:</p>
          <div className="flex gap-4">
            <button className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700" onClick={() => setSelectedLanguage("en-IN")}>English</button>
            <button className="px-6 py-3 rounded-md bg-green-600 hover:bg-green-700" onClick={() => setSelectedLanguage("hi-IN")}>Hindi</button>
          </div>
        </div>
      ) : !chatStarted ? (
        <button className="px-8 py-4 text-lg font-semibold rounded-lg border-2 border-teal-500 bg-teal-800 hover:bg-teal-700" onClick={handleOnStartSession}>
          Start Session
        </button>
      ) : (
        <div className="flex w-full p-4 gap-4">
          {/* Left Panel */}
          <div className="flex-1 bg-[#1a2b3c] h-[76vh] rounded-lg p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">
              Question {currentQuestionIndex + 1} of {getQes.length}
            </h2>
            <p className="text-gray-300 text-lg mb-6">{getQes[currentQuestionIndex]?.question}</p>

            <div className="bg-[#0f1d2e] p-4 rounded-md border border-teal-500 h-32 mb-4 flex items-center justify-center text-lg text-gray-300">
              {answers[currentQuestionIndex]
                ? answers[currentQuestionIndex]
                : isListening
                ? "Listening..."
                : "Your answer will appear here after recording..."}
            </div>

            <div className="flex justify-center mt-4">
              <div className="flex gap-4">
                {questionStatus[currentQuestionIndex] !== "answered" && (
                  <button
                    className={`px-6 py-3 rounded-md text-lg font-semibold ${isListening ? "bg-red-600" : "bg-teal-600 hover:bg-teal-700"}`}
                    onClick={startRecording}
                    disabled={isListening}
                  >
                    {isListening ? "Listening..." : "Speak"}
                  </button>
                )}
                {currentQuestionIndex === getQes.length - 1 && (
                  <button
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-md text-lg font-semibold"
                  >
                    Submit Test
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-64 bg-[#1a2b3c] rounded-lg p-2 flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Time Left</h3>
              <div className="text-2xl font-bold text-teal-400">{formatTime(timeLeft)}</div>
            </div>

            <h3 className="text-lg font-semibold mb-2">Questions</h3>
            <div className="grid grid-cols-5 gap-3 overflow-y-scroll h-72 px-3 py-3">
              {getQes.map((_, index) => (
                <button
                  key={index}
                  onClick={() =>
                    questionStatus[index] !== "answered" && setCurrentQuestionIndex(index)
                  }
                  className={`w-10 h-10 rounded-full text-sm font-bold ${
                    index === currentQuestionIndex ? "border-4 border-teal-400" : ""
                  } ${
                    questionStatus[index] === "answered"
                      ? "bg-green-500 cursor-not-allowed opacity-70"
                      : questionStatus[index] === "skipped"
                      ? "bg-yellow-500"
                      : "bg-gray-600"
                  }`}
                  disabled={questionStatus[index] === "answered"}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="mt-6 text-sm text-gray-400">
              <p><span className="inline-block w-3 h-3 bg-green-500 mr-2"></span>Answered</p>
              <p><span className="inline-block w-3 h-3 bg-yellow-500 mr-2"></span>Skipped</p>
              <p><span className="inline-block w-3 h-3 bg-gray-600 mr-2"></span>Unanswered</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
