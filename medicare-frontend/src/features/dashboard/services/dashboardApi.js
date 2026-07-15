import axios from '../../../lib/axios';

const API_URL = '/api/v1/dashboard';

const dashboardApi = {
  // Get dashboard statistics
  getStats: async () => {
    const { data } = await axios.get(`${API_URL}/stats`);
    return data.data;
  },
  
  // Log adherence (mark as taken, skipped, etc.)
  logAdherence: async (logData) => {
    // Expected to go to a separate adherence endpoint (e.g., POST /api/v1/adherence)
    const { data } = await axios.post('/api/v1/adherence', logData);
    return data.data;
  }
};

export default dashboardApi;
