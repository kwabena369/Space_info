import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = {
  async getAllExamples() { 
    try {
      const response = await axios.get(`${API_URL}/examples`);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async createExample(data) {
    try {
      const response = await axios.post(`${API_URL}/examples`, data);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};