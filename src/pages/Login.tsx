import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import staffService from "../Services/StaffService";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "Staff",
  });
  const [isLoginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await staffService.login(formData).then((response) => {
      if (response.status == 200) {
        Cookies.set("loggedInUserId", response.data.id);
        Cookies.set("token", response.data.token);
        setLoggedInUser(response.data);
        setLoginSuccess(true);
      } else {
        setLoginSuccess(false);
        alert(response.message);
      }
    });
  };

  useEffect(() => {
    if (isLoginSuccess) {
      if (loggedInUser.role == "Patient") {
        navigate(`/patient/details/${loggedInUser.id}`);
      } else {
        navigate("/home");
      }
    }
  }, [isLoginSuccess]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="password"
            >
              User Type
            </label>
            <select
              id="userType"
              type="select"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter your password"
              required
            >
              <option value="Staff">Staff</option>
              <option value="Patient">Patient</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Login
          </button>
          <p className="text-sm text-center text-gray-600 mt-4">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
