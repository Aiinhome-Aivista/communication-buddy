import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fatchedPostRequest, postURL } from "../../../services/ApiService";
import { useTopic } from "../../../provider/TopicProvider";
import useSpeechRecognition from "../../../hooks/useSpeechRecognition";
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

  const speakText = (text, lang = "en-IN") => {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();

    // Find a female voice for the selected language
    const femaleVoice = voices.find(
      (voice) =>
        voice.lang === lang &&
        (voice.name.toLowerCase().includes("female") ||
          voice.name.toLowerCase().includes("zira") || // common female voice name
          voice.name.toLowerCase().includes("susan") ||
          voice.name.toLowerCase().includes("neural")) // helpful for Hindi
    );

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.voice = femaleVoice || voices.find((v) => v.lang === lang);
    utterance.rate = 0.8;   // slower speed
    utterance.pitch = 1.2;  // slightly higher pitch
    utterance.volume = 1.0;

    synth.cancel(); // stop any current speech
    synth.speak(utterance);
  };

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices(); // triggers loading
    };
  }, []);

  useEffect(() => {
    if (!chatStarted && !languagePromptSpoken) {
      speakText("Please choose a language. English or Hindi", "en-IN");
      setLanguagePromptSpoken(true);
    }
  }, [chatStarted, languagePromptSpoken]);

  useEffect(() => {
    if (!chatStarted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [chatStarted]);

  useEffect(() => {
    if (chatStarted && getQes[currentQuestionIndex]) {
      speakText(getQes[currentQuestionIndex].question, selectedLanguage);
    }
  }, [currentQuestionIndex, chatStarted]);

  const onSpeechResult = (transcript) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = transcript;
      return newAnswers;
    });

    setQuestionStatus((prev) => {
      const newStatus = [...prev];
      newStatus[currentQuestionIndex] = "answered";
      return newStatus;
    });

    setTimeout(() => {
      if (currentQuestionIndex < getQes.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    }, 1500);
  };

  const handleSkip = () => {
    setQuestionStatus((prev) => {
      const newStatus = [...prev];
      if (newStatus[currentQuestionIndex] === "unanswered") {
        newStatus[currentQuestionIndex] = "skipped";
      }
      return newStatus;
    });
    if (currentQuestionIndex < getQes.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const { startRecording, isRecording } = useSpeechRecognition({
    onResult: onSpeechResult,
    onSilence: handleSkip,
  });

  const handleOnStartSession = async () => {
    try {
      if (!id) {
        setErrorMsg("Topic ID is required to start the session.");
        return;
      }

      const topic = getTopicData.find((topic) => topic.topic_name === id);
      if (!topic) {
        setErrorMsg("Topic not found");
        return;
      }

      const questionBody = {
        user_id: sessionStorage.getItem("user_id"),
        hr_id: topic.hr_id,
        topic: id,
      };

      const response = await fatchedPostRequest(postURL.getQuestions, questionBody);
      if (response.status !== 200 || !response.success) {
        console.log(response);
        setErrorMsg(response.message);
        setChatStarted(false);
        return;
      }

      if (response.questions && Array.isArray(response.questions)) {
        setQes(response.questions);
        setAnswers(Array(response.questions.length).fill(""));
        setQuestionStatus(Array(response.questions.length).fill("unanswered"));
        setChatStarted(true);
      }
    } catch (err) {
      console.error("Failed to start session:", err);
      setChatStarted(false);
    }
  };

  const handleSubmit = () => {
    alert("Test Submitted!");
    console.log("Answers:", answers);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[76vh] bg-[#0f1d2e] text-white">
      {getErrorMsg && <div className="text-red-500 mb-4">{getErrorMsg}</div>}

      {/* 👇 Language Selection UI */}
      {!chatStarted && !selectedLanguage ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-lg">Please choose a language:</p>
          <div className="flex gap-4">
            <button
              className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700"
              onClick={() => setSelectedLanguage("en-IN")}
            >
              English
            </button>
            <button
              className="px-6 py-3 rounded-md bg-green-600 hover:bg-green-700"
              onClick={() => setSelectedLanguage("hi-IN")}
            >
              Hindi
            </button>
          </div>
        </div>
      ) : !chatStarted ? (
        <button
          className="px-8 py-4 text-lg font-semibold rounded-lg border-2 border-teal-500 bg-teal-800 hover:bg-teal-700 transition"
          onClick={handleOnStartSession}
        >
          Start Session
        </button>
      ) : (
        <div className="flex w-full p-4 gap-4">
          {/* Left Panel */}
          <div className="flex-1 bg-[#1a2b3c] h-[76vh] rounded-lg p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">
              Question {currentQuestionIndex + 1} of {getQes.length}
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              {getQes[currentQuestionIndex]?.question}
            </p>

            <div className="bg-[#0f1d2e] p-4 rounded-md border border-teal-500 h-32 mb-4 flex items-center justify-center text-lg text-gray-300">
              {answers[currentQuestionIndex]
                ? answers[currentQuestionIndex]
                : "Your answer will appear here after recording..."}
            </div>

            <div className="flex justify-center mt-4">
              <div className="flex gap-4">
                {questionStatus[currentQuestionIndex] !== "answered" && (
                  <button
                    className={`px-6 py-3 rounded-md text-lg font-semibold ${isRecording ? "bg-red-600" : "bg-teal-600 hover:bg-teal-700"
                      }`}
                    onClick={startRecording}
                  >
                    {isRecording ? "Listening..." : "Speak"}
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
          <div className="w-64 bg-[#1a2b3c] rounded-lg p-2 flex flex-col right-panel">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Time Left</h3>
              <div className="text-2xl font-bold text-teal-400">
                {formatTime(timeLeft)}
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-2">Questions</h3>
            <div className="grid grid-cols-5 gap-3 overflow-hidden overflow-y-scroll h-72 px-3 py-3">
              {getQes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (questionStatus[index] !== "answered") {
                      setCurrentQuestionIndex(index);
                    }
                  }}
                  className={`w-10 h-10 rounded-full text-sm font-bold ${index === currentQuestionIndex
                    ? "border-4 border-teal-400"
                    : ""
                    } ${questionStatus[index] === "answered"
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
              <p>
                <span className="inline-block w-3 h-3 bg-green-500 mr-2"></span>
                Answered
              </p>
              <p>
                <span className="inline-block w-3 h-3 bg-yellow-500 mr-2"></span>
                Skipped
              </p>
              <p>
                <span className="inline-block w-3 h-3 bg-gray-600 mr-2"></span>
                Unanswered
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
