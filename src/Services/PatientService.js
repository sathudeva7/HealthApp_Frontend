import api from "./Api";
import Cookies from "js-cookie";

const patientService = {
  getAll: async () => {
    const authToken = Cookies.get("token");
    const response = await api.get("/patient", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response;
  },

  getById: async (id) => {
    const authToken = Cookies.get("token");
    try {
      const response = await api.get(`/patient/${id}`, {
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

  addPatient: async (patientData) => {
    const authToken = Cookies.get("token");

    const response = await api.post("/patient", patientData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response;
  },
};

export default patientService;
