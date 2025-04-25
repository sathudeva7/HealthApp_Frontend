import React, { useState } from "react";
import { useParams } from "react-router-dom";
import financeService from "../Services/FinanceService";

interface FinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (financeData: {
    patientName: string;
    treatment: string;
    cost: string;
    date: string;
    status: string;
  }) => void;
}

const FinanceModal: React.FC<FinanceModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    status: "Unpaid",
  });

  const { id } = useParams();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async () => {
    onSave(formData);
    const currentDate = new Date();

    const data = {
      description: formData.description,
      amount: formData.amount,
      transactionDate: currentDate,
      paymentStatus: formData.status,
    };

    await financeService.saveFinance(data, id).then((response) => {
      if (response.status == 201) {
        alert("Report saved successfully");
      } else {
        alert(response.message);
      }
    });

    onClose(); // Close the modal after saving
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-bold mb-4">Add Finance</h2>

        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="description"
          >
            Description
          </label>
          <input
            id="description"
            name="description"
            type="text"
            value={formData.description}
            onChange={handleChange}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Enter description details"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="amount"
          >
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="text"
            value={formData.amount}
            onChange={handleChange}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            placeholder="Enter amount"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="status"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          >
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinanceModal;
