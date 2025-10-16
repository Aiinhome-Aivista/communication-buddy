import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import MicIcon from "@mui/icons-material/Mic";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import useCustomSpeechRecognition from "../../../hooks/useSpeechRecognition";
import { useTopic } from "../../../provider/TopicProvider";
import {
  saveChatSession,
  greettingMessage,
} from "../../../utils/saveChatSessionReview";
import {
  checkSessionStatus,
  startChatSession,
  sendChatMessage,
} from "../../../services/ApiService";
import ErrorIcon from "@mui/icons-material/Error";
import CancelIcon from "@mui/icons-material/Cancel";
import WarningIcon from "@mui/icons-material/WarningRounded";
export default function PracticeTest() {
  const [messages, setMessages] = useState([]);

  const [inputValue, setInputValue] = useState("");
  const [popupType, setPopupType] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { getTopicData } = useTopic();

  // Get session data from navigation state or URL params
  const sessionData = location.state || {};
  const hrName = sessionData.hr_name || sessionData.assigned_by;

  const userId = Number(sessionStorage.getItem("user_id")) || null;
  const userName = sessionStorage.getItem("userName") || "";
  const matchedRecord = (getTopicData || []).find(
    (item) => Number(item.user_id) === Number(userId)
  );
  const hrId = sessionData.hr_id || matchedRecord?.hr_id || null;
  const topicName =
    sessionData.topic ||
    sessionData.topic_name ||
    matchedRecord?.topic ||
    matchedRecord?.topic_name,
    totalTimeFromState = sessionData.total_time;

  // Debug logging
  console.log("Component data initialization:", {
    getTopicDataLength: getTopicData?.length || 0,
    userId,
    matchedRecord,
    hrIdFromState: sessionData?.hr_id,
    hrIdFromRecord: matchedRecord?.hr_id,
    finalHrId: hrId,
    topicName,
    topicFromState: sessionData.topic,
    topicNameFromState: sessionData.topic_name,
    topicFromRecord: matchedRecord?.topic,
    topicNameFromRecord: matchedRecord?.topic_name,
    sessionData,
    totalTimeFromState,
  });

  const [isAILoading, setIsAILoading] = useState(false);
  const [fullConversation, setFullConversation] = useState([]);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [sessionStatus, setSessionStatus] = useState(null);
  const [languageSelected, setLanguageSelected] = useState(false);
  const [waitingForLanguage, setWaitingForLanguage] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [showTimeUpPopup, setShowTimeUpPopup] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [sessionTotalTime, setSessionTotalTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [userStatus, setUserStatus] = useState(null); // upcoming, ongoing, expired
  const [countdownTime, setCountdownTime] = useState("");

  // Timer refs
  const sessionTimerRef = useRef(null);
  const sessionStartRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Speech recognition hook
  // Speech-to-text language, defaults to English (India); will sync with selectedLanguage
  const [sttLanguage, setSttLanguage] = useState("en-IN");
  const {
    startRecording,
    stopRecording,
    isRecording,
    transcript,
    resetTranscript,
  } = useCustomSpeechRecognition({ language: sttLanguage }) || {};
  const speechTimerRef = useRef(null);
  // Guards to prevent double submission from mic
  const micSendLockRef = useRef(false);
  const lastTranscriptRef = useRef("");

  // Persist chat meta for logout-based review save
  useEffect(() => {
    if (hrId) sessionStorage.setItem("hr_id", String(hrId));
    if (topicName) sessionStorage.setItem("topic", String(topicName));
  }, [hrId, topicName]);

  // Keep fullConversation mirrored in sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(
        "fullConversation",
        JSON.stringify(fullConversation || [])
      );
    } catch { }
  }, [fullConversation]);

  // Enhanced speech synthesis function with female voice (from textReader)
  const sanitizeTextForSpeech = (text) => {
    if (!text) return "";

    return text
      .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
      .replace(/\bu\.s\.a\b/gi, "United States of America")
      .replace(/\bu\.k\b/gi, "United Kingdom")
      .replace(/\betc\b/gi, "etcetera")
      .replace(/\bvs\b/gi, "versus")
      .replace(/\be\.g\b/gi, "for example")
      .replace(/\bi\.e\b/gi, "that is")
      .replace(/\bw\.r\.t\b/gi, "with respect to")
      .replace(/\.\s+/g, ". ")
      .replace(/,\s*/g, ", ")
      .replace(/;\s*/g, "; ")
      .replace(/:\s*/g, ": ")
      .replace(/\b(\d{4})\b/g, (match, year) => {
        const currentYear = new Date().getFullYear();
        if (parseInt(year) >= 1900 && parseInt(year) <= currentYear + 50) {
          return year.split("").join(" ");
        }
        return match;
      })
      .replace(/[\r\n]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const speakMessage = (cleanText, lang = "en-IN") => {
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
                  window.speechSynthesis.removeEventListener(
                    "voiceschanged",
                    handleVoicesChanged
                  );
                  voiceResolve(window.speechSynthesis.getVoices());
                };
                window.speechSynthesis.addEventListener(
                  "voiceschanged",
                  handleVoicesChanged
                );

                // Fallback timeout for stubborn browsers
                setTimeout(() => {
                  window.speechSynthesis.removeEventListener(
                    "voiceschanged",
                    handleVoicesChanged
                  );
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
        utterance.rate = 0.8; // Optimal speed for Indian accent clarity
        utterance.pitch = 0.9; // Slightly lower pitch for warmer, more natural tone
        utterance.volume = 0.8; // Clear but not overwhelming volume

        // Browser-specific adjustments for Indian voices
        const isChrome = /Chrome/.test(navigator.userAgent);
        const isFirefox = /Firefox/.test(navigator.userAgent);
        const isSafari =
          /Safari/.test(navigator.userAgent) &&
          !/Chrome/.test(navigator.userAgent);
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
            "ravi",
            "hemant",
            "arjun",
            "kiran",
            "raj",
            "suresh",
            "mohan",
            "kumar",
            "singh",
            "sharma",
            "gupta",
            "male",
            "man",
          ];

          // Specific Indian female voice names
          const indianFemaleNames = [
            "heera",
            "priya",
            "sunita",
            "kavya",
            "ananya",
            "shreya",
            "pooja",
            "meera",
            "sita",
            "female",
            "woman",
            "lady",
          ];

          // Check for explicit male indicators
          const hasMaleIndicator = indianMaleNames.some((keyword) =>
            name.includes(keyword)
          );
          const hasFemaleIndicator = indianFemaleNames.some((keyword) =>
            name.includes(keyword)
          );

          if (hasMaleIndicator) return true;
          if (hasFemaleIndicator) return false;

          // For voices without clear gender indicators, use additional heuristics
          // Microsoft voices often have gender in description
          if (name.includes("microsoft")) {
            // Default assumption for ambiguous Microsoft voices
            return (
              !name.includes("aria") &&
              !name.includes("jenny") &&
              !name.includes("emma")
            );
          }

          // Default to male for ambiguous cases (many system defaults are male)
          return true;
        };

        console.log("🎤 Selecting natural Indian voice for:", {
          lang,
          gender: voiceGender,
        });
        console.log(
          "🎤 Available voices:",
          voices.length,
          voices.map((v) => ({ name: v.name, lang: v.lang }))
        );

        if (lang === "en-IN") {
          // ✅ Priority order for natural Indian English voices
          const naturalIndianVoices = voices.filter((v) => {
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

          const premiumVoices = voices.filter((v) => {
            const name = v.name.toLowerCase();
            return (
              name.includes("neural") ||
              name.includes("premium") ||
              name.includes("natural") ||
              (name.includes("microsoft") && name.includes("neural"))
            );
          });

          const englishVoices = voices.filter((v) => v.lang.startsWith("en"));

          console.log(
            "🇮🇳 Natural Indian voices found:",
            naturalIndianVoices.length,
            naturalIndianVoices.map((v) => v.name)
          );
          console.log(
            "⭐ Premium voices found:",
            premiumVoices.length,
            premiumVoices.map((v) => v.name)
          );

          if (voiceGender === "male") {
            selectedVoice =
              // Top priority: Natural Indian male voices
              naturalIndianVoices.find((v) => isLikelyMaleVoice(v)) ||
              // Specific high-quality Indian male voices
              voices.find(
                (v) =>
                  v.name.toLowerCase().includes("ravi") &&
                  v.name.toLowerCase().includes("desktop")
              ) ||
              voices.find((v) => v.name.toLowerCase().includes("hemant")) ||
              // Premium male voices with Indian accent capability
              premiumVoices.find(
                (v) => v.lang === "en-IN" && isLikelyMaleVoice(v)
              ) ||
              premiumVoices.find(
                (v) => v.lang.startsWith("en") && isLikelyMaleVoice(v)
              ) ||
              // Any Indian voice that sounds male
              naturalIndianVoices.find(
                (v) => !v.name.toLowerCase().includes("female")
              ) ||
              // General English male voices as fallback
              englishVoices.find((v) => isLikelyMaleVoice(v)) ||
              englishVoices.find(
                (v) => !v.name.toLowerCase().includes("female")
              ) ||
              // Last resort
              voices[0];
          } else {
            selectedVoice =
              // Top priority: Natural Indian female voices
              naturalIndianVoices.find((v) => !isLikelyMaleVoice(v)) ||
              // Specific high-quality Indian female voices
              voices.find(
                (v) =>
                  v.name.toLowerCase().includes("heera") &&
                  v.name.toLowerCase().includes("desktop")
              ) ||
              voices.find((v) => v.name.toLowerCase().includes("priya")) ||
              voices.find((v) => v.name.toLowerCase().includes("sunita")) ||
              // Premium female voices with clear, natural tone
              premiumVoices.find(
                (v) => v.lang === "en-IN" && !isLikelyMaleVoice(v)
              ) ||
              voices.find(
                (v) =>
                  v.name.toLowerCase().includes("aria") &&
                  v.lang.startsWith("en")
              ) ||
              voices.find(
                (v) =>
                  v.name.toLowerCase().includes("jenny") &&
                  v.lang.startsWith("en")
              ) ||
              premiumVoices.find(
                (v) => v.lang.startsWith("en") && !isLikelyMaleVoice(v)
              ) ||
              // Any female-sounding Indian voice
              naturalIndianVoices.find((v) =>
                v.name.toLowerCase().includes("female")
              ) ||
              // General English female voices as fallback
              englishVoices.find((v) => !isLikelyMaleVoice(v)) ||
              englishVoices.find((v) =>
                v.name.toLowerCase().includes("female")
              ) ||
              // Fallback to any available voice
              voices[0];
          }
        } else if (lang === "hi-IN") {
          // ✅ Enhanced Hindi voice selection for natural Indian tone
          const hindiVoices = voices.filter((v) => {
            const name = v.name.toLowerCase();
            return (
              v.lang.startsWith("hi") ||
              name.includes("hindi") ||
              name.includes("bharat") ||
              (name.includes("microsoft") && v.lang === "hi-IN")
            );
          });

          const premiumHindiVoices = hindiVoices.filter((v) => {
            const name = v.name.toLowerCase();
            return (
              name.includes("neural") ||
              name.includes("premium") ||
              name.includes("natural") ||
              name.includes("desktop")
            );
          });

          console.log(
            "🇮🇳 Hindi voices found:",
            hindiVoices.length,
            hindiVoices.map((v) => v.name)
          );
          console.log(
            "⭐ Premium Hindi voices found:",
            premiumHindiVoices.length,
            premiumHindiVoices.map((v) => v.name)
          );

          if (voiceGender === "male") {
            selectedVoice =
              // Premium Hindi male voices
              premiumHindiVoices.find((v) => isLikelyMaleVoice(v)) ||
              // Standard Hindi male voices
              hindiVoices.find((v) => isLikelyMaleVoice(v)) ||
              hindiVoices.find(
                (v) => !v.name.toLowerCase().includes("female")
              ) ||
              // Fallback to any Hindi voice
              hindiVoices[0] ||
              voices[0];
          } else {
            selectedVoice =
              // Premium Hindi female voices
              premiumHindiVoices.find((v) => !isLikelyMaleVoice(v)) ||
              // Standard Hindi female voices
              hindiVoices.find((v) => !isLikelyMaleVoice(v)) ||
              hindiVoices.find((v) =>
                v.name.toLowerCase().includes("female")
              ) ||
              // Fallback to any Hindi voice
              hindiVoices[0] ||
              voices[0];
          }
        } else if (lang === "bn-IN" || lang === "bn-BD") {
          // ✅ Enhanced Bengali voice support with natural tone priority
          const bengaliVoices = voices.filter((v) => {
            const name = v.name.toLowerCase();
            return (
              v.lang.startsWith("bn") ||
              name.includes("bengali") ||
              name.includes("bangla") ||
              name.includes("bangladesh") ||
              (name.includes("microsoft") && v.lang.startsWith("bn"))
            );
          });

          const premiumBengaliVoices = bengaliVoices.filter((v) => {
            const name = v.name.toLowerCase();
            return (
              name.includes("neural") ||
              name.includes("premium") ||
              name.includes("natural") ||
              name.includes("desktop")
            );
          });

          console.log(
            "🇧🇩 Bengali voices found:",
            bengaliVoices.length,
            bengaliVoices.map((v) => v.name)
          );
          console.log(
            "⭐ Premium Bengali voices found:",
            premiumBengaliVoices.length,
            premiumBengaliVoices.map((v) => v.name)
          );

          if (voiceGender === "male") {
            selectedVoice =
              // Premium Bengali male voices
              premiumBengaliVoices.find((v) => isLikelyMaleVoice(v)) ||
              // Standard Bengali male voices
              bengaliVoices.find((v) => isLikelyMaleVoice(v)) ||
              bengaliVoices.find(
                (v) => !v.name.toLowerCase().includes("female")
              ) ||
              // Fallback to any Bengali voice
              bengaliVoices[0] ||
              // Fallback to Indian English male voices if no Bengali available
              voices.find((v) => v.lang === "en-IN" && isLikelyMaleVoice(v)) ||
              voices[0];
          } else {
            selectedVoice =
              // Premium Bengali female voices
              premiumBengaliVoices.find((v) => !isLikelyMaleVoice(v)) ||
              // Standard Bengali female voices
              bengaliVoices.find((v) => !isLikelyMaleVoice(v)) ||
              bengaliVoices.find((v) =>
                v.name.toLowerCase().includes("female")
              ) ||
              // Fallback to any Bengali voice
              bengaliVoices[0] ||
              // Fallback to Indian English female voices if no Bengali available
              voices.find((v) => v.lang === "en-IN" && !isLikelyMaleVoice(v)) ||
              voices[0];
          }
        } else if (lang === "es-ES") {
          // ✅ Spanish voice selection (prefer female)
          const spanishVoices = voices.filter(
            (v) =>
              v.lang.startsWith("es") ||
              v.name.toLowerCase().includes("spanish") ||
              v.name.toLowerCase().includes("español")
          );
          const femaleNames = [
            "conchita",
            "isabel",
            "lucia",
            "camila",
            "sofia",
            "elena",
            "maria",
          ];
          const premiumSpanish = spanishVoices.filter(
            (v) =>
              v.name.toLowerCase().includes("neural") ||
              v.name.toLowerCase().includes("natural") ||
              v.name.toLowerCase().includes("premium")
          );

          if (voiceGender === "male") {
            selectedVoice =
              premiumSpanish.find(
                (v) =>
                  !femaleNames.some((n) => v.name.toLowerCase().includes(n))
              ) ||
              spanishVoices.find(
                (v) =>
                  !femaleNames.some((n) => v.name.toLowerCase().includes(n))
              ) ||
              spanishVoices[0] ||
              voices[0];
          } else {
            selectedVoice =
              premiumSpanish.find((v) =>
                femaleNames.some((n) => v.name.toLowerCase().includes(n))
              ) ||
              spanishVoices.find((v) =>
                femaleNames.some((n) => v.name.toLowerCase().includes(n))
              ) ||
              spanishVoices.find((v) =>
                v.name.toLowerCase().includes("female")
              ) ||
              spanishVoices[0] ||
              voices[0];
          }
        } else if (lang === "fr-FR") {
          // ✅ French voice selection (prefer female)
          const frenchVoices = voices.filter(
            (v) =>
              v.lang.startsWith("fr") ||
              v.name.toLowerCase().includes("french") ||
              v.name.toLowerCase().includes("français")
          );
          const femaleNamesFr = [
            "amelie",
            "celine",
            "virginie",
            "julie",
            "claire",
            "lea",
            "marie",
          ];
          const premiumFrench = frenchVoices.filter(
            (v) =>
              v.name.toLowerCase().includes("neural") ||
              v.name.toLowerCase().includes("natural") ||
              v.name.toLowerCase().includes("premium")
          );

          if (voiceGender === "male") {
            selectedVoice =
              premiumFrench.find(
                (v) =>
                  !femaleNamesFr.some((n) => v.name.toLowerCase().includes(n))
              ) ||
              frenchVoices.find(
                (v) =>
                  !femaleNamesFr.some((n) => v.name.toLowerCase().includes(n))
              ) ||
              frenchVoices[0] ||
              voices[0];
          } else {
            selectedVoice =
              premiumFrench.find((v) =>
                femaleNamesFr.some((n) => v.name.toLowerCase().includes(n))
              ) ||
              frenchVoices.find((v) =>
                femaleNamesFr.some((n) => v.name.toLowerCase().includes(n))
              ) ||
              frenchVoices.find((v) =>
                v.name.toLowerCase().includes("female")
              ) ||
              frenchVoices[0] ||
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
            genderMatch:
              (voiceGender === "male") === isLikelyMaleVoice(selectedVoice),
          });
        } else {
          console.warn("⚠️ No suitable voice found for:", {
            lang,
            voiceGender,
            availableVoices: voices.length,
          });
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
            console.warn(
              "⚠️ Voice changed during setup, reapplying:",
              selectedVoice.name
            );
            utterance.voice = selectedVoice;
          }

          try {
            window.speechSynthesis.speak(utterance);
            console.log(
              "🎤 Speech started with voice:",
              utterance.voice?.name || "default"
            );
          } catch (error) {
            console.error("❌ Error starting speech synthesis:", error);
            setIsSpeaking(false);
            resolve();
          }
        }, 100);
      });
    });
  };

  // Stop speaking function
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Language helpers
  const getLangCode = (readable) => {
    switch ((readable || "").toLowerCase()) {
      case "hindi":
      case "हिंदी":
        return "hi-IN";
      case "spanish":
      case "español":
        return "es-ES";
      case "french":
      case "français":
        return "fr-FR";
      case "english":
      default:
        return "en-IN";
    }
  };

  // Keep STT language aligned with selected chat language so mic input is transcribed correctly (e.g., Hindi -> Devanagari)
  useEffect(() => {
    try {
      const code = getLangCode(selectedLanguage);
      setSttLanguage(code);
    } catch { }
  }, [selectedLanguage]);

  const getReadableLanguage = (text) => {
    const t = (text || "").trim().toLowerCase();
    if (t.includes("हिंदी") || t.includes("hindi")) return "Hindi";
    if (t.includes("spanish") || t.includes("español")) return "Spanish";
    if (t.includes("french") || t.includes("français")) return "French";
    return "English";
  };

  // Check session status using ApiService
  const checkSessionStatusAPI = async () => {
    console.log("checkSessionStatus called with:", { userId, hrId, topicName });

    if (!userId || !hrId || !topicName) {
      console.warn("Missing session data:", { userId, hrId, topicName });

      if (!hrId && matchedRecord?.hr_id) {
        console.log("Found hrId from matchedRecord:", matchedRecord.hr_id);
        const retryHrId = matchedRecord.hr_id;
        if (userId && retryHrId && topicName) {
          return checkSessionStatusWithData(userId, retryHrId, topicName);
        }
      }
      return;
    }

    return checkSessionStatusWithData(userId, hrId, topicName);
  };

  const checkSessionStatusWithData = async (userId, hrId, topicName) => {
    console.log("Making API call with:", { userId, hrId, topicName });

    try {
      console.log("Calling get_session_status API...");
      const data = await checkSessionStatus(userId, hrId, topicName);
      console.log("Session status response:", data);

      // Check if the response contains an error
      if (data.error) {
        console.error("API returned error:", data.error);
        // Handle different error scenarios
        if (data.error.includes("No session found")) {
          console.warn(
            "No session found - this might be expected for new sessions"
          );
          // Set user status to handle this case
          setUserStatus("no_session");
          return;
        }
      }

      setSessionStatus(data);

      // Check if session is upcoming, ongoing, or expired
      if (data.status === "upcoming") {
        setUserStatus("upcoming");
        if (data.session_time) {
          startCountdownTimer(data.session_time);
        }
        return;
      } else if (data.status === "expired") {
        setUserStatus("expired");
        setSessionExpired(true);
        setShowTimeUpPopup(true);
        return;
      } else {
        // Ongoing: wait for user to press Start Chat; don't auto-start or start timer here
        setUserStatus("ongoing");
      }
    } catch (error) {
      console.error("Error checking session status:", error);
      // Fallback behavior - allow user to proceed
      console.log(
        "Fallback: Setting status to ongoing to allow user to start session"
      );
      setUserStatus("ongoing");
      await startSessionInitial();
    }
  };

  // Countdown timer for upcoming sessions
  const startCountdownTimer = (sessionTime) => {
    const targetTime = new Date(sessionTime).getTime();

    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }

    countdownTimerRef.current = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance < 0) {
        clearInterval(countdownTimerRef.current);
        setCountdownTime("Session is ready to start!");
        // Recheck session status
        setTimeout(() => {
          checkSessionStatusAPI();
        }, 1000);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      let countdownText = "";
      if (days > 0) countdownText += `${days}d `;
      if (hours > 0) countdownText += `${hours}h `;
      if (minutes > 0) countdownText += `${minutes}m `;
      countdownText += `${seconds}s`;

      setCountdownTime(countdownText);
    }, 1000);
  };

  // Session timer functionality (uses API total_time and session_time when available)
  const startSessionTimer = (totalMinutesParam, sessionStartAt) => {
    const totalTime = Number(
      totalTimeFromState ?? totalMinutesParam ?? matchedRecord?.total_time ?? 10
    ); // minutes
    setSessionTotalTime(totalTime);
    sessionStartRef.current = sessionStartAt
      ? new Date(sessionStartAt).getTime()
      : Date.now();

    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
    }

    const tick = () => {
      const now = Date.now();
      const elapsedMinutes = (now - sessionStartRef.current) / (1000 * 60);
      const remainingMinutes = Math.max(0, totalTime - elapsedMinutes);

      const minutes = Math.floor(remainingMinutes);
      const seconds = Math.floor((remainingMinutes - minutes) * 60);
      setTimeLeft(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );

      if (remainingMinutes <= 0) {
        clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
        // Stop speech and disable input per requirement
        try {
          window.speechSynthesis.cancel();
        } catch { }
        setIsSpeaking(false);
        setSessionExpired(true);
        setUserStatus("expired"); // Switch to the expired view
        setShowTimeUpPopup(true);
        // Note: Removed auto-save on time up per requirement
      }
    };

    // run immediately and then every second
    tick();
    sessionTimerRef.current = setInterval(tick, 1000);
  };

  // Start session - first call (without user input) using ApiService
  const startSessionInitial = async () => {
    if (!userName || !topicName) {
      console.warn("Missing data for starting session:", {
        userName,
        topicName,
      });
      return;
    }

    try {
      const data = await startChatSession(userName, topicName, "");
      console.log("Start session response (initial):", data);

      if (data.message) {
        const welcomeMessage = {
          id: Date.now(),
          text: data.message,
          sender: "bot",
        };
        setMessages([welcomeMessage]);
        setFullConversation([
          {
            role: "ai",
            message: data.message,
            time: new Date().toLocaleTimeString(),
          },
        ]);
        setSessionStarted(true);
        setWaitingForLanguage(true);

        // Speak the welcome message
        await speakMessage(data.message, getLangCode("English"));

        // Generate a 4-digit session ID; start timer only after language is chosen
        const sid = Math.floor(1000 + Math.random() * 9000);
        setSessionId(sid);
      }
    } catch (error) {
      console.error("Error starting session:", error);
    }
  };

  // Start session - second call (with language selection) using ApiService
  const startSessionWithLanguage = async (languageInput) => {
    if (!userName || !topicName) {
      console.warn("Missing data for starting session with language:", {
        userName,
        topicName,
      });
      return;
    }

    try {
      const readableLang = getReadableLanguage(languageInput);
      setSelectedLanguage(readableLang);
      const data = await startChatSession(userName, topicName, languageInput);
      console.log("Start session response (with language):", data);

      if (data.message) {
        const aiEntry = {
          id: Date.now() + 1,
          text: data.message,
          sender: "bot",
        };
        setMessages((prev) => [...prev, aiEntry]);
        setFullConversation((prev) => [
          ...prev,
          {
            role: "ai",
            message: data.message,
            time: new Date().toLocaleTimeString(),
          },
        ]);

        // Speak the language selection response
        await speakMessage(data.message, getLangCode(readableLang));
        setWaitingForLanguage(false);
        setLanguageSelected(true);

        // Start timer after language is selected if not already started via status
        if (!sessionTimerRef.current) startSessionTimer();

        // Show typing while fetching intro chat response
        setIsAILoading(true);
        try {
          const intro = await sendChatMessage(
            sessionId,
            topicName,
            matchedRecord?.total_time || 10,
            "",
            readableLang
          );
          const introMsg =
            intro?.message || `Let's begin our discussion on ${topicName}.`;
          const introEntry = {
            id: Date.now() + 2,
            text: introMsg,
            sender: "bot",
          };
          setMessages((prev) => [...prev, introEntry]);
          setFullConversation((prev) => [
            ...prev,
            {
              role: "ai",
              message: introMsg,
              time: new Date().toLocaleTimeString(),
            },
          ]);
          // Hide typing as soon as response is received; do not keep it during speaking
          setIsAILoading(false);
          await speakMessage(introMsg, getLangCode(readableLang));
        } catch (e) {
          console.error("Intro chat API error:", e);
          setIsAILoading(false);
        }
      }
    } catch (error) {
      console.error("Error starting session with language:", error);
    }
  };

  // Initialize session on component mount
  useEffect(() => {
    console.log("useEffect triggered with:", {
      userId,
      hrId,
      topicName,
      sessionData,
    });

    // Add a small delay to ensure all data is loaded
    const timer = setTimeout(() => {
      if (userId && topicName) {
        console.log("Starting session check...");
        checkSessionStatusAPI();
      } else {
        console.warn("Missing required data for session:", {
          userId,
          hrId,
          topicName,
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [userId, hrId, topicName]);

  // Voice initialization and cleanup effects
  useEffect(() => {
    // Initialize voice on mount
    window.speechSynthesis.cancel();

    // Set default voice gender to female
    const defaultGender = "female";
    localStorage.setItem("voiceGender", defaultGender);
    setVoiceGender(defaultGender);
    console.log("🎵 Fresh session - Voice gender reset to:", defaultGender);

    // Initialize voices for better cross-browser support
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", () => {
        console.log(
          "🎤 Voices loaded:",
          window.speechSynthesis.getVoices().length
        );
        // Log all available voices for debugging
        const voices = window.speechSynthesis.getVoices();
        console.log(
          "🔍 All available voices:",
          voices.map(
            (v) => `${v.name} (${v.lang}) - ${v.gender || "unknown gender"}`
          )
        );
      });
    } else {
      // Voices already loaded
      const voices = window.speechSynthesis.getVoices();
      console.log(
        "🔍 All available voices:",
        voices.map(
          (v) => `${v.name} (${v.lang}) - ${v.gender || "unknown gender"}`
        )
      );
    }

    // Add debugging function for voice testing
    window.debugVoices = {
      listAll: () => {
        const voices = window.speechSynthesis.getVoices();
        console.table(
          voices.map((v) => ({
            name: v.name,
            lang: v.lang,
            gender: v.gender || "unknown",
            default: v.default,
          }))
        );
        return voices;
      },
      testFemaleVoice: () => {
        const voices = window.speechSynthesis.getVoices();
        const femaleVoices = voices.filter((voice) => {
          const name = voice.name.toLowerCase();
          return (
            name.includes("female") ||
            name.includes("woman") ||
            name.includes("zira") ||
            name.includes("hazel")
          );
        });
        console.log("Female voices found:", femaleVoices);
        if (femaleVoices.length > 0) {
          const utterance = new SpeechSynthesisUtterance(
            "This is a test of the female voice"
          );
          utterance.voice = femaleVoices[0];
          window.speechSynthesis.speak(utterance);
        }
      },
      getCurrentVoice: () => {
        console.log("Current voice gender preference:", voiceGender);
      },
    };
    console.log("🛠️ Debug functions available: window.debugVoices");

    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || !sessionStarted) return;

    const userEntry = { id: Date.now(), text, sender: "user" };
    setMessages((prev) => [...prev, userEntry]);
    setFullConversation((prev) => [
      ...prev,
      { role: "user", message: text, time: new Date().toLocaleTimeString() },
    ]);
    setInputValue("");

    // Check if we're waiting for language selection
    if (waitingForLanguage) {
      // Call start_session with language input
      startSessionWithLanguage(text);
    } else if (languageSelected) {
      // Normal chat API call
      callChatAPI(text);
    }
  };

  // Auto-scroll to bottom when messages change or popup visibility changes
  useEffect(() => {
    try {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    } catch { }
  }, [messages, isAILoading, showTimeUpPopup]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  const showBackPopup = () => setPopupType("back");
  const showEndPopup = () => setPopupType("end");
  const closePopup = () => setPopupType("");
  const confirmAction = () => {
    // Save conversation then navigate
    (async () => {
      try {
        await saveChatSession({
          userId,
          hrId,
          topic: topicName,
          fullConversation,
        });
      } catch (err) {
        console.warn("Error saving conversation", err);
      }
      closePopup();
      navigate("/test");
    })();
  };

  // when transcript changes and user stops recording, send it (with double-send guards)
  useEffect(() => {
    if (!isRecording && transcript && transcript.trim() && sessionStarted) {
      // send transcript as message
      const text = transcript.trim();
      // Prevent double submission: if the same text was just sent, or lock is active, skip
      if (micSendLockRef.current) return;
      if (lastTranscriptRef.current && lastTranscriptRef.current === text)
        return;
      micSendLockRef.current = true;
      lastTranscriptRef.current = text;
      const userEntry = { id: Date.now(), text, sender: "user" };
      setMessages((prev) => [...prev, userEntry]);
      setFullConversation((prev) => [
        ...prev,
        { role: "user", message: text, time: new Date().toLocaleTimeString() },
      ]);
      resetTranscript?.();

      // Check if we're waiting for language selection
      if (waitingForLanguage) {
        // Auto-detect spoken language and set it before starting the session
        const autoReadable = getReadableLanguage(text);
        if (autoReadable && autoReadable !== selectedLanguage) {
          setSelectedLanguage(autoReadable);
          setSttLanguage(getLangCode(autoReadable));
        }
        // Call start_session with language input
        startSessionWithLanguage(text);
      } else if (languageSelected) {
        // Normal chat API call
        callChatAPI(text);
      }

      // Release the lock shortly after dispatch to avoid rapid duplicate triggers
      setTimeout(() => {
        micSendLockRef.current = false;
      }, 400);
    }
  }, [
    isRecording,
    transcript,
    sessionStarted,
    waitingForLanguage,
    languageSelected,
  ]);

  // Auto-send functionality with 5-second delay (like textReader)
  useEffect(() => {
    // Only debounce while actively listening
    if (!isRecording) return;

    const text = transcript.trim();
    if (!text) return;

    // Reset existing timer
    if (speechTimerRef.current) {
      clearTimeout(speechTimerRef.current);
    }

    // Wait for 5 seconds of silence before finalizing the transcript
    speechTimerRef.current = setTimeout(() => {
      if (isRecording && transcript.trim() && sessionStarted) {
        stopRecording?.();
        // The transcript will be processed by the previous useEffect
      }
    }, 4000);

    return () => {
      if (speechTimerRef.current) {
        clearTimeout(speechTimerRef.current);
        speechTimerRef.current = null;
      }
    };
  }, [transcript, isRecording, sessionStarted]);

  // Main chat API call using ApiService
  const callChatAPI = async (userInput) => {
    if (!userInput || !languageSelected) return;
    setIsAILoading(true);

    try {
      const data = await sendChatMessage(
        sessionId,
        topicName,
        matchedRecord?.total_time || 10,
        userInput,
        selectedLanguage || "English",
        userId,
        hrId
      );

      const aiMessage = data?.message || "Invalid Message";

      const aiEntry = { id: Date.now() + 1, text: aiMessage, sender: "bot" };
      setMessages((prev) => [...prev, aiEntry]);
      setFullConversation((prev) => [
        ...prev,
        {
          role: "ai",
          message: aiMessage,
          time: new Date().toLocaleTimeString(),
        },
      ]);

      // Stop typing indicator immediately after receiving response
      setIsAILoading(false);
      // Speak the AI response
      await speakMessage(aiMessage, getLangCode(selectedLanguage));

      // Note: Removed auto-save on session end keywords per requirement; still show the popup if needed
      const lower = aiMessage.toLowerCase();
      if (
        lower.includes("time is up") ||
        lower.includes("thank you for the discussion")
      ) {
        setShowTimeUpPopup(true);
      }
    } catch (error) {
      console.error("API error:", error);
      // push fallback bot message
      const aiEntry = {
        id: Date.now() + 1,
        text: "Oops..I missed that one, Can you repeat please?",
        sender: "bot",
      };
      setMessages((prev) => [...prev, aiEntry]);
      setIsAILoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-[#ECEFF2] flex flex-col p-4 px-10">
      <h1 className="text-2xl font-bold text-[#2C2E42] mb-4 text-left self-start">
        Practice & Test
      </h1>

      <div className="w-[100%] max-w-[100%] h-[717px] bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden">
        {/* Show different content based on session status */}
        {userStatus === "upcoming" ? (
          // Upcoming session with countdown
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#2C2E42] mb-4">
                Session Scheduled
              </h2>
              <p className="text-lg text-[#7E8489] mb-6">
                Your session will start in:
              </p>
              <div className="text-4xl font-bold text-[#DFB916] mb-4">
                {countdownTime || "Loading..."}
              </div>
              <p className="text-sm text-[#7E8489]">
                Topic: {topicName || "Loading..."}
              </p>
              <p className="text-sm text-[#7E8489]">
                HR: {hrName || "Loading..."}
              </p>
            </div>
          </div>
        ) : userStatus === "expired" ? (
          // Expired session
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 min-w-[420px]  min-h-[220px] max-w-[420px]  max-h-[220px] text-center relative">
              {/* Close Button */}
              <button
                onClick={() => {
                  try {
                    window.speechSynthesis.cancel();
                  } catch { }
                  setUserStatus(null); // <-- Add this to hide the expired popup
                  setShowTimeUpPopup(false);
                  setSessionExpired(false);
                }}
                className="absolute top-1 right-1 text-[#DFB916] transition"
              >
                <CancelIcon className="w-10 h-10" />
              </button>
              <div className="flex justify-center">
                <div className="flex items-center justify-center">
                  <WarningIcon sx={{ color: "#DFB916", fontSize: 48 }} />
                </div>
              </div>

              {/* Aiihome | CB Title */}
              <h3 className="text-sm font-semibold text-[#2C2E42] mb-1">
                A<span className="text-[#DFB916]">ii</span>nhome
                <span className="px-1">|</span>
                <span className="font-bold">CB</span>
              </h3>
              <p className="mb-6 text-[#2C2E42] font-extrabold">
                Your session time has expired.
              </p>
              <button
                className="h-8 w-40 border border-[#DFB916] bg-[#DFB916] text-[#2C2E42] font-bold text-xs px-5 rounded-lg hover:bg-[#DFB916] hover:text-white transition"
                onClick={() => navigate("/test")}
              >
                Back to Tests
              </button>
            </div>
          </div>
        ) : userStatus === "no_session" ? (
          // No session found - allow user to start manually
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#2C2E42] mb-4">
                Ready to Start
              </h2>
              {/* <p className="text-lg text-[#7E8489] mb-6">Click below to begin your session</p> */}
              <div className="mb-4">
                <p className="text-sm text-[#7E8489]">
                  Topic: {topicName || "Loading..."}
                </p>
                <p className="text-sm text-[#7E8489]">
                  HR: {hrName || "Loading..."}
                </p>
              </div>
              <button
                className="px-6 py-3 bg-[#DFB916] text-white rounded-lg hover:bg-[#d6a600] transition"
                onClick={async () => {
                  setUserStatus("ongoing");
                  await startSessionInitial();
                }}
              >
                Start Session
              </button>
            </div>
          </div>
        ) : (
          // Normal chat interface for ongoing sessions
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center flex-1 gap-6">
                <button
                  className="p-2 rounded-xl transition"
                  onClick={showBackPopup}
                >
                  <div className="cursor-pointer text-[#BCC7D2] hover:text-[#E5B800] transition-colors duration-200">
                    <ArrowBackIosNewRoundedIcon />
                  </div>
                </button>
                <div className="flex justify-between flex-1">
                  <div className="leading-tight">
                    <h2 className="text-sm font-semibold text-[#8F96A9]">
                      {topicName || "Topic"}
                    </h2>
                    <p className="text-xs text-[#7E8489]">Technology</p>
                  </div>
                  <div className="leading-tight">
                    <h2 className="text-sm font-semibold text-[#8F96A9]">
                      {hrName || "HR Manager"}
                    </h2>
                    <p className="text-xs text-[#7E8489]">Assigned By</p>
                  </div>
                  <div className="leading-tight">
                    <h3 className="text-sm font-semibold text-[#8F96A9]">
                      {sessionStatus?.total_time || totalTimeFromState || 10}{" "}
                      mins
                    </h3>
                    <p className="text-xs text-[#7E8489]">Allocated Duration</p>
                  </div>
                  <div className="leading-tight">
                    <h3 className="text-sm font-semibold text-[#8F96A9]">
                      {userStatus === "upcoming"
                        ? countdownTime
                        : sessionStarted
                          ? timeLeft || "--:--"
                          : sessionStatus?.total_time
                            ? `${String(sessionStatus.total_time).padStart(
                              2,
                              "0"
                            )}:00`
                            : `${String(matchedRecord?.total_time || 10).padStart(
                              2,
                              "0"
                            )}:00`}
                    </h3>
                    <p className="text-xs text-[#7E8489]">
                      {userStatus === "upcoming"
                        ? "Time to start"
                        : "Remaining Time"}
                    </p>
                  </div>
                  <button
                    className="h-8 w-15 border border-[#DFB916] text-[#2C2E42] text-xs px-5 rounded-lg hover:bg-[#DFB916] hover:text-white transition"
                    onClick={showEndPopup}
                  >
                    End
                  </button>
                </div>
              </div>
            </div>

            {/* Either show Start Chat prompt or the chat area */}
            {!sessionStarted ? (
              <div className="flex-1 flex items-center justify-center bg-white">
                <div className="text-center space-y-4">
                  {/* <p className="text-lg text-[#7E8489]">Click below to start your interview chat</p> */}
                  <button
                    className="px-6 py-3 bg-[#DFB916] text-white rounded-lg hover:bg-[#d6a600] transition"
                    onClick={async () => {
                      // Set up timer countdown from allocated duration when starting
                      const total = Number(
                        totalTimeFromState ??
                        sessionStatus?.total_time ??
                        matchedRecord?.total_time ??
                        10
                      );
                      startSessionTimer(total, Date.now());
                      await startSessionInitial();
                    }}
                  >
                    Start Chat
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Messages */}
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto px-8 py-6 bg-white space-y-4 
                    scrollbar-thin scrollbar-thumb-[#F8E68A] scrollbar-track-transparent rounded-lg"
                  style={{
                    scrollbarColor: "#DFB91614 transparent",
                    scrollbarWidth: "thin",
                  }}
                >
                  {messages.map((msg) =>
                    msg.sender === "bot" ? (
                      <div key={msg.id} className="flex">
                        <div className="bg-[#DFB91614] text-[#7E8489] px-4 py-2 rounded-xl inline-block max-w-[70%] w-auto break-words">
                          {msg.text}
                        </div>
                      </div>
                    ) : (
                      <div key={msg.id} className="flex justify-end">
                        <div className="bg-[#ECEFF2] text-[#7E8489] px-4 py-2 rounded-lg inline-block max-w-[70%] w-auto break-words">
                          {msg.text}
                        </div>
                      </div>
                    )
                  )}

                  {/* Typing indicator */}
                  {isAILoading && (
                    <div className="flex">
                      <div className="bg-[#DFB91614] text-[#7E8489] px-4 py-2 rounded-xl inline-block max-w-[70%] w-auto break-words animate-pulse">
                        Typing...
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Footer */}
            <div
              className={`border-t border-gray-200 px-8 py-4 flex items-center gap-3 bg-white ${sessionExpired ? "blur-sm pointer-events-none" : ""
                }`}
            >
              <input
                type="text"
                placeholder={
                  waitingForLanguage
                    ? "Type a information..."
                    : "Type a information..."
                }
                className="flex-1 border-none bg-[#F8F9FB] px-4 py-3 rounded-xl text-sm text-[#2C2E42] placeholder:text-[#B7BDC2] focus:outline-none focus:ring-1 focus:ring-[#F4E48A]"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!sessionStarted || sessionExpired}
              />
              <button
                className="p-3 rounded-xl border border-[#DFB916] hover:bg-[#F4E48A] transition h-11.5"
                onClick={() => {
                  if (isRecording) {
                    // Manual stop should clear pending timer and release lock soon
                    try {
                      if (speechTimerRef.current) {
                        clearTimeout(speechTimerRef.current);
                        speechTimerRef.current = null;
                      }
                    } catch { }
                    stopRecording();
                    setTimeout(() => {
                      micSendLockRef.current = false;
                    }, 200);
                  } else {
                    // New recording: clear previous transcript guard and locks
                    lastTranscriptRef.current = "";
                    micSendLockRef.current = false;
                    startRecording();
                  }
                }}
                disabled={!sessionStarted || sessionExpired}
              >
                <MicIcon
                  style={{
                    color: isRecording
                      ? "#E53E3E"
                      : sessionStarted
                        ? "#DFB916"
                        : "#B7BDC2",
                    height: "1.7rem",
                    width: "1.7rem",
                  }}
                />
              </button>
              <button
                className="p-3 rounded-xl bg-[#E5B800] hover:bg-[#f1be08] transition h-11.5 flex items-center disabled:bg-"
                onClick={handleSend}
                type="button"
                disabled={
                  !sessionStarted ||
                  !inputValue.trim() ||
                  sessionExpired ||
                  isAILoading
                }
              >
                <ArrowForwardIcon style={{ color: "white" }} />
              </button>
            </div>
          </>
        )}
      </div>

      {popupType && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 min-w-[420px]  min-h-[220px] max-w-[420px]  max-h-[220px] text-center relative">
            {/* Close Icon */}
            <button
              onClick={closePopup}
              className="absolute top-1 right-1 text-[#DFB916] transition"
            >
              <CancelIcon className="w-10 h-10" />
            </button>

            <ErrorIcon sx={{ color: "#7E848945", fontSize: 48 }} />
            <h3 className="text-sm font-semibold text-[#2C2E42] mb-1">
              A<span className="text-[#DFB916]">ii</span>nhome
              <span className="px-1">|</span>
              <span className="font-bold">CB</span>
            </h3>

            {/* Message */}
            <p className="mb-6 text-[#2C2E42] font-extrabold">
              Do you want to close the session?
            </p>

            {/* Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmAction}
                className="h-8 w-15 border border-[#DFB916] text-[#2C2E42] font-extrabold text-xs px-5 rounded-lg hover:bg-[#DFB916] hover:text-white transition"
              >
                Yes
              </button>
              <button
                onClick={closePopup}
                className="h-8 w-15 border border-[#DFB916] bg-[#DFB916] text-[#2C2E42] font-extrabold text-xs px-5 rounded-lg hover:bg-[#DFB916] hover:text-white transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
