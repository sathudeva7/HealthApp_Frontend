import React, { useEffect, useState } from "react";
import imageService from "../services/ImageService";

interface ReportModalProps {
  isOpen: boolean;
  image: { id: number; filePath: string; note: string } | null;
  onClose: () => void;
  onSave: (id: number, report: string) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  image,
  onClose,
  onSave,
}) => {
  const [report, setReport] = useState("");
  const [imageDetails, setImageDetails] = useState([]);

  useEffect(() => {
    const getImageById = async (id: number) => {
      await imageService.getImageById(id).then((response) => {
        setImageDetails(response.data);
      });
    };
    // Pre-fill the report if a note exists for the selected image
    if (image) {
      getImageById(image.id);
    }
  }, [image]);

  if (!isOpen || !image) return null;

  const handleSave = () => {
    onSave(image.id, report);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-bold mb-4">Write Report</h2>
        <img
          src={image.filePath}
          alt="Selected Image"
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <ul className="space-y-4">
          {imageDetails?.reports?.map((item: any) => (
            <li key={item.id} className="flex items-start space-x-4">
              {/* User Avatar */}
              <div className="flex-shrink-0">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/5818/5818587.png"
                  alt={item.userName}
                  className="w-10 h-10 rounded-full"
                />
              </div>

              {/* Report Content */}
              <div className="flex-1 bg-gray-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">
                    {item.staffName || "Anonymous"}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {new Date(item.createdOn).toLocaleString()}
                    <p>share</p>
                  </span>
                </div>
                <p className="text-gray-700 text-left">{item.content}</p>
              </div>
            </li>
          ))}
        </ul>

        <textarea
          value={report}
          onChange={(e) => setReport(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Write your report here..."
          rows={4}
        />
        <div className="flex justify-end mt-4 space-x-4">
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
            Save Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
