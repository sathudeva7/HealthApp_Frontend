import api from "./Api";
import Cookies from "js-cookie";

const reportService = {
  saveReport: async (imageId, reportData) => {
    const authToken = Cookies.get("token");
    console.log(reportData);
    try {
      const response = await api.post(`/report/${imageId}`, reportData, {
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

export default reportService;
