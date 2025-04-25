import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FinanceModal from "./FinanceModal";
import financeService from "../Services/FinanceService";

const FinancialTable = () => {
  const { id } = useParams<{ id: string }>();
  const [financialData, setFinancialData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const listFinance = async (id) => {
      await financeService.getFinanceById(id).then((response) => {
        if (response.status == 200) {
          setFinancialData(response.data);
        } else {
          alert(response.message);
        }
      });
    };

    listFinance(id);
  }, []);

  const handleAddFinance = (newFinance: any) => {
    setFinancialData((prevData) => [
      ...prevData,
      { id: prevData.length + 1, ...newFinance }, // Add a new record with incremental ID
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-6">Financial Records</h2>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-500 text-white px-2 py-2 rounded-lg hover:bg-blue-600"
          >
            Add Finance
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Description</th>
                <th className="border px-4 py-2 text-left">Amount</th>
                <th className="border px-4 py-2 text-left">Date</th>
                <th className="border px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {financialData.length > 0 &&
                financialData?.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{record?.description}</td>
                    <td className="border px-4 py-2">{record?.amount}</td>
                    <td className="border px-4 py-2">
                      {new Date(record?.transactionDate).toDateString()}
                    </td>
                    <td className="border px-4 py-2">
                      {record?.paymentStatus == "Paid" ? (
                        <span className="text-green-500">Paid</span>
                      ) : (
                        <span className="text-red-500">Unpaid</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <FinanceModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleAddFinance}
        />
      )}
    </div>
  );
};

export default FinancialTable;
