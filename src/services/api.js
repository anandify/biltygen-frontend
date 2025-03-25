// src/services/api.js
import axios from 'axios';

const API_URL = 'https://biltygen-backend.onrender.com';

const api = {
  // Bilty endpoints
  getBilties: () => axios.get(`${API_URL}/bilties`),
  getBilty: (id) => axios.get(`${API_URL}/bilties/${id}`),
  createBilty: (biltyData) => axios.post(`${API_URL}/bilties`, biltyData),
  
  // Consignor endpoints
  getConsignors: () => axios.get(`${API_URL}/consignors`),
  createConsignor: (consignorData) => axios.post(`${API_URL}/consignors`, consignorData),
  
  // Consignee endpoints
  getConsignees: () => axios.get(`${API_URL}/consignees`),
  createConsignee: (consigneeData) => axios.post(`${API_URL}/consignees`, consigneeData),
  
  // Driver endpoints
  getDrivers: () => axios.get(`${API_URL}/drivers`),
  createDriver: (driverData) => axios.post(`${API_URL}/drivers`, driverData),
};

export default api;
