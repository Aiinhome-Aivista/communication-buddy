import React, { useRef, useState, useEffect } from "react";
import { chatSession } from "../../../data/chatSession";
import { staticImages } from "../../../utils/Constant";
import { useSpeechSynthesis } from "react-speech-kit";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useParams } from "react-router";

const TextReader = ({
  chatStarted,
  setChatStarted,
  isTerminated,
  setIsTerminated,
}) => {
  const chatRef = useRef(null);
  const stageRef = useRef("language");
  const languageRef = useRef("en-IN");

  const [random4DigitID, setRandomID] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [conversationStage, setConversationStage] = useState("language");
  const [session, setSession] = useState([chatSession[0]]);
  const [isReading, setIsReading] = useState(false);
  const [showNewSessionBtn, setShowNewSessionBtn] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isMicActive, setIsMicActive] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const { speak, speaking: isSpeaking, cancel } = useSpeechSynthesis();

  const generateRandomID = () => {
    const id = Math.floor(1000 + Math.random() * 9000);
    setRandomID(id);
    setConversationStage("language");
    setCurrentIndex(0);
    setSession([chatSession[0]]);
  };

  // Handle session by api call
  const { id: topic } = useParams();

  const callChatAPI = async (userInput) => {
    console.log("caht api :", userInput);
    try {
      const response = await fetch("http://122.163.121.176:3004/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: random4DigitID?.toString(),
          topic: topic,
          time: "5 min",
          user_input: userInput,
        }),
      });

      const data = await response.json();
      const aiMessage = data?.response || "Sorry, I didn't understand that.";

      await speakAndAdd(aiMessage); // Speak and update chat
    } catch (error) {
      console.error("API error:", error);
      await speakAndAdd("There was a problem connecting to the server.");
    }
  };

  const speakAndAdd = (message) => {
    return new Promise((resolve) => {
      setSession((prev) => [
        ...prev,
        { role: "ai", message, time: new Date().toLocaleTimeString() },
      ]);
      speak({
        text: message,
        lang: languageRef.current,
        onEnd: () => {
          console.log("✅ Speech ended.");
          resolve();
        },
      });
    });
  };

  const handleUserMessage = async (text) => {
    console.log("User input:", text);
    if (!text.trim()) return;

    setSession((prev) => [
      ...prev,
      { role: "user", message: text, time: new Date().toLocaleTimeString() },
    ]);
    setUserInput("");

    if (stageRef.current === "language") {
      let message = "";
      let validLang = false;

      if (text.toLowerCase().includes("english")) {
        languageRef.current = "en-IN";
        message =
          "Great! Let's continue in English. Thank you for your response.";
        validLang = true;
      } else if (
        text.toLowerCase().includes("hindi") ||
        text.toLowerCase().includes("हिंदी")
      ) {
        languageRef.current = "hi-IN";
        message = "बहुत बढ़िया! कृपया अपना नाम और ईमेल साझा करें।";
        validLang = true;
      } else {
        message =
          "Language not recognized. Please respond with English or हिंदी (Hindi).";
      }

      console.log(
        "✅ Valid language selected:",
        validLang,
        languageRef.current
      );
      await speakAndAdd(message);

      if (validLang) {
        setConversationStage("awaitingDetails");
        stageRef.current = "awaitingDetails";
        await callChatAPI(text); // ✅ safely called here after speech ends
      }
    } else {
      await callChatAPI(text);
    }
  };

  useEffect(() => {
    if (!chatStarted || currentIndex >= session.length || isReading) return;
    const currentChat = session[currentIndex];
    if (currentChat.role === "ai") {
      setIsReading(true);
      speak({
        text: currentChat.message,
        onEnd: () => {
          setIsReading(false);
          setCurrentIndex((prev) => prev + 1);
        },
        lang: languageRef.current,
      });
    } else {
      const timeout = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, chatStarted, isReading]);

  useEffect(() => {
    stageRef.current = conversationStage;
  }, [conversationStage]);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [session]);

  useEffect(() => {
    if (!listening && transcript.trim().length > 0) {
      handleUserMessage(transcript.trim());
      resetTranscript();
      setIsMicActive(false);
    }
  }, [listening]);

  return (
    <div className="flex flex-col h-[calc(90vh-100px)] px-4 pt-4">
      {!chatStarted ? (
        <div className="flex-1 flex items-center justify-center h-full">
          <button
            className="bg-teal-600/40 px-6 py-3 rounded-xl text-white cursor-pointer hover:bg-teal-700/50"
            onClick={() => {
              setChatStarted(true);
              generateRandomID();
            }}
          >
            Start Session
          </button>
        </div>
      ) : (
        <div className="flex flex-col flex-1 overflow-hidden shadow-sm">
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4"
          >
            {session.map((item, index) => (
              <div
                key={index}
                className={`flex ${
                  item.role === "ai" ? "items-start" : "justify-end"
                }`}
              >
                {item.role === "ai" ? (
                  <div className="max-w-[60%] flex items-start gap-3 px-4 py-3 rounded-r-3xl rounded-b-3xl text-xs bg-gray-200 text-black">
                    <img
                      src={staticImages.aiAvatar}
                      alt="AI"
                      className={`w-8 h-8 rounded-full ${
                        isSpeaking && index === currentIndex
                          ? "animate-pulse"
                          : ""
                      }`}
                    />
                    <div>{item.message}</div>
                  </div>
                ) : (
                  <div className="max-w-[60%] px-4 py-3 rounded-l-3xl rounded-b-3xl text-xs bg-blue-600 text-white">
                    {item.message}
                  </div>
                )}
              </div>
            ))}

            {showNewSessionBtn && (
              <div className="flex justify-center">
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded-xl"
                  onClick={() => {
                    setShowNewSessionBtn(false);
                    setIsTerminated(false);
                    generateRandomID();
                  }}
                >
                  Do you want to start a new session?
                </button>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-2 px-4 py-3">
            <div className="flex flex-1 items-center bg-gray-100 px-3 py-2 rounded-2xl">
              <input
                type="text"
                className="flex-1 py-2 px-4 bg-transparent outline-none text-sm"
                placeholder="Type here"
                value={userInput}
                disabled={isTerminated}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleUserMessage(userInput);
                  }
                }}
              />

              {/* Mic Button */}
              <button
                disabled={isTerminated}
                className={`p-2 mr-2 rounded-full ${
                  listening ? "hover:bg-teal-300 animate-pulse" : ""
                }`}
                onClick={() => {
                  if (listening) return;
                  setIsMicActive(true);
                  SpeechRecognition.startListening({
                    continuous: false,
                    language: languageRef.current,
                  });
                }}
              >
                <img
                  src={isMicActive ? staticImages.activemic : staticImages.mic}
                  alt="Mic"
                  className="h-5 w-5 opacity-60"
                />
              </button>

              {/* Camera Button (disabled) */}
              <button className="p-2 rounded-full hover:bg-gray-300" disabled>
                <img
                  src={staticImages.camera}
                  alt="Camera"
                  className="h-5 w-5 opacity-60"
                />
              </button>
            </div>

            {/* Send Button */}
            <button
              disabled={isTerminated}
              className="bg-[#52628c] p-4 px-5 rounded-2xl text-white flex-shrink-0"
              onClick={() => handleUserMessage(userInput)}
            >
              <img src={staticImages.send} alt="Send" className="h-7 w-7" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextReader;
