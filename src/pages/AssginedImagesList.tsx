import { useEffect, useState } from "react";
import ReportModal from "./ReportModal";
import imageService from "../services/ImageService";
import reportService from "../services/ReportService";

export default function AssginedImagesList({ staffId }) {
  const [images, setImages] = useState([]);
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const assignedImages = async (staffId) => {
      await imageService.getAssignedImages(staffId).then((response) => {
        if (response.statusText == "OK") {
          setImages(response.data);
        }
      });
    };
    assignedImages(staffId);
  }, []);

  const openReportModal = (image: {
    id: number;
    filePath: string;
    note: string;
  }) => {
    setSelectedImage(image);
    setReportModalOpen(true);
  };

  const closeReportModal = () => {
    setReportModalOpen(false);
    setSelectedImage(null);
  };

  const saveReport = async (id: number, report: string) => {
    console.log("Image ID:", id);
    console.log("Report:", report);
    const reportData = {
      content: report,
      createdBy: Cookies.get("loggedInUserId"),
      patientId: patient?.id,
    };

    await reportService.saveReport(id, reportData).then((response) => {
      if (response.status == 201) {
        alert("Report saved successfully");
      } else {
        alert(response.message);
      }
    });

    closeReportModal();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {images?.map((attachment) => (
        <div
          key={attachment.id}
          className="relative cursor-pointer border rounded-lg shadow-sm p-4 bg-gray-50"
          onClick={() => openReportModal(attachment)}
        >
          <img
            src={attachment.filePath}
            className="w-full h-32 object-cover rounded-lg mb-4"
          />
          <div className="text-left flex justify-between">
            <div>
              <h2 className="text-lg font-bold mb-2">
                Name: {attachment.patientName}
              </h2>
              <div>Age: {attachment.patientAge}</div>
            </div>
            <div>
              {attachment?.reports?.length > 0 ? (
                <span className="text-green-600 p-2 bg-green-300 border">
                  {" "}
                  Done
                </span>
              ) : (
                <span className="text-purple-600 p-2 bg-purple-300 border">
                  {" "}
                  Pending
                </span>
              )}
            </div>
          </div>
        </div>
      ))}

      <ReportModal
        isOpen={isReportModalOpen}
        image={selectedImage}
        onClose={closeReportModal}
        onSave={saveReport}
      />
    </div>
  );
}
