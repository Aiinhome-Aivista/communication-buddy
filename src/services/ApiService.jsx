
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
  insertUserTopic: `${BASE_URL}/insert-user-topic`,
  hrTopicCandidate: `${BASE_URL}/hr-topics-candidates`,
  getScheduleDataHrWise: `${BASE_URL}/get-schedule-data-hr-wise`,
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
