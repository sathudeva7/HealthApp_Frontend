import React, { useEffect, useState } from "react";
import AWS from "aws-sdk";
import { useNavigate } from "react-router-dom";
import patientService from "../services/patientService";

const AddPatient = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    address: "",
    phone: "",
    password: "",
    gender: "male",
    profileImage: "",
    conditions: "",
  });
  const [isPatientSuccess, setPatientSuccess] = useState(false);
  const [patientId, setPatientId] = useState<number | null>("");
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    const uploadImage = await handleUploadImage(file);
    setIsImageUploaded(true);
    setFormData((prevData) => ({ ...prevData, profileImage: uploadImage ? uploadImage : "https://images.unsplash.com/photo-1606166187734-a4cb74079037?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBhdGllbnR8ZW58MHx8MHx8fDA%3D" }));
  };

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

      console.log("File uploaded successfully:", uploadResult.Location);

      // Return the file URL
      return uploadResult.Location;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Failed to upload image to S3");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Patient Data Submitted: ", formData);
    if (!isImageUploaded) {
      alert("Image Upload on progress");
    } else {
      await patientService.addPatient(formData).then((response) => {
        if (response.status == 201) {
          setPatientSuccess(true);
          setPatientId(response.data.id);
          alert("Patient data successfully submitted!");
        } else {
          setPatientSuccess(false);
          alert("Failed to submit patient data.");
        }
      });
    }
  };

  useEffect(() => {
    if (isPatientSuccess) {
      //redirect to patient list
      navigate(`/patient/details/${patientId}`);
    }
  }, [isPatientSuccess]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Add Patient</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter patient's name"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-700"
            >
              Age
            </label>
            <input
              type="text"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter patient's age"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter patient's email"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter patient's password"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter patient's address"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter patient's phone number"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="profileImage"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Image
            </label>
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter patient's email"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="condition"
              className="block text-sm font-medium text-gray-700"
            >
              Medical Condition
            </label>
            <input
              type="text"
              id="conditions"
              name="conditions"
              value={formData.conditions}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter medical condition"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Add Patient
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;
