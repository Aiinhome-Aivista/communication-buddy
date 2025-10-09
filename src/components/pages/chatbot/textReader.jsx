import React, { useRef, useState, useEffect } from "react";
import { chatSession } from "../../../data/chatSession";
import { staticImages } from "../../../utils/Constant";
import { useContext } from "react";
import { UserContext } from "../../../context/Context";
import Loader from '../../ui/Loader';
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
  const [voiceGender, setVoiceGender] = useState("female"); // ✅ Voice gender preference (default female)
  const fullName = sessionStorage.getItem("userName");
  const userName = fullName.split(" ")[0];

  const { userData } = useContext(UserContext);

  console.log("userData", userData);



  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!userData?.session_time) return;

    const targetTime = new Date(userData.session_time).getTime();

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft("Please refresh the page to start a new session");
        return;
      }

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [userData?.session_time]);


  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const speechTimerRef = useRef(null);
  // When true, the effect that auto-commits transcript on listening=false should skip one commit.
  const ignoreNextTranscriptCommitRef = useRef(false);
  // Auto-send delay (ms) after silence when mic is on. Per user request, set to 5000ms (5s).
  const AUTO_SEND_DELAY_MS = 5000;
  const navigate = useNavigate();

  const generateRandomID = () => {
    const id = Math.floor(1000 + Math.random() * 9000);
    setRandomID(id);
    setConversationStage("language");
    setCurrentIndex(0);
    setSession([initialMessage]);
  };

  // Session timer refs/state
  const sessionTimerRef = useRef(null);
  const sessionStartRef = useRef(null);
  const [sessionTotalTime, setSessionTotalTime] = useState(null); // minutes
  const [sessionExpired, setSessionExpired] = useState(false);


  useEffect(() => {
    window.speechSynthesis.cancel();   // ✅ stop any speech on mount

    // ✅ Clear localStorage on fresh load for clean state
    localStorage.removeItem("voiceGender");

    // ✅ Set default voice gender to female
    const defaultGender = "female";
    localStorage.setItem("voiceGender", defaultGender);
    setVoiceGender(defaultGender);
    console.log("🎵 Fresh session - Voice gender reset to:", defaultGender);

    // ✅ Initialize voices for better cross-browser support
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', () => {
        console.log('🎤 Voices loaded:', window.speechSynthesis.getVoices().length);
      }, { once: true });
    }

    // ✅ Add debugging functions to window for troubleshooting
    window.debugVoice = {
      getCurrentGender: () => voiceGender,
      getStoredGender: () => localStorage.getItem("voiceGender"),
      listVoices: () => window.speechSynthesis.getVoices(),
      forceUpdate: forceVoiceGenderUpdate,
      testVoice: (gender) => {
        localStorage.setItem("voiceGender", gender);
        window.dispatchEvent(new CustomEvent("voiceGenderChanged"));
      },
      clearStorage: () => {
        localStorage.removeItem("voiceGender");
        console.log("🧹 Voice storage cleared");
      }
    };
    console.log("🛠️ Debug functions available: window.debugVoice");
  }, []);

  // ✅ Listen for voice gender changes from header  
  useEffect(() => {
    const savedVoiceGender = localStorage.getItem("voiceGender") || "female";
    if (voiceGender !== savedVoiceGender) {
      setVoiceGender(savedVoiceGender);
      console.log("🔄 Voice gender synchronized from localStorage:", savedVoiceGender);
    }
  }, [voiceGender]);

  // ✅ Enhanced voice gender change handler with localStorage clearing
  useEffect(() => {
    const handleVoiceGenderChange = () => {
      const newGender = localStorage.getItem("voiceGender") || "female";
      const currentGender = voiceGender;

      console.log("🎵 Voice gender change event received:", { currentGender, newGender });

      if (currentGender !== newGender) {
        // ✅ Stop any current speech before changing voice
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
          console.log("🛑 Stopped current speech for voice change");
        }

        setVoiceGender(newGender);
        console.log("✅ Voice gender updated from", currentGender, "to", newGender, "- will apply immediately to next response");

        // ✅ Optional: Test the new voice with a quick sample (uncomment if needed)
        // setTimeout(() => {
        //   speakMessage(`Voice changed to ${newGender}`);
        // }, 500);
      } else {
        console.log("ℹ️ Voice gender already set to:", newGender);
      }
    };

    // ✅ Enhanced localStorage synchronization with immediate updates
    const checkVoiceGender = () => {
      const currentGenderInStorage = localStorage.getItem("voiceGender") || "female";
      if (voiceGender !== currentGenderInStorage) {
        console.log("🔄 Detected voice gender mismatch, syncing immediately:", voiceGender, "→", currentGenderInStorage);

        // Stop current speech if any
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
        }

        setVoiceGender(currentGenderInStorage);
      }
    };

    window.addEventListener("voiceGenderChanged", handleVoiceGenderChange);

    // Check more frequently for better responsiveness (every 1 second)
    const syncInterval = setInterval(checkVoiceGender, 1000);

    return () => {
      window.removeEventListener("voiceGenderChanged", handleVoiceGenderChange);
      clearInterval(syncInterval);
    };
  }, [voiceGender]);

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

  // Read configured total_time from sessionStorage (set by TopicProvider) on mount
  useEffect(() => {
    const t = sessionStorage.getItem('session_total_time');
    if (t) {
      const n = Number(t);
      if (!isNaN(n)) setSessionTotalTime(n);
    }
  }, []);

  // Start session timer when chatStarted becomes true
  useEffect(() => {
    if (!chatStarted) return;
    // record start time
    sessionStartRef.current = Date.now();

    // clear any existing
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);

    // tick every second to check elapsed minutes
    sessionTimerRef.current = setInterval(() => {
      if (!sessionStartRef.current || sessionTotalTime == null) return;
      const elapsedMs = Date.now() - sessionStartRef.current;
      const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));
      // when elapsed minutes >= configured total time, end session and show popup
      if (elapsedMinutes >= Number(sessionTotalTime)) {
        clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
        setIsAILoading(false);
        setIsTerminated(true);
        setSessionExpired(true);
        setShowTimeUpPopup(true);
      }
    }, 1000);

    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, [chatStarted, sessionTotalTime]);

  const sanitizeTextForSpeech = (text) => {
    if (!text) return "";

    // Enhanced text processing for more natural speech
    return text
      // Remove all emoji and special symbols
      .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
      // Replace common abbreviations with full words for better pronunciation
      .replace(/\bu\.s\.a\b/gi, "United States of America")
      .replace(/\bu\.k\b/gi, "United Kingdom")
      .replace(/\betc\b/gi, "etcetera")
      .replace(/\bvs\b/gi, "versus")
      .replace(/\be\.g\b/gi, "for example")
      .replace(/\bi\.e\b/gi, "that is")
      .replace(/\bw\.r\.t\b/gi, "with respect to")
      // Add natural pauses for better flow
      .replace(/\.\s+/g, ". ")  // Ensure proper pause after periods
      .replace(/,\s*/g, ", ")   // Ensure pause after commas
      .replace(/;\s*/g, "; ")   // Ensure pause after semicolons
      .replace(/:\s*/g, ": ")   // Ensure pause after colons
      // Handle numbers for better pronunciation
      .replace(/\b(\d{4})\b/g, (match, year) => {
        const num = parseInt(year);
        if (num >= 1000 && num <= 2100) {
          // Pronounce years naturally
          return year;
        }
        return match;
      })
      // Clean up whitespace and line breaks
      .replace(/[\r\n]+/g, " ")  // replace newlines with space
      .replace(/\s+/g, " ")      // collapse multiple spaces
      .trim();
  };

  const speakMessage = (cleanText, lang = languageRef.current) => {
    return new Promise((resolve) => {
      if (!cleanText) return resolve();

      const text = sanitizeTextForSpeech(cleanText);
      if (!text) return resolve();

      window.speechSynthesis.cancel();

      // ✅ Ensure voices are loaded before proceeding (Browser compatibility)
      const waitForVoices = () => {
        return new Promise((voiceResolve) => {
          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            voiceResolve(voices);
          } else {
            // Different browsers handle voice loading differently
            let attempts = 0;
            const maxAttempts = 10;

            const checkVoices = () => {
              const voices = window.speechSynthesis.getVoices();
              if (voices.length > 0) {
                voiceResolve(voices);
              } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(checkVoices, 200);
              } else {
                // Final attempt with voiceschanged event
                const handleVoicesChanged = () => {
                  window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
                  voiceResolve(window.speechSynthesis.getVoices());
                };
                window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);

                // Fallback timeout for stubborn browsers
                setTimeout(() => {
                  window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
                  voiceResolve(window.speechSynthesis.getVoices());
                }, 2000);
              }
            };

            checkVoices();
          }
        });
      };

      waitForVoices().then((voices) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;

        // ✅ Enhanced voice settings for natural Indian speech
        utterance.rate = 0.80;   // Optimal speed for Indian accent clarity
        utterance.pitch = 0.9;   // Slightly lower pitch for warmer, more natural tone
        utterance.volume = 0.8;  // Clear but not overwhelming volume

        // Browser-specific adjustments for Indian voices
        const isChrome = /Chrome/.test(navigator.userAgent);
        const isFirefox = /Firefox/.test(navigator.userAgent);
        const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
        const isEdge = /Edg/.test(navigator.userAgent);

        if (isFirefox) {
          utterance.rate = 0.8; // Firefox tends to be faster, slow down more
          utterance.pitch = 0.85; // Lower pitch for Firefox
        } else if (isSafari) {
          utterance.rate = 0.9; // Safari handles speech well
          utterance.pitch = 0.95; // Keep slightly higher pitch for Safari
        } else if (isEdge) {
          utterance.rate = 0.82; // Edge specific adjustments
          utterance.pitch = 0.88;
        }

        // ✅ Enhanced Indian voice selection with natural tone priority
        let selectedVoice = null;

        // ✅ Improved gender detection for Indian voices
        const isLikelyMaleVoice = (voice) => {
          const name = voice.name.toLowerCase();

          // Specific Indian male voice names
          const indianMaleNames = [
            'ravi', 'hemant', 'arjun', 'kiran', 'raj', 'suresh', 'mohan',
            'kumar', 'singh', 'sharma', 'gupta', 'male', 'man'
          ];

          // Specific Indian female voice names  
          const indianFemaleNames = [
            'heera', 'priya', 'sunita', 'kavya', 'ananya', 'shreya', 'pooja',
            'meera', 'sita', 'female', 'woman', 'lady'
          ];

          // Check for explicit male indicators
          const hasMaleIndicator = indianMaleNames.some(keyword => name.includes(keyword));
          const hasFemaleIndicator = indianFemaleNames.some(keyword => name.includes(keyword));

          if (hasMaleIndicator) return true;
          if (hasFemaleIndicator) return false;

          // For voices without clear gender indicators, use additional heuristics
          // Microsoft voices often have gender in description
          if (name.includes('microsoft')) {
            // Default assumption for ambiguous Microsoft voices
            return !name.includes('aria') && !name.includes('jenny') && !name.includes('emma');
          }

          // Default to male for ambiguous cases (many system defaults are male)
          return true;
        };

        console.log("🎤 Selecting natural Indian voice for:", { lang, gender: voiceGender });
        console.log("🎤 Available voices:", voices.length, voices.map(v => ({ name: v.name, lang: v.lang })));

        if (lang === "en-IN") {
          // ✅ Priority order for natural Indian English voices
          const naturalIndianVoices = voices.filter(v => {
            const name = v.name.toLowerCase();
            return (
              v.lang === "en-IN" ||
              name.includes("india") ||
              name.includes("ravi") ||
              name.includes("heera") ||
              name.includes("hemant") ||
              name.includes("priya") ||
              (name.includes("microsoft") && name.includes("desktop"))
            );
          });

          const premiumVoices = voices.filter(v => {
            const name = v.name.toLowerCase();
            return (
              name.includes("neural") ||
              name.includes("premium") ||
              name.includes("natural") ||
              (name.includes("microsoft") && name.includes("neural"))
            );
          });

          const englishVoices = voices.filter(v => v.lang.startsWith("en"));

          console.log("🇮🇳 Natural Indian voices found:", naturalIndianVoices.length, naturalIndianVoices.map(v => v.name));
          console.log("⭐ Premium voices found:", premiumVoices.length, premiumVoices.map(v => v.name));

          if (voiceGender === "male") {
            selectedVoice =
              // Top priority: Natural Indian male voices
              naturalIndianVoices.find(v => isLikelyMaleVoice(v)) ||
              // Specific high-quality Indian male voices
              voices.find(v => v.name.toLowerCase().includes("ravi") && v.name.toLowerCase().includes("desktop")) ||
              voices.find(v => v.name.toLowerCase().includes("hemant")) ||
              // Premium male voices with Indian accent capability
              premiumVoices.find(v => v.lang === "en-IN" && isLikelyMaleVoice(v)) ||
              premiumVoices.find(v => v.lang.startsWith("en") && isLikelyMaleVoice(v)) ||
              // Any Indian voice that sounds male
              naturalIndianVoices.find(v => !v.name.toLowerCase().includes("female")) ||
              // General English male voices as fallback
              englishVoices.find(v => isLikelyMaleVoice(v)) ||
              englishVoices.find(v => !v.name.toLowerCase().includes("female")) ||
              // Last resort
              voices[0];
          } else {
            selectedVoice =
              // Top priority: Natural Indian female voices
              naturalIndianVoices.find(v => !isLikelyMaleVoice(v)) ||
              // Specific high-quality Indian female voices
              voices.find(v => v.name.toLowerCase().includes("heera") && v.name.toLowerCase().includes("desktop")) ||
              voices.find(v => v.name.toLowerCase().includes("priya")) ||
              voices.find(v => v.name.toLowerCase().includes("sunita")) ||
              // Premium female voices with clear, natural tone
              premiumVoices.find(v => v.lang === "en-IN" && !isLikelyMaleVoice(v)) ||
              voices.find(v => v.name.toLowerCase().includes("aria") && v.lang.startsWith("en")) ||
              voices.find(v => v.name.toLowerCase().includes("jenny") && v.lang.startsWith("en")) ||
              premiumVoices.find(v => v.lang.startsWith("en") && !isLikelyMaleVoice(v)) ||
              // Any female-sounding Indian voice
              naturalIndianVoices.find(v => v.name.toLowerCase().includes("female")) ||
              // General English female voices as fallback
              englishVoices.find(v => !isLikelyMaleVoice(v)) ||
              englishVoices.find(v => v.name.toLowerCase().includes("female")) ||
              // Fallback to any available voice
              voices[0];
          }
        } else if (lang === "hi-IN") {
          // ✅ Enhanced Hindi voice selection for natural Indian tone
          const hindiVoices = voices.filter(v => {
            const name = v.name.toLowerCase();
            return (
              v.lang.startsWith("hi") ||
              name.includes("hindi") ||
              name.includes("bharat") ||
              (name.includes("microsoft") && v.lang === "hi-IN")
            );
          });

          const premiumHindiVoices = hindiVoices.filter(v => {
            const name = v.name.toLowerCase();
            return (
              name.includes("neural") ||
              name.includes("premium") ||
              name.includes("natural") ||
              name.includes("desktop")
            );
          });

          console.log("🇮🇳 Hindi voices found:", hindiVoices.length, hindiVoices.map(v => v.name));
          console.log("⭐ Premium Hindi voices found:", premiumHindiVoices.length, premiumHindiVoices.map(v => v.name));

          if (voiceGender === "male") {
            selectedVoice =
              // Premium Hindi male voices
              premiumHindiVoices.find(v => isLikelyMaleVoice(v)) ||
              // Standard Hindi male voices
              hindiVoices.find(v => isLikelyMaleVoice(v)) ||
              hindiVoices.find(v => !v.name.toLowerCase().includes("female")) ||
              // Fallback to any Hindi voice
              hindiVoices[0] ||
              voices[0];
          } else {
            selectedVoice =
              // Premium Hindi female voices
              premiumHindiVoices.find(v => !isLikelyMaleVoice(v)) ||
              // Standard Hindi female voices
              hindiVoices.find(v => !isLikelyMaleVoice(v)) ||
              hindiVoices.find(v => v.name.toLowerCase().includes("female")) ||
              // Fallback to any Hindi voice
              hindiVoices[0] ||
              voices[0];
          }
        } else if (lang === "bn-IN" || lang === "bn-BD") {
          // ✅ Enhanced Bengali voice support with natural tone priority
          const bengaliVoices = voices.filter(v => {
            const name = v.name.toLowerCase();
            return (
              v.lang.startsWith("bn") ||
              name.includes("bengali") ||
              name.includes("bangla") ||
              name.includes("bangladesh") ||
              (name.includes("microsoft") && v.lang.startsWith("bn"))
            );
          });

          const premiumBengaliVoices = bengaliVoices.filter(v => {
            const name = v.name.toLowerCase();
            return (
              name.includes("neural") ||
              name.includes("premium") ||
              name.includes("natural") ||
              name.includes("desktop")
            );
          });

          console.log("🇧🇩 Bengali voices found:", bengaliVoices.length, bengaliVoices.map(v => v.name));
          console.log("⭐ Premium Bengali voices found:", premiumBengaliVoices.length, premiumBengaliVoices.map(v => v.name));

          if (voiceGender === "male") {
            selectedVoice =
              // Premium Bengali male voices
              premiumBengaliVoices.find(v => isLikelyMaleVoice(v)) ||
              // Standard Bengali male voices
              bengaliVoices.find(v => isLikelyMaleVoice(v)) ||
              bengaliVoices.find(v => !v.name.toLowerCase().includes("female")) ||
              // Fallback to any Bengali voice
              bengaliVoices[0] ||
              // Fallback to Indian English male voices if no Bengali available
              voices.find(v => v.lang === "en-IN" && isLikelyMaleVoice(v)) ||
              voices[0];
          } else {
            selectedVoice =
              // Premium Bengali female voices
              premiumBengaliVoices.find(v => !isLikelyMaleVoice(v)) ||
              // Standard Bengali female voices
              bengaliVoices.find(v => !isLikelyMaleVoice(v)) ||
              bengaliVoices.find(v => v.name.toLowerCase().includes("female")) ||
              // Fallback to any Bengali voice
              bengaliVoices[0] ||
              // Fallback to Indian English female voices if no Bengali available
              voices.find(v => v.lang === "en-IN" && !isLikelyMaleVoice(v)) ||
              voices[0];
          }
        }

        if (selectedVoice) {
          utterance.voice = selectedVoice;
          console.log("🎤 ✅ Using Voice:", {
            name: selectedVoice.name,
            lang: selectedVoice.lang,
            requestedGender: voiceGender,
            actuallyMale: isLikelyMaleVoice(selectedVoice),
            genderMatch: (voiceGender === "male") === isLikelyMaleVoice(selectedVoice)
          });
        } else {
          console.warn("⚠️ No suitable voice found for:", { lang, voiceGender, availableVoices: voices.length });
          console.warn("⚠️ Using system default voice");
        }

        setIsSpeaking(true);

        utterance.onend = () => {
          setIsSpeaking(false);
          resolve();
        };

        utterance.onerror = (error) => {
          console.error("Speech synthesis error:", error);
          setIsSpeaking(false);
          resolve();
        };

        // ✅ Enhanced speech synthesis with voice verification
        setTimeout(() => {
          // Verify the voice is still selected correctly before speaking
          if (selectedVoice && utterance.voice !== selectedVoice) {
            console.warn("⚠️ Voice changed during setup, reapplying:", selectedVoice.name);
            utterance.voice = selectedVoice;
          }

          try {
            window.speechSynthesis.speak(utterance);
            console.log("🎤 Speech started with voice:", utterance.voice?.name || "default");
          } catch (error) {
            console.error("❌ Error starting speech synthesis:", error);
            setIsSpeaking(false);
            resolve();
          }
        }, 100);
      });
    });
  };


  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // ✅ Function to replay last AI message with new voice
  const replayLastMessageWithNewVoice = () => {
    if (session.length > 0) {
      const lastAIMessage = session.slice().reverse().find(msg => msg.role === "ai");
      if (lastAIMessage) {
        console.log("🔄 Replaying last AI message with new voice gender:", voiceGender);
        speakMessage(lastAIMessage.message);
      }
    }
  };

  // ✅ Enhanced force voice gender update for testing/debugging
  const forceVoiceGenderUpdate = () => {
    const currentGender = localStorage.getItem("voiceGender") || "female";
    console.log("🔄 Forcing voice gender update to:", currentGender);

    // Stop any current speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    setVoiceGender(currentGender);

    // Test with a sample message to verify voice change
    setTimeout(() => {
      speakMessage(`Voice gender is now set to ${currentGender}. This is a test of the current voice.`);
    }, 500);
  };

  const speakAndAdd = (message) => {
    return new Promise(async (resolve) => {
      // Mark this message as already spoken so the session playback doesn't double-speak it
      const entry = { role: "ai", message, time: new Date().toLocaleTimeString(), spoken: true };
      setSession((prev) => [
        ...prev,
        entry,
      ]);
      setFullConversation((prev) => [
        ...prev,
        entry,
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
      console.log(" Skipping API call & Typing... because a new session just started");
      isNewSessionRef.current = false;
    }
    if (
      userInput.toLowerCase() === "english" ||
      userInput.toLowerCase() === "हिंदी" ||
      userInput.toLowerCase() === "hindi" ||
      userInput.toLowerCase() === "spanish" ||
      userInput.toLowerCase() === "español" ||
      userInput.toLowerCase() === "french" ||
      userInput.toLowerCase() === "français"
    ) {
      updatedUserInput = "";
    }

    //  Map languageRef.current → readable language for API
    switch (languageRef.current) {
      case "en-IN":
        updatedUserLanguage = "English";
        break;
      case "hi-IN":
        updatedUserLanguage = "Hindi";
        break;
      case "es-ES":
        updatedUserLanguage = "Spanish";
        break;
      case "fr-FR":
        updatedUserLanguage = "French";
        break;
      default:
        updatedUserLanguage = "English";
    }

    // Show loading/typing immediately when starting the API call
    setIsAILoading(true);

    try {
      const response = await fetch("https://aiinhome.com/communication/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: random4DigitID?.toString(),
          topic: topic,
          time: userData.total_time,
          user_input: updatedUserInput,
          language: updatedUserLanguage
        }),
      });

      const data = await response.json();
      const aiMessage = data?.message || "Invalid Message";

      setresponse(aiMessage);
      // Add the AI message and speak it, then clear the typing state
      await speakAndAdd(aiMessage);
      setIsAILoading(false);
    } catch (error) {
      console.error("API error:", error);
      // On error, speak the error reply and then clear typing
      await speakAndAdd("Oops..I missed that one, Can you repeat please?");
      setIsAILoading(false);
      return;
    }
  };

  const handleUserMessage = async (text) => {
    console.log("User input:", text);
    if (!text.trim()) return;

    setSession((prev) => [
      ...prev,
      { role: "user", message: text, time: new Date().toLocaleTimeString() }
    ]);
    setFullConversation((prev) => [
      ...prev,
      { role: "user", message: text, time: new Date().toLocaleTimeString() }
    ]);
    setUserInput("");

    if (stageRef.current === "language") {
      let message = "";
      let validLang = false;
      setIsAILoading(true);

      //  English
      if (text.toLowerCase().includes("english")) {
        languageRef.current = "en-IN";
        try {
          const res = await greettingMessage({
            username: userName,
            topic: topic,
            userinput: "english",
          });
          const data = await res.json();
          setIsAILoading(false);
          const aiMsg = data?.message;
          message = aiMsg || "Great! Let's continue in English. Thank you for your response.";
        } catch (err) {
          console.error("Error fetching greeting:", err);
        }
        validLang = true;

        //  Hindi
      } else if (text.toLowerCase().includes("hindi") || text.toLowerCase().includes("हिंदी")) {
        languageRef.current = "hi-IN";
        try {
          const res = await greettingMessage({
            username: userName,
            topic: topic,
            userinput: "hindi",
          });
          const data = await res.json();
          setIsAILoading(false);
          const aiMsg = data?.message;
          message = aiMsg || "बहुत बढ़िया! आइए हिंदी में आगे बढ़ते हैं। आपके उत्तर के लिए धन्यवाद।";
        } catch (err) {
          console.error("Error fetching greeting:", err);
        }
        validLang = true;

        //  Spanish
      } else if (text.toLowerCase().includes("spanish") || text.toLowerCase().includes("español")) {
        languageRef.current = "es-ES";
        try {
          const res = await greettingMessage({
            username: userName,
            topic: topic,
            userinput: "spanish",
          });
          const data = await res.json();
          setIsAILoading(false);
          const aiMsg = data?.message;
          message = aiMsg || "¡Genial! Continuemos en español. Gracias por tu respuesta.";
        } catch (err) {
          console.error("Error fetching greeting:", err);
        }
        validLang = true;

        // French
      } else if (text.toLowerCase().includes("french") || text.toLowerCase().includes("français")) {
        languageRef.current = "fr-FR";
        try {
          const res = await greettingMessage({
            username: userName,
            topic: topic,
            userinput: "french",
          });
          const data = await res.json();
          setIsAILoading(false);
          const aiMsg = data?.message;
          message = aiMsg || "Super ! Continuons en français. Merci pour votre réponse.";
        } catch (err) {
          console.error("Error fetching greeting:", err);
        }
        validLang = true;

      } else {
        //  If language not recognized
        message =
          "Language not recognized. Please respond with English, हिंदी (Hindi), Español (Spanish), or Français (French).";
      }

      await speakAndAdd(message);

      if (validLang) {
        setIsAILoading(true);
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
    // Skip messages that were already spoken (e.g., added via speakAndAdd)
    if (currentChat.role === "ai" && !currentChat.spoken) {
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

  // ✅ Helper function to get appropriate avatar based on voice gender
  const getAvatarImage = () => {
    return voiceGender === "female" ? staticImages.femaleAvater : staticImages.aiAvatar;
  };

  useEffect(() => {
    if (!listening) {
      // If we explicitly asked to ignore the next auto-commit (e.g., just started listening), skip it once
      if (ignoreNextTranscriptCommitRef.current) {
        ignoreNextTranscriptCommitRef.current = false;
        return;
      }

      if (transcript.trim().length > 0) {
        // If recognition stopped unexpectedly (not via our debounce handler), commit any pending transcript
        handleUserMessage(transcript.trim());
        resetTranscript();
        setIsMicActive(false);
      }
    }
  }, [listening]);

  // Debounce interim transcript updates so long sentences are captured fully.
  useEffect(() => {
    // Only debounce while actively listening
    if (!listening) return;

    const text = transcript.trim();
    if (!text) return;

    // Reset existing timer
    if (speechTimerRef.current) {
      clearTimeout(speechTimerRef.current);
    }

    // Wait for configured silence duration before finalizing the transcript
    speechTimerRef.current = setTimeout(() => {
      // We're going to manually commit the transcript; ensure the auto-listening-change handler doesn't duplicate it
      ignoreNextTranscriptCommitRef.current = true;

      // Finalize: stop listening and send the message
      try {
        SpeechRecognition.stopListening();
      } catch (err) {
        console.warn('Error stopping SpeechRecognition after debounce:', err);
      }
      handleUserMessage(text);
      resetTranscript();
      setIsMicActive(false);
      speechTimerRef.current = null;
    }, AUTO_SEND_DELAY_MS);

    return () => {
      if (speechTimerRef.current) {
        clearTimeout(speechTimerRef.current);
        // don't null here; we'll null when the timer actually fires or when stopping
      }
    };
  }, [transcript, listening]);



  const gotoPreviousPage = () => navigate('/dashboard/test');
  return (


    <div className="flex flex-col h-[calc(90vh-100px)] px-4 pt-4">
      {Object.keys(userData).length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-4xl font-bold text-teal-500">Welcome {userName}  to your dashboard! </div>
        </div>// Empty state
      ) : (
        <>
          {userData.status === "upcoming" && <div className="flex flex-1 items-center justify-center">
            {/* <div className="text-4xl font-bold text-teal-500">Remaining time to start {timeLeft}</div> */}
            <div className="text-4xl font-bold text-teal-500">
              {timeLeft === "Please refresh the page to start a new session"
                ? timeLeft
                : `Remaining time to start ${timeLeft}`}
            </div>

          </div>}
          {userData.status === "ongoing" && <div className="flex flex-col h-[calc(90vh-100px)] px-4 pt-4"> {!chatStarted ? (
            <div className="flex-1 flex items-center justify-center h-full">
              <button
                className="bg-gray-200 px-6 py-3 rounded-xl text-black cursor-pointer hover:bg-gray-500"
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
                            src={getAvatarImage()}
                            alt={`AI ${voiceGender}`}
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
                    {isAILoading && index === session.length - 1 && session[session.length - 1]?.role === 'user' && (
                      <div className="mb-4 flex items-start">
                        <div className="max-w-[60%] flex items-start gap-3 px-4 py-3 rounded-r-3xl rounded-b-3xl text-xs bg-gray-200 animate-pulse">
                          <img src={getAvatarImage()} alt={`AI ${voiceGender}`} className="w-7 h-7 rounded-full opacity-70" />
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
                    className={`p-2 mr-2 rounded-full ${listening ? "hover:bg-teal-300 animate-pulse" : ""}`}
                    onClick={() => {
                      if (listening) {
                        // User intentionally stopped the mic — allow commit of any captured transcript
                        ignoreNextTranscriptCommitRef.current = false;
                        SpeechRecognition.stopListening();
                        setIsMicActive(false);
                        if (speechTimerRef.current) {
                          clearTimeout(speechTimerRef.current);
                          speechTimerRef.current = null;
                        }
                        return;
                      }
                      // Clear any stale transcript before starting fresh listening session
                      try {
                        resetTranscript();
                      } catch (err) {
                        console.warn('resetTranscript not available:', err);
                      }
                      // Ensure we don't auto-commit any previous transcript when listening toggles
                      ignoreNextTranscriptCommitRef.current = true;
                      setIsMicActive(true);
                      SpeechRecognition.startListening({
                        continuous: true,
                        interimResults: true,
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
                  {sessionExpired ? (
                    <>
                      <p className="text-lg font-medium">Your session time has expired.</p>
                      <div className="flex justify-center">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                          onClick={() => {
                            setShowTimeUpPopup(false);
                            stopSpeaking(); // ✅ replaced cancel()
                            // Close session and navigate back to dashboard
                            // navigate("/dashboard/");
                          }}
                        >
                          OK
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
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
                        {/* NO button */}
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                          onClick={() => {
                            setShowTimeUpPopup(false);
                            navigate("/dashboard/");
                          }}
                        >
                          No
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )} </div>}
          {userData.status === "expired" && <div className="flex flex-1 items-center justify-center">
            <div className="text-4xl font-bold text-black">Expired!</div>
          </div>}
        </>
      )}
    </div>
  );
};

export default TextReader;