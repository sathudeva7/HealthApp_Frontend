import api from "./Api";
import Cookies from "js-cookie";

const staffService = {
  getAll: async () => {
    const authToken = Cookies.get("token");
    try {
      const response = await api.get("/staff", {
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

  getById: async (id) => {
    const authToken = Cookies.get("token");
    try {
      const response = await api.get(`/staff/${id}`, {
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

  addStaff: async (staffData) => {
    const authToken = Cookies.get("token");

    try {
      const response = await api.post("/staff", staffData, {
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

  assignStaff: async (imageId, staffId) => {
    const authToken = Cookies.get("token");

    try {
      const response = await api.put(
        `/image/assign/staff/${imageId}`,
        { assignedTo: staffId },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      return response;
    } catch (error) {
      if (error.response.status === 401) {
        window.location.href = "/";
      }
      return error;
    }
  },

  login: async (staffData) => {
    try {
      const response = await api.post("/staff/login", staffData);
      return response;
    } catch (error) {
      return error;
    }
  },
};

export default staffService;
