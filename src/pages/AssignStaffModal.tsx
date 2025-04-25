import React, { useEffect, useState } from "react";
import staffService from "../services/staffService";

interface AssignStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (staffId: number) => void;
}

const AssignStaffModal: React.FC<AssignStaffModalProps> = ({
  isOpen,
  onClose,
  onAssign,
}) => {
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    const fetchAllStaffs = async () => {
      await staffService.getAll().then((response) => {
        if (response.statusText == "OK") {
          setStaffList(response.data);
        } else {
          setStaffList([]);
        }
      });
    };

    fetchAllStaffs();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-bold mb-4">Assign Staff</h2>
        <ul>
          {staffList.map((staff) => (
            <li
              key={staff?.id}
              className="px-4 py-2 border-b hover:bg-gray-100 cursor-pointer"
              onClick={() => onAssign(staff?.id)}
            >
              {staff?.name}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AssignStaffModal;
