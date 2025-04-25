import { useEffect, useState } from "react";
import AssignStaffModal from "./AssignStaffModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useParams } from "react-router-dom";
import staffService from "../Services/StaffService";
import AssginedImagesList from "./AssginedImagesList";

const StaffDetails = () => {
  const [staff, setStaffData] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [isAssignStaffModalOpen, setAssignStaffModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    id: number;
    filePath: string;
    note: string;
  } | null>(null);
  const { id } = useParams<{ id: string }>();
  const [menu, setMenu] = useState("info");

  const handleAssignStaff = (staffId: number) => {
    console.log(
      `Assigned staff ID: ${staffId} to image ID: ${selectedImage.id}`
    );
    staffService
      .assignStaff(staffId, selectedImage.id)
      .then((response) => {
        if (response.statusText == "OK") {
          alert("Staff assigned successfully");
          setAssignStaffModalOpen(false);
        } else {
          alert(response.message);
        }
      })
      .catch((error) => {
        console.error("Error assigning staff:", error);
      });
  };

  const handleDelete = () => {
    console.log(`Deleted image ID: ${selectedImage.id}`);
    setConfirmDeleteModalOpen(false);
  };

  useEffect(() => {
    const fetchStaffById = async (id) => {
      try {
        await staffService.getById(id).then((response) => {
          if (response.statusText == "OK") {
            setStaffData(response.data);
          } else {
            setStaffData(null);
            alert(response.message);
          }
        });
      } catch (error) {
        console.error("Error fetching staff data:", error);
      }
    };

    fetchStaffById(id);
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/5818/5818587.png"
              alt="Patient"
              className="w-20 h-20 rounded-full"
            />
            <div className="text-left">
              <h2 className="text-2xl font-bold">{staff?.name}</h2>
              <p className="text-gray-600">{staff?.role}</p>
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
            Staff Information
          </button>
          <button
            onClick={() => setMenu("finance")}
            className="text-gray-500 px-4 py-2 hover:text-blue-500"
          >
            Assigned Images
          </button>
        </div>

        {/* Staff Information Section */}
        {menu === "info" ? (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-lg font-semibold">{staff?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-lg font-semibold">{staff?.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="text-lg font-semibold">{staff?.phone}</p>
              </div>
            </div>
          </div>
        ) : (
          <AssginedImagesList staffId={id} />
        )}

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

export default StaffDetails;
