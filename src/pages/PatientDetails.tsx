import React, { useEffect, useState } from "react";
import ImageUploadModal from "./ImageUploadModal";
import AWS from "aws-sdk";
import ReportModal from "./ReportModal";
import AssignStaffModal from "./AssignStaffModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useParams } from "react-router-dom";
import FinancialTable from "./FinancialTable";
import patientService from "../Services/patientService";
import staffService from "../Services/staffService";
import imageService from "../Services/ImageService";
import Cookies from "js-cookie";
import reportService from "../Services/ReportService";

const PatientDetails = () => {
  const [patient, setPatientData] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [isAssignStaffModalOpen, setAssignStaffModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    id: number;
    filePath: string;
    note: string;
  } | null>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const { id } = useParams<{ id: string }>();
  const [menu, setMenu] = useState("info");

  const handleMenuAction = (action: string, attachment: number) => {
    setSelectedImage(attachment);
    setActiveMenu(null); // Close the menu

    if (action === "View") {
      setReportModalOpen(true);
    } else if (action === "Assign Staff") {
      setAssignStaffModalOpen(true);
    } else if (action === "Delete") {
      setConfirmDeleteModalOpen(true);
    }
  };

  const handleAssignStaff = (staffId: number) => {
    console.log(
      `Assigned staff ID: ${staffId} to image ID: ${selectedImage.id}`
    );
    staffService.assignStaff(selectedImage.id, staffId).then((response) => {
      if (response.statusText == "OK") {
        alert("Staff assigned successfully");
        setAssignStaffModalOpen(false);
      } else {
        alert(response.message);
      }
    });
  };

  const handleDelete = () => {
    console.log(`Deleted image ID: ${selectedImage.id}`);
    setConfirmDeleteModalOpen(false);
  };

  useEffect(() => {
    const fetchPatientById = async () => {
      await patientService.getById(id).then((response) => {
        console.log(response);
        if (response.statusText == "OK") {
          setPatientData(response?.data);
        } else {
          setPatientData(null);
        }
      });
    };

    fetchPatientById();
  }, []);

  const handleUploadImage = async (file: File) => {
    // AWS S3 configuration
    const s3 = new AWS.S3({
      accessKeyId: import.meta.env.VITE_AWS_KEY_ID, // Set in .env
      secretAccessKey: import.meta.env.VITE_SECRET_ACCESS_KEY, // Set in .env
      region: import.meta.env.VITE_REGION,
    });

    const bucketName = import.meta.env.VITE_BUCKET_NAME; // Set in .env

    try {
      // Generate unique file name for S3
      const fileName = `${Date.now()}-${file.name}`;

      // S3 upload parameters
      const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: file,
        ContentType: file.type,
        ACL: "public-read", // Make the file publicly accessible
      };

      // Upload the file
      const uploadResult = await s3.upload(params).promise();

      const data = await imageCreateApi(uploadResult.Location ? uploadResult.Location : "https://static.vecteezy.com/system/resources/thumbnails/005/944/649/small_2x/male-nurse-and-his-patient-free-vector.jpg");
      // Return the file URL
      return data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Failed to upload image to S3");
    }
  };

  const imageCreateApi = async (filePath: string) => {
    const imageData = {
      filePath: filePath,
      uploadedBy: Cookies.get("loggedInUserId"),
    };
    await imageService.createImage(imageData, id).then((response) => {
      if (response.status == 201) {
        alert("Image uploaded successfully");
      } else {
        alert(response.message);
      }
    });
  };

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
      if (response.status == 200) {
        alert("Report saved successfully");
      } else {
        alert(response.message);
      }
    });
    closeReportModal();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img
              src={patient?.profileImage}
              alt="Patient"
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold">{patient?.name}</h2>
              <p className="text-sm text-gray-500">{patient?.conditions}</p>
            </div>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Upload Image
            </button>
            <button className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">
              Edit
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setMenu("info")}
            className="text-blue-500 px-4 py-2 border-b-2 border-blue-500"
          >
            Patient Information
          </button>
          <button
            onClick={() => setMenu("finance")}
            className="text-gray-500 px-4 py-2 hover:text-blue-500"
          >
            Financial Record
          </button>
        </div>

        {/* Patient Information Section */}
        {menu === "info" ? (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Age</p>
                <p className="text-lg font-semibold">{patient?.age}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-lg font-semibold">{patient?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="text-lg font-semibold">{patient?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-lg font-semibold">{patient?.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="text-lg font-semibold">{patient?.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Diagnosis</p>
                <p className="text-lg font-semibold">{patient?.diagnosis}</p>
              </div>
            </div>

            {/* Attachments */}
            <h3 className="text-lg font-semibold mb-4">Attachments</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {patient?.images?.map((attachment) => (
                <div
                  key={attachment.id}
                  className="relative border rounded-lg shadow-sm p-4 bg-gray-50"
                >
                  <img
                    src={attachment.filePath}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                    onClick={() => openReportModal(attachment)}
                  />
                  {/* Menu Button */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() =>
                        setActiveMenu((prev) =>
                          prev === attachment.id ? null : attachment.id
                        )
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
                    >
                      ...
                    </button>
                  </div>

                  {/* Submenu */}
                  {activeMenu === attachment.id && (
                    <div className="absolute top-12 right-2 bg-white border text-left rounded-lg shadow-lg w-32 z-10">
                      <ul className="py-2">
                        <li
                          onClick={() => handleMenuAction("View", attachment)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          View
                        </li>
                        <li
                          onClick={() =>
                            handleMenuAction("Assign Staff", attachment)
                          }
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          Assign Staff
                        </li>
                        <li
                          onClick={() => handleMenuAction("Delete", attachment)}
                          className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                        >
                          Delete
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <FinancialTable />
        )}
        <ImageUploadModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onUpload={handleUploadImage}
        />

        <ReportModal
          isOpen={isReportModalOpen}
          image={selectedImage}
          onClose={closeReportModal}
          onSave={saveReport}
        />

        {/* Assign Staff Modal */}
        {isAssignStaffModalOpen && (
          <AssignStaffModal
            isOpen={isAssignStaffModalOpen}
            onClose={() => setAssignStaffModalOpen(false)}
            onAssign={handleAssignStaff}
          />
        )}

        {/* Confirm Delete Modal */}
        {isConfirmDeleteModalOpen && (
          <ConfirmDeleteModal
            isOpen={isConfirmDeleteModalOpen}
            onClose={() => setConfirmDeleteModalOpen(false)}
            onConfirm={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default PatientDetails;
