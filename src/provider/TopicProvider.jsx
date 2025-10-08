import React, { useEffect } from "react";
import { fatchedPostRequest, postURL } from "../services/ApiService";
import { useAuth } from "./AuthProvider";

const topicContext = React.createContext({
  isAuthenticated: () => false,
  handleTopic: () => Promise.resolve(),
  getTopicData: [],
  isLoading: false,
  isError: false,
});

export const TopicProvider = ({ children }) => {
  const { isLoading: authLoading, isError: authError } = useAuth();
  
  const [getTopicData, setTopicData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  // Get user data from session storage
  // Check if user is authenticated
  // const isAuthenticated = () => !!sessionStorage.getItem("success");
  const getUserID = sessionStorage.getItem("user_id");

  const handleTopic = async (data) => {
    // console.log("data", data);
    setIsLoading(true);
    try {
      const response = await fatchedPostRequest(postURL.getAllTopics, data);
      if (response.success || response.status === 200) {
        // console.log(" handleTopic: ", response);
        setTopicData(response.topics);
        try {
          // Persist total_time for the current user into sessionStorage so chat can read it
          const currentUserId = String(getUserID || "");
          const matched = (response.topics || []).find(t => String(t.user_id) === currentUserId);
          if (matched && matched.total_time != null) {
            sessionStorage.setItem('session_total_time', String(matched.total_time));
          }
        } catch (err) {
          console.warn('Could not persist session_total_time:', err);
        }
        setIsLoading(false);
        return { success: true };
      } else {
        console.log("api calling failed:", response.message);
        // alert(response.message || "api calling failed");
        setIsLoading(false);
        setIsError(true);
        return { success: false };
      }
    } catch (error) {
      // Handle error during login
      setIsLoading(false);
      setIsError(true);
      console.error("Error during calling:", error);
      // alert("An error occurred while logging in. Please try again.");
      return { success: false };
    }
  };

  // Automatically call API if user_id exists
  useEffect(() => {
    if (authLoading && authError) {
      console.error("AuthProvider is not ready yet");
      return (
        <>
          <div>Loading ...</div>
        </>
      );
    }
    (async () => {
      if (getUserID) {
        const response = await handleTopic({ user_id: getUserID });
        if (!response.success) {
          console.error("Failed to fetch topics");
        }
      }
    })();
  }, [getUserID]);

  return (
    <topicContext.Provider
      value={{
        handleTopic,
        getTopicData,
        isLoading,
        isError,
      }}
    >
      {children}
    </topicContext.Provider>
  );
};

export const useTopic = () => {
  const context = React.useContext(topicContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
