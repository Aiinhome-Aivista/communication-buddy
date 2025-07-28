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
    const { getUserData } = useAuth();
    const [getTopicData, setTopicData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState(false);


    // Check if user is authenticated
    const isAuthenticated = () => !!sessionStorage.getItem("success");


    const handleTopic = async (data) => {
        console.log('data', data)
        setIsLoading(true);
        try {
            const response = await fatchedPostRequest(postURL.getAllTopics, data);
            if (response.success || response.status === 200) {
                console.log(" handleTopic: ", response);
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
        if (getUserData?.user_id) {
            handleTopic({ user_id: getUserData.user_id });
        }
    }, [getUserData]);

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
