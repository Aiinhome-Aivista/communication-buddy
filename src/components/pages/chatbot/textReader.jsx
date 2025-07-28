import React, { useRef, useState, useEffect } from 'react';
import { chatSession } from "../../../data/chatSession";
import { staticImages } from "../../../utils/Constant";

const TextReader = ({ chatStarted, setChatStarted, isTerminated, setIsTerminated }) => {
    const chatRef = useRef(null);
    const recognitionRef = useRef(null); // optional mic setup
    const stageRef = useRef("language"); // to tr

    const [random4DigitID, setRandomID] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [conversationStage, setConversationStage] = useState("language");
    const [sessionController, setSessionController] = useState(0);

    const [session, setSession] = useState([chatSession[0]]);
    const [isReading, setIsReading] = useState(false);
    const [isAILoading, setIsAILoading] = useState(false);
    const [showNewSessionBtn, setShowNewSessionBtn] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [isMicActive, setIsMicActive] = useState(false);

    const generateRandomID = () => {
        const id = Math.floor(1000 + Math.random() * 9000);
        setRandomID(id);
        setConversationStage("language");
        setSessionController(0);
        setCurrentIndex(0);
    };

    // Function to speak a message and add to session
    const speakAndAdd = async (message) => {
        return new Promise((resolve) => {
            const utter = new SpeechSynthesisUtterance(message);
            utter.onend = () => resolve();
            window.speechSynthesis.speak(utter);

            setSession((prev) => [
                ...prev,
                { role: "ai", message, time: new Date().toLocaleTimeString() },
            ]);
        });
    };

    const handleUserMessage = async (text) => {
        if (!text) return;

        const userMsg = {
            role: "user",
            message: text,
            time: new Date().toLocaleTimeString(),
        };

        setSession((prev) => [...prev, userMsg]);
        setUserInput("");

        // Stage 1: Language selection
        if (stageRef.current === "language") {
            let message = "";
            let validLang = false;

            if (text.toLowerCase().includes("english")) {
                message = "Great! Let's continue in English. Thank you for your response.";
                validLang = true;
            }
            else if (text.toLowerCase().includes("hindi") || text.toLowerCase().includes("हिंदी")) {
                message = "बहुत बढ़िया! कृपया अपना नाम और ईमेल साझा करें।";
                validLang = true;
            } else {
                message = "Language not recognized. Please respond with English or हिंदी (Hindi).";
            }

            await speakAndAdd(message);

            if (validLang) {
                setConversationStage("awaitingDetails");
                stageRef.current = "awaitingDetails";
            }
        }
        // Add other stages as needed...
    };

    // Handle chat progression with audio
    useEffect(() => {
        if (!chatStarted || currentIndex >= session.length || isReading) return;

        const currentChat = session[currentIndex];

        if (currentChat.role === "ai") {
            const utter = new SpeechSynthesisUtterance(currentChat.message);
            utter.onend = () => {
                setIsReading(false);
                setCurrentIndex((prev) => prev + 1);
            };

            window.speechSynthesis.cancel();
            setIsReading(true);
            window.speechSynthesis.speak(utter);
        } else {
            const timeout = setTimeout(() => {
                setCurrentIndex((prev) => prev + 1);
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, isReading, chatStarted]);

    // Update stage ref when conversation stage changes
    useEffect(() => {
        stageRef.current = conversationStage;
    }, [conversationStage]);

    // Scroll to bottom on new message
    useEffect(() => {
        chatRef.current?.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [session]);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) return;
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        handleUserMessage(transcript);
        setIsRecording(false);
        };

        recognition.onerror = () => setIsRecording(false);
        recognitionRef.current = recognition;
    }, []);
    
    return (
        <div className="flex flex-col h-[calc(90vh-100px)] px-4 pt-4">
            {!chatStarted ? (
                // Start Chat Button
                <div className="flex-1 flex items-center justify-center h-full">
                    <button
                        className="bg-teal-600/40 px-6 py-3 rounded-xl text-white cursor-pointer hover:bg-teal-700/50 transition-colors outline-2 hover:outline-teal-400 hover:outline-offset-3"
                        onClick={() => {
                            setChatStarted(true);
                            generateRandomID();
                        }}
                    >
                        Start Session
                    </button>
                </div>
            ) : (
                // Chat UI
                <div className="flex flex-col flex-1 overflow-hidden  shadow-sm">
                    {/* Chat messages */}
                    <div
                        ref={chatRef}
                        className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4"
                    >
                        {session.map((item, index) => (
                            <div key={index} className={`flex ${item.role === "ai" ? "items-start" : "justify-end"}`}>
                                {item.role === "ai" ? (
                                    <div className="max-w-[60%] flex items-start gap-3 px-4 py-3 rounded-r-3xl rounded-b-3xl text-xs bg-gray-200 text-black">
                                        <img
                                            src={staticImages.aiAvatar}
                                            alt="AI"
                                            className={`w-8 h-8 rounded-full ${isReading && index === currentIndex ? "animate-pulse" : ""}`}
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

                        {/* AI Typing Loader */}
                        {isAILoading && (
                            <div className="flex items-start">
                                <div className="max-w-[60%] flex items-start gap-3 px-4 py-3 rounded-r-3xl rounded-b-3xl text-xs bg-gray-200 animate-pulse">
                                    <img
                                        src={staticImages.aiAvatar}
                                        alt="AI"
                                        className="w-7 h-7 rounded-full opacity-70"
                                    />
                                    <div className="text-[#999] italic">Typing...</div>
                                </div>
                            </div>
                        )}

                        {/* New Session Button */}
                        {showNewSessionBtn && (
                            <div className="flex justify-center">
                                <button
                                    className="bg-blue-500 text-white px-6 py-2 rounded-xl"
                                    onClick={() => {
                                        setShowNewSessionBtn(false);
                                        setIsTerminated(false);
                                        setSession([chatSession[0]]);
                                        generateRandomID();
                                    }}
                                >
                                    Do you want to start a new session?
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="flex items-center gap-2 px-4 py-3 ">
                        <div className="flex flex-1 items-center bg-gray-100 px-3 py-2 rounded-2xl">
                            <input
                                type="text"
                                className="flex-1 py-2 px-4 bg-transparent outline-none text-sm"
                                placeholder="Type here"
                                value={userInput}
                                disabled={isTerminated}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleUserMessage(userInput);
                                    }
                                }}
                            />

                            {/* Mic Button */}
                            <button
                                disabled={isTerminated}
                                className={`p-2 mr-2 rounded-full ${isRecording ? ' hover:bg-gray-300 animate-pulse' : ''}`}
                                onClick={() => {
                                    if (isRecording) return;
                                    setIsRecording(true);
                                    recognitionRef.current?.start();
                                }}
                            >
                                <img
                                    src={isMicActive ? staticImages.activemic : staticImages.mic}
                                    alt="Mic"
                                    className={`h-5 w-5 ${isMicActive ? 'opacity-100' : 'opacity-60'}`}
                                    style={isMicActive ? { filter: 'invert(20%) sepia(13%) saturate(732%) hue-rotate(203deg) brightness(96%) contrast(88%)' } : {}}
                                />
                            </button>

                            {/* Camera Button */}
                            <button className="p-2 rounded-full hover:bg-gray-300" disabled>
                                <img src={staticImages.camera} alt="Camera" className="h-5 w-5 opacity-60" />
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
}
export default TextReader;