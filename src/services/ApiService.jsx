
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to ensure proper URL construction
const buildURL = (endpoint) => {
  const baseUrl = BASE_URL?.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
  const cleanEndpoint = endpoint?.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

export const getURL = {
  GetAllUser: `${BASE_URL}/get-all-users`,

};

export const postURL = {
  login: `${BASE_URL}/auth/login`,
  getAllTopics: `${BASE_URL}/get-topics`,
  getQuestions: `${BASE_URL}/get-questions`,
  requestTopic: `${BASE_URL}/insert-user-topic`,
  hrDashboard: `${BASE_URL}/hr-dashboard`,
  // Corrected HR dashboard endpoint
  hrDashboardUnderscore: `${BASE_URL}/hr_dashboard`,
  insertUserTopic: `${BASE_URL}/insert-user-topic`,
  hrTopicCandidate: `${BASE_URL}/hr-topics-candidates`,
  getScheduleDataHrWise: `${BASE_URL}/get-schedule-data-hr-wise`,
  // Manage schedule endpoints
  getUserTopicById: `${BASE_URL}/get-user-topic-by-id`,
  updateUserTopic: `${BASE_URL}/update-user-topic`,
  deleteUserTopic: `${BASE_URL}/delete-user-topic`,
  // candidate dashboard endpoint
  dashboard: `${BASE_URL}/candidate_dashboard`,
  // Chat-related endpoints
  getSessionStatus: `${BASE_URL}get_session_status`,
  startSession: `${BASE_URL}start_session`,
  chat: `${BASE_URL}chat`,
  hrSessions: `${BASE_URL}hr-sessions`,
};

// Convenience helper: fetch HR dashboard with { hr_id }
export const fetchHrDashboard = async (hr_id) => {
  return fatchedPostRequest(postURL.hrDashboardUnderscore, { hr_id });
};

// Chat API functions
export const checkSessionStatus = async (userId, hrId, topic) => {
  const pad = (n) => String(n).padStart(2, '0');
  const nowDate = new Date();
  const nowFormatted = `${nowDate.getFullYear()}-${pad(nowDate.getMonth() + 1)}-${pad(nowDate.getDate())} ${pad(nowDate.getHours())}:${pad(nowDate.getMinutes())}:${pad(nowDate.getSeconds())}`;

  console.log("🔍 Calling checkSessionStatus with:", {
    user_id: userId,
    hr_id: hrId,
    topic: topic,
    now: nowFormatted
  });
  console.log("🌐 API URL:", postURL.getSessionStatus);

  return fatchedPostRequest(postURL.getSessionStatus, {
    user_id: userId,
    hr_id: hrId,
    topic: topic,  // Backend expects 'topic', not 'topic_name'
    now: nowFormatted
  });
};

export const startChatSession = async (name, topicName, userInput = "") => {
  return fatchedPostRequest(postURL.startSession, {
    name: name,
    topic_name: topicName,
    user_input: userInput
  });
};

export const sendChatMessage = async (sessionId, topic, time, userInput, language = "English", userId, hrId) => {
  return fatchedPostRequest(postURL.chat, {
    session_id: sessionId?.toString(),
    topic: topic,
    time: time?.toString() || "10",
    user_input: userInput,
    language: language,
    user_id: userId,
    hr_id: hrId,
  });
};

const fetchWithRetry = async (url, options, retries = 3, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      // If response is not ok, but it's a client error (4xx), don't retry.
      if (!response.ok && response.status >= 400 && response.status < 500) {
        return await response.json();
      }
      // If it's a server error (5xx) or other network issue, it will be caught below.
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed for ${url}: ${error.message}`);
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, delay));
      } else {
        // If this was the last attempt, re-throw the error.
        throw new Error(`Error fetching data after ${retries} attempts: ${error.message}`);
      }
    }
  }
};

export const fatchedGetRequest = async (url) => {
  const options = {
    method: 'GET',
    headers: {
      // 'Authorization': jwtToken,
    },
  };
  return fetchWithRetry(url, options);
};

export const fatchedPostRequest = async (url, body) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': jwtToken,
    },
    body: JSON.stringify(body),
  };
  return fetchWithRetry(url, options);
};
