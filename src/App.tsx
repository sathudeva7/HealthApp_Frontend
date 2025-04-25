import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddPatient from "./pages/AddPatient";
import AddStaff from "./pages/AddStaff";
import PatientDetails from "./pages/PatientDetails";
import PatientsList from "./pages/PatientsList";
import StaffList from "./pages/StaffList";
import StaffDetails from "./pages/StaffDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
        <Route path="/add/patient" element={<AddPatient />} />
        <Route path="/add/staff" element={<AddStaff />} />
        <Route path="/register" element={<Register />} />
        <Route path="/patient/details/:id" element={<PatientDetails />} />
        <Route path="/staff/details/:id" element={<StaffDetails />} />
        <Route path="/patients/all" element={<PatientsList />} />
        <Route path="/staffs/all" element={<StaffList />} />
      </Routes>
    </Router>
  );
}

export default App;
