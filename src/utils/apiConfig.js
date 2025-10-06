// utils/apiConfig.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost';

export const API_ENDPOINTS = {
  REPORTS_GENERATION: `${API_BASE_URL}/api/v1/rest/reports/generation/json`,
  // Add other endpoints as needed
  // USERS: `${API_BASE_URL}/api/v1/users`,
  // BUDGETS: `${API_BASE_URL}/api/v1/budgets`,
};

export const getApiUrl = (endpoint) => {
  return API_ENDPOINTS[endpoint] || endpoint;
};

export default API_ENDPOINTS;