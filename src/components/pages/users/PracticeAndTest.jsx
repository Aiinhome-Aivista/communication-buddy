import React, { useEffect, useState, useRef } from "react";

const sampleQuestions = [
  { id: 1, question: "Easy question here", type: "easy" },
  { id: 2, question: "Medium question here", type: "medium" },
  { id: 3, question: "Hard question here", type: "hard" },
];

export default function PracticeAndTest() {
  const [chatStarted, setChatStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionStatus, setQuestionStatus] = useState(
    sampleQuestions.map(() => "unanswered")
  );
  const [answers, setAnswers] = useState(sampleQuestions.map(() => ""));
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null);

  useEffect(() => {
    if (!chatStarted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [chatStarted]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const startRecording = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true; // allow continuous listening
    recognition.interimResults = false;
    recognition.lang = "en-US";

    setIsRecording(true);
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();

      // Stop any pending silence timer because user spoke
      clearTimeout(silenceTimeoutRef.current);

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

      recognition.stop(); // stop immediately after answer captured
      setIsRecording(false);

      setTimeout(() => {
        if (currentQuestionIndex < sampleQuestions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      }, 1500);
    };

    recognition.onspeechend = () => {
      // If user stops talking, wait 10s for more speech
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = setTimeout(() => {
        recognition.stop(); // stop after 10s silence
        setIsRecording(false);
        handleSkip();
      }, 10000);
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

  const handleSkip = () => {
    setQuestionStatus((prev) => {
      const newStatus = [...prev];
      if (newStatus[currentQuestionIndex] === "unanswered") {
        newStatus[currentQuestionIndex] = "skipped";
      }
      return newStatus;
    });
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    alert("Test Submitted!");
    console.log("Answers:", answers);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[76vh] bg-[#0f1d2e] text-white">
      {!chatStarted ? (
        <button
          className="px-8 py-4 text-lg font-semibold rounded-lg border-2 border-teal-500 bg-teal-800 hover:bg-teal-700 transition"
          onClick={() => setChatStarted(true)}
        >
          Start Session
        </button>
      ) : (
        <div className="flex w-full p-4 gap-4">
          {/* Left Panel */}
          <div className="flex-1 bg-[#1a2b3c] h-[76vh] rounded-lg p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4">
              Question {currentQuestionIndex + 1} of {sampleQuestions.length}
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              {sampleQuestions[currentQuestionIndex].question}
            </p>

            <div className="bg-[#0f1d2e] p-4 rounded-md border border-teal-500 h-32 mb-4 flex items-center justify-center text-lg text-gray-300">
              {answers[currentQuestionIndex]
                ? answers[currentQuestionIndex]
                : "Your answer will appear here after recording..."}
            </div>

            <div className="flex justify-center mt-4">
              {currentQuestionIndex === sampleQuestions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-md text-lg font-semibold"
                >
                  Submit Test
                </button>
              ) : (
                <button
                  className={`px-6 py-3 rounded-md text-lg font-semibold ${
                    isRecording ? "bg-red-600" : "bg-teal-600 hover:bg-teal-700"
                  }`}
                  onClick={startRecording}
                  disabled={questionStatus[currentQuestionIndex] === "answered"}
                >
                  {isRecording ? "Listening..." : "Speak Answer"}
                </button>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-64 bg-[#1a2b3c] rounded-lg p-6 flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Time Left</h3>
              <div className="text-2xl font-bold text-teal-400">
                {formatTime(timeLeft)}
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-2">Questions</h3>
            <div className="grid grid-cols-5 gap-3">
              {sampleQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (questionStatus[index] !== "answered") {
                      setCurrentQuestionIndex(index);
                    }
                  }}
                  className={`w-10 h-10 rounded-full text-sm font-bold ${
                    index === currentQuestionIndex
                      ? "border-4 border-teal-400"
                      : ""
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
