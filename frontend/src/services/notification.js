import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default {
  async getNotifications() {
    const authStore = useAuthStore();
    try {
      const response = await axios.get(`${API_URL}/notifications`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des notifications');
    }
  },

  async markAsRead(notificationId) {
    const authStore = useAuthStore();
    try {
      const response = await axios.put(`${API_URL}/notifications/${notificationId}/read`, {}, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du marquage de la notification comme lue');
    }
  },

  async subscribe(topics) {
    const authStore = useAuthStore();
    try {
      const response = await axios.post(`${API_URL}/notifications/subscribe`, { topics }, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'abonnement aux notifications');
    }
  },

  async unsubscribe(topics) {
    const authStore = useAuthStore();
    try {
      const response = await axios.post(`${API_URL}/notifications/unsubscribe`, { topics }, {
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors du désabonnement aux notifications');
    }
  }
};