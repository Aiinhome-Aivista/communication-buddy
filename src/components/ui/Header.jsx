import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import React, { useEffect, useState, useRef, useContext } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../provider/AuthProvider";
import { useTopic } from "../../provider/TopicProvider";
import { saveChatSession } from "../../utils/saveChatSessionReview";
import { UserContext } from "../../context/Context";
import Tooltip from '@mui/material/Tooltip';
import LogoutModal from '../modal/LogoutModal';

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
      if (aiResponse && !aiResponse.includes("time is up")) {
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
          <Tooltip title="Logout" arrow>
            <LogoutRoundedIcon
              sx={{ color: "#7E8489" }}
              className='cursor-pointer'
              onClick={() => setShowLogoutPopup(true)}
            />
          </Tooltip>
        </div>
      </div>
      <LogoutModal
        isOpen={showLogoutPopup}
        onClose={() => setShowLogoutPopup(false)}
        onConfirm={handleLogout}
      />
    </header>
  );
}