import axios from 'axios';

const API_URL = 'http://localhost:5555/api/todo';

export const getToDoTasks = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching to-do items:", error);
  }
  return [];
};

// export const setToDoTaskCompleted = (task) => axios.post(API_URL)