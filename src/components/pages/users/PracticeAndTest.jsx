import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fatchedPostRequest, postURL } from "../../../services/ApiService";
import { useTopic } from "../../../provider/TopicProvider";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { formatTime } from "../../../utils/Timer";

export default function PracticeAndTest() {
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

  const { getTopicData } = useTopic();
  const { id } = useParams();

  const [chatStarted, setChatStarted] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(30 * 60);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(120);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [getQes, setQes] = useState([]);
  const [getErrorMsg, setErrorMsg] = useState(null);
  const [questionStatus, setQuestionStatus] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [questionTimer, setQuestionTimer] = useState(null);

  useEffect(() => {
    if (!chatStarted) return;
    const timer = setInterval(() => {
      setSessionTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [chatStarted]);

  useEffect(() => {
    if (!chatStarted || !getQes.length) return;

    stopRecording();
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });

    setQuestionTimeLeft(120);
    if (questionTimer) clearInterval(questionTimer);
    const timer = setInterval(() => {
      setQuestionTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion(); // Auto-next
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setQuestionTimer(timer);

    return () => clearInterval(timer);
  }, [currentQuestionIndex]);

  const startRecording = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };

  const stopRecording = () => {
    SpeechRecognition.stopListening();
  };

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

      const response = await fatchedPostRequest(
        postURL.getQuestions,
        questionBody
      );
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

  const handleNextQuestion = () => {
    if (listening) {
      stopRecording();
    }

    const currentQ = getQes[currentQuestionIndex];
    const newAnswer = {
      qid: currentQ._id,
      topic: id,
      answer: transcript.trim(),
    };

    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentQuestionIndex] = newAnswer;
      return updated;
    });

    setQuestionStatus((prev) => {
      const updated = [...prev];
      updated[currentQuestionIndex] = "answered";
      return updated;
    });

    if (questionTimer) clearInterval(questionTimer);

    if (currentQuestionIndex < getQes.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    stopRecording();
    if (questionTimer) clearInterval(questionTimer);

    console.log("Final Answers:", answers);
    alert("Test Submitted!");
    // Optionally send to backend
    // fatchedPostRequest(postURL.submitAnswers, { answers })
  };

  return (
    <div className="flex flex-col items-center justify-center h-[76vh] bg-[#0f1d2e] text-white">
      {getErrorMsg && <div className="text-red-500 mb-4">{getErrorMsg}</div>}

      {!chatStarted ? (
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
              {listening || transcript
                ? transcript
                : "Your answer will appear here after recording..."}
            </div>

            <div className="flex justify-between items-center mt-4 w-full">
              <div className="text-teal-300 font-bold text-lg">
                Time Left: {formatTime(questionTimeLeft)}
              </div>

              <div className="flex gap-3">
                <button
                  className={`px-6 py-3 rounded-md text-lg font-semibold ${
                    listening ? "bg-red-600" : "bg-teal-600 hover:bg-teal-700"
                  }`}
                  onClick={startRecording}
                  disabled={questionStatus[currentQuestionIndex] === "answered"}
                >
                  {listening ? "Listening..." : "Speak Answer"}
                </button>

                {currentQuestionIndex === getQes.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-md text-lg font-semibold"
                  >
                    Submit Test
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md text-lg font-semibold"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-64 bg-[#1a2b3c] rounded-lg p-6 flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Session Time</h3>
              <div className="text-2xl font-bold text-teal-400">
                {formatTime(sessionTimeLeft)}
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-2">Questions</h3>
            <div className="grid grid-cols-5 gap-3">
              {getQes.map((data, index) => (
                <button
                  key={index}
                  disabled={index <= currentQuestionIndex}
                  className={`w-10 h-10 rounded-full text-sm font-bold ${
                    index === currentQuestionIndex
                      ? "border-4 border-teal-400"
                      : ""
                  } ${
                    questionStatus[index] === "answered"
                      ? "bg-green-500 cursor-not-allowed opacity-70"
                      : "bg-gray-600"
                  }`}
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
