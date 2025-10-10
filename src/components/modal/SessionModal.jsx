import React from "react";
import { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <div
    className="relative w-full"
    onClick={onClick}
    style={{ cursor: "pointer" }}
  >
    <input
      ref={ref}
      value={value}
      placeholder={placeholder}
      readOnly
      className="w-full border border-[#BCC7D2] rounded-xl px-35 py-2.5 text-sm bg-white pr-10 h-[38px] focus:outline-none focus:ring-2 focus:ring-[#E5B800]"
    />
    <img
      src="public/assets/icons/calendar_month.svg" 
      alt="calendar"
      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#BCC7D2]"
    />
  </div>
));


export default function SessionModal({
  open,
  onClose,
  sessionDuration,
  setSessionDuration,
  onSave,
}) {
  if (!open) return null;
  const [Date, setDate] = useState(null);

  const [sessionTopic, setSessionTopic] = useState("");

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[800px] max-w-full h-[600px] max-h-full flex flex-col overflow-hidden shadow-lg">
        <div className="border-b border-[#BCC7D2] px-8 py-4"></div>
        <form className="flex-1 overflow-y-auto px-8 py-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className="block text-[#2C2E42] font-medium mb-2">
                Candidate Name
              </label>
              <select className="w-full border border-[#BCC7D2] rounded-xl px-4 py-2 text-sm bg-white">
                <option>Select candidate</option>
              </select>
            </div>
            <div>
              <label className="block text-[#2C2E42] font-medium mb-2">
                Session Date Time
              </label>
              <div className="flex">
                <DatePicker
                  selected={Date}
                  onChange={setDate}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="DD/MM/YYYY"
                  customInput={<CustomInput />}
                  popperPlacement="bottom"
                />
              </div>
            </div>
            <div>
              <label className="block text-[#2C2E42] font-medium mb-2">
                Session Category
              </label>
              <select className="w-full border border-[#BCC7D2] rounded-xl px-4 py-2 text-sm bg-white">
                <option>Select category</option>
              </select>
            </div>
  <div>
      <label className="block text-[#2C2E42] font-medium mb-2">
        Session Duration
      </label>

      <div className="flex items-center gap-4">
        {/* Number box (click to increase/decrease) */}
        <input
          type="number"
          value={sessionDuration.value}   // ✅ show number properly
          readOnly
          onClick={() => {
            setSessionDuration((prev) => {
              if (prev.direction === "up") {
                const newVal = Math.max(5, prev.value - 5);
                return { value: newVal, direction: "down" };
              } else {
                const newVal = Math.min(50, prev.value + 5);
                return { value: newVal, direction: "up" };
              }
            });
          }}
          className="w-16 border border-[#BCC7D2] rounded-xl px-2 py-1 text-sm bg-[#F6F6F6] text-center cursor-pointer"
        />

        {/* Range slider */}
        <input
          type="range"
          min={5}
          max={50}
          step={5}
          value={sessionDuration.value}
          onChange={(e) =>
            setSessionDuration({
              value: Number(e.target.value),
              direction: "up",
            })
          }
          className="w-48 accent-[#E5B800]"
        />

        {/* <span className="text-[#2C2E42] text-sm">
          {sessionDuration.value} mints
        </span> */}
      </div>

      <div className="flex justify-between text-xs text-[#8F96A9] mt-1 px-1">
        <span>5 mints</span>
        <span>45 mints</span>
      </div>
    </div>

          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Topic
            </label>
            <textarea
              value={sessionTopic}
              onChange={(e) => setSessionTopic(e.target.value)}
              placeholder="Write session topic..."
              rows="4"
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </form>

        <div className="border-t border-[#BCC7D2] px-8 py-4 flex justify-end bg-white sticky bottom-0">
          <button
            type="button"
            className="bg-gray-200 text-[#272727] font-semibold px-8 py-2 rounded-xl mr-3"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="bg-[#E5B800] hover:bg-yellow-500 text-[#272727] font-semibold px-8 py-2 rounded-xl"
            onClick={() => {
              if (onSave) onSave({
                date: Date,
                sessionTopic,
                duration: sessionDuration?.value ?? sessionDuration,
              });
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}