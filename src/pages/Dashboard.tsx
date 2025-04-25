import Cookies from "js-cookie";

const Dashboard = () => {
  const logout = () => {
    Cookies.remove("loggedInUserId");
    Cookies.remove("token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">IMS Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/profile" className="text-gray-600 hover:text-blue-600">
                Profile
              </a>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">
          Welcome to the Dashboard
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card: Patients */}
          <a
            href="/patients/all"
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-lg font-bold text-gray-700">Manage Patients</h3>
            <p className="text-gray-500 mt-2">
              View and manage patient records.
            </p>
          </a>

          {/* Card: Staff */}
          <a
            href="/staffs/all"
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-lg font-bold text-gray-700">Manage Staff</h3>
            <p className="text-gray-500 mt-2">View and manage staff details.</p>
          </a>

          {/* Card: Upload Images */}
          <a
            href="/images/upload"
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-lg font-bold text-gray-700">Upload Images</h3>
            <p className="text-gray-500 mt-2">
              Upload and classify medical images.
            </p>
          </a>

          {/* Card: Financial Records */}
          <a
            href="/financials"
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-lg font-bold text-gray-700">
              Financial Records
            </h3>
            <p className="text-gray-500 mt-2">
              View and manage financial information.
            </p>
          </a>

          {/* Card: Reports */}
          <a
            href="/reports"
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-lg font-bold text-gray-700">
              Generate Reports
            </h3>
            <p className="text-gray-500 mt-2">
              Generate and view detailed reports.
            </p>
          </a>

          {/* Card: Settings */}
          <a
            href="/settings"
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition"
          >
            <h3 className="text-lg font-bold text-gray-700">Settings</h3>
            <p className="text-gray-500 mt-2">
              Configure application settings.
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
