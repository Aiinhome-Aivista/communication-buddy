import React, { useRef, useState, useEffect } from "react";
import { chatSession } from "../../../data/chatSession";
import { staticImages } from "../../../utils/Constant";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useNavigate, useParams } from "react-router";
import { useTopic } from "../../../provider/TopicProvider";
import { greettingMessage, saveChatSession } from "../../../utils/saveChatSessionReview";
const TextReader = ({
  chatStarted,
  setChatStarted,
  isTerminated,
  setIsTerminated,
  startMessage,
}) => {
  console.log('startMessage', startMessage, chatSession)
  const initialMessage =
    startMessage && startMessage.length > 0
      ? startMessage[0]
      : { role: "ai", message: "Hello! Welcome!", time: new Date().toLocaleTimeString() };
  const chatRef = useRef(null);
  const stageRef = useRef("language");
  const languageRef = useRef("en-IN");
  const isNewSessionRef = useRef(false);

  const [random4DigitID, setRandomID] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [conversationStage, setConversationStage] = useState("language");
  const [session, setSession] = useState([initialMessage]);
  const [isReading, setIsReading] = useState(false);
  const [showNewSessionBtn, setShowNewSessionBtn] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isMicActive, setIsMicActive] = useState(false);
  const [fullConversation, setFullConversation] = useState([initialMessage]);
  const [isAILoading, setIsAILoading] = useState(false);
  const [response, setresponse] = useState("");
  const [showTimeUpPopup, setShowTimeUpPopup] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // ✅ Manage speech state
  const fullName = sessionStorage.getItem("userName");
  const userName = fullName.split(" ")[0];

  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const navigate = useNavigate();

  const generateRandomID = () => {
    const id = Math.floor(1000 + Math.random() * 9000);
    setRandomID(id);
    setConversationStage("language");
    setCurrentIndex(0);
    setSession([initialMessage]);
  };

  useEffect(() => {
    window.speechSynthesis.cancel();   // ✅ stop any speech on mount
  }, []);

  useEffect(() => {
    // ✅ Reset everything on fresh load
    setSession([initialMessage]);
    setFullConversation([initialMessage.message]);
    setConversationStage("language");
    stageRef.current = "language";
    languageRef.current = "en-IN";
    setRandomID(null);
    setCurrentIndex(0);
    setIsReading(false);
    setShowNewSessionBtn(false);
    setUserInput("");
    setIsMicActive(false);
    setIsAILoading(false);
    setIsTerminated(false);
    setChatStarted(false);
  }, []); // only on mount

  const speakMessage = (text, lang = languageRef.current) => {
    return new Promise((resolve) => {
      if (!text) return resolve();

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;

      // ✅ Make speech slow & natural
      utterance.rate = 0.8;  // slower than before
      utterance.pitch = 1.1;  // slight variation to sound natural

      const voices = window.speechSynthesis.getVoices();

      // ✅ Filter Indian female voice
      let selectedVoice = null;
      if (lang === "en-IN") {
        selectedVoice = voices.find(v => v.lang === "en-IN" && v.name.toLowerCase().includes("female")) ||
          voices.find(v => v.name.toLowerCase().includes("india") && v.name.toLowerCase().includes("female")) ||
          voices.find(v => v.lang === "en-IN") ||
          voices.find(v => v.lang.startsWith("en") && v.name.toLowerCase().includes("female"));
      } else if (lang === "hi-IN") {
        selectedVoice = voices.find(v => v.lang === "hi-IN" && v.name.toLowerCase().includes("female")) ||
          voices.find(v => v.lang.startsWith("hi") && v.name.toLowerCase().includes("female"));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log("🎤 Using Indian Female Voice:", selectedVoice.name);
      } else {
        console.warn("⚠️ No female Indian voice found, using default.");
      }

      setIsSpeaking(true);

      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const speakAndAdd = (message) => {
    return new Promise(async (resolve) => {
      setSession((prev) => [
        ...prev,
        { role: "ai", message, time: new Date().toLocaleTimeString() },
      ]);
      setFullConversation((prev) => [
        ...prev,
        { role: "ai", message, time: new Date().toLocaleTimeString() },
      ]);
      await speakMessage(message); // ✅ native speech
      resolve();
    });
  };

  // API Call
  const { id: topic } = useParams();
  const { getTopicData } = useTopic();
  const userId = parseInt(sessionStorage.getItem("user_id"), 10);
  const topicData = getTopicData;
  const matchedRecord = topicData.find(item => item.user_id === userId);
  const hrId = matchedRecord?.hr_id || null;

  const callChatAPI = async (userInput) => {
    console.log("caht api :", userInput);

    let updatedUserInput = userInput;
    let updatedUserLanguage = "";

    if (isNewSessionRef.current) {
      console.log("🛑 Skipping API call & Typing... because a new session just started");
      isNewSessionRef.current = false;
    }

    if (userInput.toLowerCase() === "english" || userInput.toLowerCase() === "हिंदी" || userInput.toLowerCase() === "hindi") {
      updatedUserInput = "";
    }

    updatedUserLanguage = languageRef.current === "en-IN" ? "English" : "hindi";

    setTimeout(() => {
      if (!isNewSessionRef.current) {
        setIsAILoading(true);
      }
    }, 10000);

    try {
      const response = await fetch("http://122.163.121.176:3004/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: random4DigitID?.toString(),
          topic: topic,
          time: "10 min",
          user_input: updatedUserInput,
          language: updatedUserLanguage
        }),
      });

      const data = await response.json();
      const aiMessage = data?.message || "Invalid Message";

      setresponse(aiMessage);
      setIsAILoading(false);
      await speakAndAdd(aiMessage);
    } catch (error) {
      console.error("API error:", error);
      setIsAILoading(false);
      await speakAndAdd("There was a problem connecting to the server.");
      return;
    }
  };

  const handleUserMessage = async (text) => {
    console.log("User input:", text);
    if (!text.trim()) return;

    setSession((prev) => [...prev, { role: "user", message: text, time: new Date().toLocaleTimeString() }]);
    setFullConversation((prev) => [...prev, { role: "user", message: text, time: new Date().toLocaleTimeString() }]);
    setUserInput("");

    if (stageRef.current === "language") {
      let message = "";
      let validLang = false;
      setIsAILoading(true)

      if (text.toLowerCase().includes("english")) {
        languageRef.current = "en-IN";
        // message = "Great! Let's continue in English. Thank you for your response.";
        try {
          const res = await greettingMessage({
            username: userName,
            topic: topic,
            userinput: "english",
          });
          console.log('res', res);
          const data = await res.json();
          setIsAILoading(false)

          const aiMsg = data?.message
          message = aiMsg || "Great! Let's continue in English. Thank you for your response.";
        } catch (err) {
          console.error("Error fetching greeting:", err);
        }
        validLang = true;
      } else if (text.toLowerCase().includes("hindi") || text.toLowerCase().includes("हिंदी")) {
        languageRef.current = "hi-IN";
        // message = "बहुत बढ़िया! आइए हिंदी में आगे बढ़ते हैं। आपके उत्तर के लिए धन्यवाद।";
        try {
          const res = await greettingMessage({
            username: userName,
            topic: topic,
            userinput: "hindi",
          });
          console.log('res', res);
          const data = await res.json();
          setIsAILoading(false)

          const aiMsg = data?.message
          message = aiMsg || "Great! Let's continue in English. Thank you for your response.";
        } catch (err) {
          console.error("Error fetching greeting:", err);
        }
        validLang = true;
      } else {
        message = "Language not recognized. Please respond with English, हिंदी (Hindi), or বাংলা (Bengali).";
      }

      await speakAndAdd(message);

      if (validLang) {
        setIsAILoading(true)
        callChatAPI(text);
        setConversationStage("awaitingDetails");
        stageRef.current = "awaitingDetails";
      }
    } else {
      await callChatAPI(text);
    }
  };

  useEffect(() => {
    const lowerMsg = response.toLowerCase();
    if (lowerMsg.includes("time is up") || lowerMsg.includes("thank you for the discussion")) {
      // sendFinalConversation();
      saveChatSession({
        userId,
        hrId,
        topic,
        fullConversation
      });
      setIsAILoading(false);
      setIsTerminated(true);
      setTimeout(() => setShowTimeUpPopup(true), 5000);
    }
  }, [response]);
  useEffect(() => {
    if (response !== '') {
      sessionStorage.setItem("aiResponse", response);
      sessionStorage.setItem("fullConversation", JSON.stringify(fullConversation));
      sessionStorage.setItem("topic", topic);
    }
  }, [response]);


  useEffect(() => {
    if (!chatStarted || currentIndex >= session.length || isReading) return;
    const currentChat = session[currentIndex];
    if (currentChat.role === "ai") {
      setIsReading(true);
      speakMessage(currentChat.message).then(() => {
        setIsReading(false);
        setCurrentIndex((prev) => prev + 1);
      });
    } else {
      const timeout = setTimeout(() => setCurrentIndex((prev) => prev + 1), 2000);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, chatStarted, isReading]);

  useEffect(() => {
    stageRef.current = conversationStage;
  }, [conversationStage]);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [session]);

  useEffect(() => {
    if (!listening && transcript.trim().length > 0) {
      handleUserMessage(transcript.trim());
      resetTranscript();
      setIsMicActive(false);
    }
  }, [listening]);

  const gotoPreviousPage = () => navigate('/dashboard/test');
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
              <React.Fragment key={index}>
                <div
                  key={index}
                  className={`flex ${item.role === "ai" ? "items-start" : "justify-end"
                    }`}
                >
                  {item.role === "ai" ? (
                    <div className="max-w-[60%] flex items-start gap-3 px-4 py-3 rounded-r-3xl rounded-b-3xl text-xs bg-gray-200 text-black">
                      <img
                        src={staticImages.aiAvatar}
                        alt="AI"
                        className={`w-8 h-8 rounded-full ${isSpeaking && index === currentIndex
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
                {isAILoading && index === session.length - 1 && (
                  <div className="mb-4 flex items-start">
                    <div className="max-w-[60%] flex items-start gap-3 px-4 py-3 rounded-r-3xl rounded-b-3xl text-xs bg-gray-200 animate-pulse">
                      <img src={staticImages.aiAvatar} alt="AI" className="w-7 h-7 rounded-full opacity-70" />
                      <div className="text-gray-500 italic">Typing...</div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}


            {showNewSessionBtn && (
              <div className="flex justify-center">
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded-xl"
                  onClick={() => {
                    setShowNewSessionBtn(false);
                    setIsTerminated(false);
                    generateRandomID();
                    gotoPreviousPage();
                  }}
                >
                  Do you want to start a new session?
                </button>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className={`flex items-center gap-2 px-4 py-3 ${isTerminated ? "blur-sm pointer-events-none" : ""}`}>
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
                className={`p-2 mr-2 rounded-full ${listening ? "hover:bg-teal-300 animate-pulse" : ""
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
      {showTimeUpPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center w-[350px] space-y-4">
            <p className="text-lg font-medium">Do you want to start a new session?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={() => {
                  setShowTimeUpPopup(false);
                  stopSpeaking(); // ✅ replaced cancel()

                  setSession([initialMessage]);
                  setFullConversation([initialMessage.message]);
                  setConversationStage("language");
                  stageRef.current = "language";
                  languageRef.current = "en-IN";
                  setRandomID(null);
                  setCurrentIndex(0);
                  setIsReading(false);
                  setUserInput("");
                  setIsMicActive(false);
                  setIsAILoading(false);
                  setIsTerminated(false);
                  setresponse("");
                  isNewSessionRef.current = true;

                  generateRandomID();
                  setChatStarted(true);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextReader;