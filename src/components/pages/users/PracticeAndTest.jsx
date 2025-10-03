import React, { useState, useEffect, use } from 'react'
import TextReader from "../chatbot/textReader";
import { greettingMessage } from '../../../utils/saveChatSessionReview';
import Loader from '../../ui/Loader';

export default function PracticeAndTest() {
  const [chatStarted, setChatStarted] = useState(false); //lifted state
  const [isTerminated, setIsTerminated] = useState(false);
  const [startMessage, setStartMessage] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // For showing loader
  const fullName = sessionStorage.getItem("userName");
  console.log("fullName", fullName)


  const userName = fullName.split(" ")[0];
  console.log("userName", userName)
  useEffect(() => {
    if (userName !== "") {
      const fetchStartMessage = async () => {
        setIsLoading(true); // Show loader
        try {
          const res = await greettingMessage({
            username: userName,
            topic: "userName",
            userinput: "",
          });
          const data = await res.json();
          const aiMsg = data?.message || "Welcome!";
          const aiMessageObj = {
            role: "ai",
            message: aiMsg,
            time: new Date().toLocaleTimeString(),
          };
          setStartMessage([aiMessageObj]);
        } catch (error) {
          console.error("Error fetching start message:", error);
        } finally {
          setIsLoading(false); // Hide loader
        }
      };

      fetchStartMessage();
    }
  }, [userName]);

  return (
    <div className="flex-1 gap-0 flex flex-col">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Loader show={true} />
        </div>
      ) : (
        <TextReader
          chatStarted={chatStarted}
          setChatStarted={setChatStarted}
          isTerminated={isTerminated}
          setIsTerminated={setIsTerminated}
          startMessage={startMessage}
        />
      )}
    </div>
  );

}
