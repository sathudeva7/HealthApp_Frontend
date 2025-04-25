import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import patientService from "../services/patientService";

const PatientsList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        await patientService.getAll().then((response) => {
          if (response.statusText == "OK") {
            setPatients(response.data);
          } else {
            setPatients([]);
            alert(response.message);
          }
        });
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Patients List</h2>
          <button
            onClick={() => navigate("/add/patient")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add New Patient
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">ID</th>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Phone</th>
                <th className="border px-4 py-2 text-left">Condition</th>
                <th className="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients?.map((patient) => (
                <tr key={patient?.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{patient?.id}</td>
                  <td className="border px-4 py-2">{patient?.name}</td>
                  <td className="border px-4 py-2">{patient?.email}</td>
                  <td className="border px-4 py-2">{patient?.phone}</td>
                  <td className="border px-4 py-2">{patient?.conditions}</td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      onClick={() =>
                        navigate(`/patient/details/${patient?.id}`)
                      }
                      className="text-blue-500 hover:underline mr-4"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        console.log(`Delete patient with ID: ${patient.id}`)
                      }
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientsList;
