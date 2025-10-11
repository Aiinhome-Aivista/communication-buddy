import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MicIcon from "@mui/icons-material/Mic";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";

export default function PracticeTest() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome Vendor! Let’s start onboarding. Please enter your Full Name (as per documents) mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm.",
      sender: "bot",
    },
    { id: 4, text: "Mohit Ghosh", sender: "user" },
    { id: 2, text: "Thanks! Please enter your Company Name.", sender: "bot" },
    { id: 5, text: "Aiinhome", sender: "user" },
    {
      id: 3,
      text: "What products or services do you offer? Please proceed",
      sender: "bot",
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [popupType, setPopupType] = useState("");
  const navigate = useNavigate();

  const handleSend = () => {
    if (inputValue.trim() === "") return;
    setMessages([
      ...messages,
      { id: Date.now(), text: inputValue, sender: "user" },
    ]);
    setInputValue("");
  };

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
    closePopup();
    // Navigate to PracticeTest page when "Yes, Confirm" is clicked
    navigate("/test");
  };

  return (
    <div className="w-full h-full bg-[#ECEFF2] flex flex-col p-4 px-10">
      <h1 className="text-2xl font-bold text-[#2C2E42] mb-4 text-left self-start">
        Practice & Test
      </h1>

      <div className="w-[100%] max-w-[100%] h-[717px] bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center flex-1 gap-6">
            <button className="p-2 rounded-xl transition" onClick={showBackPopup}>
              <ArrowBackIosNewRoundedIcon style={{ color: "#BCC7D2" }} />
            </button>
            <div className="flex justify-between flex-1">
              <div className="leading-tight">
                <h2 className="text-sm font-semibold text-[#8F96A9]">Python</h2>
                <p className="text-xs text-[#7E8489]">Technology</p>
              </div>
              <div className="leading-tight">
                <h2 className="text-sm font-semibold text-[#8F96A9]">
                  Debasish Sahoo
                </h2>
                <p className="text-xs text-[#7E8489]">Hiring manager</p>
              </div>
              <div className="leading-tight">
                <h3 className="text-sm font-semibold text-[#8F96A9]">10 mins</h3>
                <p className="text-xs text-[#7E8489]">Allocated duration</p>
              </div>
              <div className="leading-tight">
                <h3 className="text-sm font-semibold text-[#8F96A9]">09:56</h3>
                <p className="text-xs text-[#7E8489]">Remaining time</p>
              </div>
              <button
                className="h-10 border border-[#DFB916] text-[#7E8489] text-xs px-5 rounded-lg hover:bg-[#DFB916] hover:text-white transition"
                onClick={showEndPopup}
              >
                End
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div
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
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-8 py-4 flex items-center gap-3 bg-white">
          <input
            type="text"
            placeholder="Type a information..."
            className="flex-1 border-none bg-[#F8F9FB] px-4 py-3 rounded-xl text-sm text-[#2C2E42] placeholder:text-[#B7BDC2] focus:outline-none focus:ring-1 focus:ring-[#F4E48A]"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="p-3 rounded-xl border border-[#DFB916] hover:bg-[#F4E48A] transition h-11.5">
            <MicIcon style={{ color: "#DFB916", height: "1.7rem", width: "1.7rem" }} />
          </button>
          <button
            className="p-3 rounded-xl bg-[#E5B800] hover:bg-[#d6a600] transition h-11.5 flex items-center"
            onClick={handleSend}
            type="button"
          >
            <ArrowForwardIcon style={{ color: "white" }} />
          </button>
        </div>
      </div>

      {/* Popup Modal */}
      {popupType && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 min-w-[300px] max-w-[90vw] text-center">
            <h2 className="text-xl font-semibold text-[#2C2E42] mb-3">
              {popupType === "back" ? "Confirm Navigation" : "End Session"}
            </h2>
            <p className="text-[#7E8489] mb-6">
              {popupType === "back"
                ? "Are you sure you want to go back? Unsaved changes may be lost."
                : "Are you sure you want to end the session? Unsaved changes may be lost."}
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-5 py-2 rounded bg-[#DFB916] text-white font-semibold"
                onClick={closePopup}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded bg-[#E53E3E] text-white font-semibold"
                onClick={confirmAction}
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}