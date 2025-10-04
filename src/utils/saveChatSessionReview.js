export const saveChatSession = async ({ userId, hrId, topic, fullConversation }) => {
    try {
        await fetch("http://122.163.121.176:3004/chat-session-review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            hr_id: hrId,
            topic: topic,
            chat_history: fullConversation,
            total_time: 10,
            use_lstm: false,
          }),
        });
        console.log("✅ Final conversation saved");
    } catch (error) {
        console.error("❌ Error saving conversation:", error);
    }
};

export const greettingMessage = async ({ username, topic, userinput }) => {
    try {
        const response = await fetch(
          "http://122.163.121.176:3004/start_session",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: username,
              topic_name: topic,
              user_input: userinput,
            }),
          }
        );
        console.log("✅ Final conversation saved");
        return response;
    } catch (error) {
        console.error("❌ Error saving conversation:", error);
    }
}