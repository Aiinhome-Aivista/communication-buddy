import React, { useState } from 'react'
import TextReader from "../chatbot/textReader";

export default function PracticeAndTest() {
  const [chatStarted, setChatStarted] = useState(false); //lifted state
  const [isTerminated, setIsTerminated] = useState(false);

  return (
    <div className="flex-1 gap-0  flex flex-col ">
      <TextReader 
        chatStarted={chatStarted}
        setChatStarted={setChatStarted} 
        isTerminated={isTerminated} 
        setIsTerminated={setIsTerminated}
      />
    </div>
  )
}
