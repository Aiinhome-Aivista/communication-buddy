import { fatchedPostRequest, postURL } from "../services/ApiService";
import {UserContext} from "../context/Context";
import { useContext } from "react";
const {totalSessionTime} = useContext(UserContext);

export const saveChatSession = async ({
  userId,
  hrId,
  topic,
  fullConversation,
}) => {
  try {
    await fatchedPostRequest(postURL.chatSessionReview, {
      user_id: userId,
      hr_id: hrId,
      topic: topic,
      chat_history: fullConversation,
      total_time: totalSessionTime,
      use_lstm: false,
    });
    console.log("✅ Final conversation saved");
  } catch (error) {
    console.error("❌ Error saving conversation:", error);
  }
};
 
export const greettingMessage = async ({ username, topic, userinput }) => { // Renamed from greettingMessage to greetingMessage
  try {
    const response = await fatchedPostRequest(postURL.startSession, {
      name: username,
      topic_name: topic,
      user_input: userinput,
    });
    // The original function had a console.log here, but the response was returned.
    // fatchedPostRequest already handles JSON parsing.
    return response;
  } catch (error) {
    console.error("❌ Error starting session:", error);
    // Re-throwing or returning a specific error structure might be useful here.
    throw error;
  }
};
