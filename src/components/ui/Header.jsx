import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import React, { useEffect, useState, useRef, useContext } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../provider/AuthProvider";
import { useTopic } from "../../provider/TopicProvider";
import { saveChatSession } from "../../utils/saveChatSessionReview";
import { UserContext } from "../../context/Context";

export default function Header() {
  const [formattedDate, setFormattedDate] = useState('');
  const [formattedTime, setFormattedTime] = useState('');
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const { logout } = useAuth();
  const { getTopicData } = useTopic();
  const navigate = useNavigate();
  const topicData = getTopicData;
  const userRole = sessionStorage.getItem("userRole")?.toLowerCase() || "";
  const userId = parseInt(sessionStorage.getItem("user_id"), 10);
  const matchedRecord = topicData.find(item => item.user_id === userId);
  const hrId = matchedRecord?.hr_id || null;
  const { setUserData } = useContext(UserContext);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const dateOptions = { month: 'long', day: 'numeric', weekday: 'long' };
      const dateParts = new Intl.DateTimeFormat('en-US', dateOptions).formatToParts(now);
      const month = dateParts.find(part => part.type === 'month').value;
      const day = dateParts.find(part => part.type === 'day').value;
      const weekday = dateParts.find(part => part.type === 'weekday').value;
      const dateString = `${month} ${day}  ${weekday}`;
      const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
      const timeString = new Intl.DateTimeFormat('en-US', timeOptions).format(now);
      setFormattedDate(dateString);
      setFormattedTime(timeString);
    };
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = async () => {
    navigate("/");
    if (userRole === "candidate") {
      const topic = sessionStorage.getItem("topic");
      const conversation = JSON.parse(sessionStorage.getItem("fullConversation"));
      const aiResponse = sessionStorage.getItem("aiResponse");
      if (!aiResponse.includes("time is up")) {
        await saveChatSession({
          userId,
          hrId,
          topic,
          fullConversation: conversation
        });
      }
    }
    logout();
  };

  return (
    <header className="flex justify-between items-center bg-white px-6 h-[calc(9%)] border-b border-[#BCC7D2] shadow-sm">
      <div className="items-center flex justify-between items-center w-full">
        <div className="flex">
          <p className="w-full flex text-xl md:text-xl text-[#2C2E42]">
            A<span className="text-[#DFB916]">ii</span>nhome
            <span className="px-1">|</span>
            <span className="font-bold">CB</span>
          </p>
        </div>
        <div className='flex items-center justify-end w-full gap-6'>
          <div className="flex flex-col text-end font-medium">
            <p className='p-0 m-0 text-[#2C2E42] text-sm'>{formattedDate}</p>
            <p className='p-0 m-0 text-[#7E8489] text-xs'>{formattedTime}</p>
          </div>
          <LogoutRoundedIcon
            sx={{ color: "#7E8489" }}
            className='cursor-pointer'
            onClick={() => setShowLogoutPopup(true)}
          />
        </div>
      </div>
     {showLogoutPopup && (
  <div
    className="fixed inset-0 flex items-center justify-center z-50"
    style={{
      background: "rgba(0,0,0,0.18)",
      backdropFilter: "blur(6px)"
    }}
  >
    <div className="bg-white rounded-xl shadow-lg p-8 min-w-[320px] text-center">
      <h2 className="text-lg font-semibold mb-4 text-[#2C2E42]">Logout</h2>
      <p className="mb-6 text-[#7E8489]">Are you sure you want to logout?</p>
      <div className="flex justify-center gap-4">
        <button
          className="px-6 py-2 rounded-lg bg-[#E5B800] text-[#272727] font-semibold"
          onClick={async () => {
            setShowLogoutPopup(false);
            await handleLogout();
          }}
        >
          Yes
        </button>
        <button
          className="px-6 py-2 rounded-lg bg-gray-200 text-[#272727] font-semibold"
          onClick={() => setShowLogoutPopup(false)}
        >
          No
        </button>
      </div>
    </div>
  </div>
)}
    </header>
  );
}