import api from "./Api";
import Cookies from "js-cookie";

const imageService = {
  createImage: async (imageData, patinetId) => {
    const authToken = Cookies.get("token");

    try {
      const response = await api.post(`/image/${patinetId}`, imageData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      return response;
    } catch (error) {
      if (error.response.status === 401) {
        window.location.href = "/";
      }
      return error;
    }
  },

  getAssignedImages: async (staffId) => {
    const authToken = Cookies.get("token");
    try {
      const response = await api.get(`/image/assigned/${staffId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      return response;
    } catch (error) {
      if (error.response.status === 401) {
        window.location.href = "/";
      }
      return error;
    }
  },

  getImageById: async (id) => {
    const authToken = Cookies.get("token");
    try {
      const response = await api.get(`/image/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      return response;
    } catch (error) {
      if (error.response.status === 401) {
        window.location.href = "/";
      }
      return error;
    }
  },
};

export default imageService;
