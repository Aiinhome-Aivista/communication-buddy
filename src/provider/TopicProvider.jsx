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
  if (authLoading || authError) {
    console.error("AuthProvider is not ready yet");
    return (
      <>
        <div>Loading ...</div>
      </>
    );
  }
  const [getTopicData, setTopicData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  // Get user data from session storage
  const getUserID = sessionStorage.getItem("user_id");
  // Check if user is authenticated
  const isAuthenticated = () => !!sessionStorage.getItem("success");

  const handleTopic = async (data) => {
    // console.log("data", data);
    setIsLoading(true);
    try {
      const response = await fatchedPostRequest(postURL.getAllTopics, data);
      if (response.success || response.status === 200) {
        // console.log(" handleTopic: ", response);
        setTopicData(response.topics);
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
      alert("An error occurred while logging in. Please try again.");
      return { success: false };
    }
  };
  // Automatically call API if user_id exists
  useEffect(() => {
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
        isAuthenticated,
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
