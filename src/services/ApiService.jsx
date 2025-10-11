
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
  
  return fatchedPostRequest(postURL.getSessionStatus, {
    user_id: userId,
    hr_id: hrId,
    topic: topic,
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

export const sendChatMessage = async (sessionId, topic, time, userInput, language = "English") => {
  return fatchedPostRequest(postURL.chat, {
    session_id: sessionId?.toString(),
    topic: topic,
    time: time?.toString() || "10",
    user_input: userInput,
    language: language
  });
};


export const fatchedGetRequest = async (url) => {
  //   const jwtToken = sessionStorage.getItem('Token')
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        // 'Authorization': jwtToken,
      },
    })
    if (!response.ok) {
      return await response.json();
      // throw new Error(`Network response was not ok`);
    }
    return await response.json()
  }
  catch (e) {
    throw new Error(`Error fetchin data: ${e.message}`);
  }
}

export const fatchedPostRequest = async (url, body) => {
  //   const jwtToken = sessionStorage.getItem('Token')
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': jwtToken,
      },
      body: JSON.stringify(body),
    });

    // console.log(response);

    if (!response.ok) {
      return await response.json();
      // throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
}
