import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8086';

export default {
  async createCustomer(customerData) {
    try {
      const response = await axios.post(`${API_URL}/customer/add`, {
        lastname: customerData.lastname,
        firstname: customerData.firstname,
        phone: customerData.phone,
        email: customerData.email
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du client');
    }
  },

  async getCustomerByEmail(email) {
    try {
      const response = await axios.get(`${API_URL}/customer/${email}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du client');
    }
  }
};

