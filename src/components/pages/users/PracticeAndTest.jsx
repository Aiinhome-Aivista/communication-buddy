import React, { useState, useEffect, use } from 'react'
import TextReader from "../chatbot/textReader";
import { greettingMessage } from '../../../utils/saveChatSessionReview';

export default function PracticeAndTest() {
  const [chatStarted, setChatStarted] = useState(false); //lifted state
  const [isTerminated, setIsTerminated] = useState(false);
  const [startMessage, setStartMessage] = useState([]);
  const fullName = sessionStorage.getItem("userName");
  console.log("fullName", fullName)


  const userName = fullName.split(" ")[0];
  console.log("userName", userName)
  useEffect(() => {
    console.log("userName1", userName)
    if (userName !== "") {
      console.log("calling")
      const fetchStartMessage = async () => {
        try {
          // const res = await fetch("http://122.163.121.176:3004/start_session", {
          //   method: "POST",
          //   headers: { "Content-Type": "application/json" },
          //   body: JSON.stringify({
          //     name: userName,
          //     topic_name: userName,
          //     user_input: ""
          //   }),
          // });
          const res = await greettingMessage({
            username: userName,
            topic: "userName",
            userinput: "",
          });
          const data = await res.json();
          const aiMsg = data?.message || "Welcome!";

          // রেসপন্স state এ সেভ করব


          // UI তে মেসেজ দেখানোর জন্যও সেভ
          const aiMessageObj = { role: "ai", message: aiMsg, time: new Date().toLocaleTimeString() };
          setStartMessage([aiMessageObj]);

        } catch (error) {
          console.error("Error fetching start message:", error);
        }
      };

      fetchStartMessage();
    }

  }, [userName]);
  return (
    <div className="flex-1 gap-0  flex flex-col ">
      <TextReader
        chatStarted={chatStarted}
        setChatStarted={setChatStarted}
        isTerminated={isTerminated}
        setIsTerminated={setIsTerminated}
        startMessage={startMessage}
      />
    </div>
  )
}
