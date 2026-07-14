import axios from '../../../lib/axios'; // Centralized axios instance

const API_URL = '/api/v1/medicines';

const medicineApi = {
  // Get all medicines with pagination, search, and filtering
  getMedicines: async (params) => {
    const { data } = await axios.get(API_URL, { params });
    return data;
  },

  // Get a single medicine by ID
  getMedicine: async (id) => {
    const { data } = await axios.get(`${API_URL}/${id}`);
    return data.data;
  },

  // Create a new medicine
  createMedicine: async (medicineData) => {
    const { data } = await axios.post(API_URL, medicineData);
    return data.data;
  },

  // Update a medicine
  updateMedicine: async ({ id, medicineData }) => {
    const { data } = await axios.put(`${API_URL}/${id}`, medicineData);
    return data.data;
  },

  // Delete a medicine
  deleteMedicine: async (id) => {
    const { data } = await axios.delete(`${API_URL}/${id}`);
    return data;
  }
};

export default medicineApi;
