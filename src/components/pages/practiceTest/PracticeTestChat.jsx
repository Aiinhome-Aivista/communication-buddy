import { useState } from "react";

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

  return (
    <div className="w-full h-full bg-[#ECEFF2] flex flex-col p-4 px-10">
      <h1 className="text-2xl font-bold items-start text-[#2C2E42] mb-4">Practice & Test</h1>

      <div className="w-[100%] max-w-[100%] h-[717px] bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-16 py-4 gap-0.5 border-b border-gray-100">
          <div className="flex items-center gap-8">
            {/* Move icon to far left */}
            <button className="p-4 rounded-xl px-0 transition">
              <img
                src="public/assets/icons/stat_minus_1.svg"
                alt="Stat Minus Icon"
                className="w-10 h-10 object-contain"
              />
            </button>
            {/* Each h2 section with equal gap */}
            <div className="flex items-center gap-8">
              <div>
                <h2 className="text-sm font-semibold text-[#182938]">Python</h2>
                <p className="text-xs text-[#7E8489]">Technology</p>
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#8F96A9]">
                  Debasish Sahoo
                </h2>
                <p className="text-xs text-[#7E8489]">Hiring manager</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="text-left">
              <h3 className="text-sm font-semibold text-[#8F96A9]">10 mins</h3>
              <p className="text-xs text-[#7E8489]">Allocated duration</p>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-[#8F96A9]">09:56</h3>
              <p className="text-xs text-[#7E8489]">Remaining time</p>
            </div>
            <button className="w-15 h-10 border border-[#DFB916] text-[#7E8489] text-xs px-5 py-1 rounded-lg hover:bg-[#DFB916] hover:text-white transition">
              End
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div
          className="flex-1 overflow-y-auto px-8 py-6 bg-white space-y-4
             scrollbar-thin scrollbar-thumb-[#DFB91614] scrollbar-track-[#DFB91614] hover:scrollbar-thumb-[#E5B800]"
        >
          {messages.map((msg) =>
            msg.sender === "bot" ? (
              <div key={msg.id} className="flex">
                <div
                  className="bg-[#DFB91614] text-[#7E8489] px-4 py-2 rounded-xl inline-block max-w-[70%] w-auto break-words"
                >
                  {msg.text}
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex justify-end">
                <div
                  className="bg-[#ECEFF2] text-[#7E8489] px-4 py-2 rounded-lg inline-block max-w-[70%] w-auto break-words"
                >
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
            className="flex-1 border-none bg-[#F8F9FB] px-4 py-3 rounded-xl text-sm text-[#7E848945] focus:outline-none focus:ring-1 focus:ring-[#F4E48A]"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button className="p-3 rounded-xl border border-[#DFB916] hover:bg-[#F4E48A] transition">
            <img
              src="public/assets/icons/mic.svg"
              alt="Mic Icon"
              className="w-5 h-5 object-contain transition group-hover:invert"
            />
          </button>

          <button className="p-3 rounded-xl bg-[#E5B800] hover:bg-[#d6a600] transition">
            <img
              src="public/assets/icons/arrow_forward.svg"
              alt="Send Icon"
              className="w-5 h-5 object-contain"
            />
          </button>
        </div>
      </div>
    </div>
  );
}