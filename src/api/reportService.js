import axios from 'axios';

const API_URL = 'http://localhost/api/v1/rest/reports/generation/json';

export const generateReport = async (individualHeaders, totalHeaders) => {
  const payload = {
    reports: [{ report_name: "Sample Report", lines: ["Line 1"] }],
    inputs: [],
    individual_headers: individualHeaders,
    total_headers: totalHeaders,
  };

  const config = {
    headers: {
      Authorization: `Bearer <PUT-YOUR-TOKEN-HERE>`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  const response = await axios.post(API_URL, payload, config);
  return response.data;
};