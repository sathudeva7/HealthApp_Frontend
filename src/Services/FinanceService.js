import api from "./Api";
import Cookies from "js-cookie";

const financeService = {
  getFinanceById: async (id) => {
    const authToken = Cookies.get("token");
    try {
      const response = await api.get(`/finance/patient/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      return response;
    } catch (error) {
      console.log(error.response.status);
      if (error.response.status === 401) {
        window.location.href = "/";
      }
      return error;
    }
  },

  saveFinance: async (reportData, id) => {
    const authToken = Cookies.get("token");

    try {
      const response = await api.post(`/finance/${id}`, reportData, {
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

export default financeService;
