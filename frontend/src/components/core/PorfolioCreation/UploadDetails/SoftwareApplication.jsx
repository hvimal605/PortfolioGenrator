import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import Upload from "../../../common/Upload";
import { addSoftwareApplication } from "../../../../services/operations/PortfolioApi";

const SoftwareApplicationForm = () => {
  const { token } = useSelector((state) => state.auth);
  const {portfolio} = useSelector((state)=>state.portfolio)
    const portfolioId = portfolio._id;
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();


  const [application, setApplication] = useState({
    name: "",
    applicationSvg: null,
  });

  // Handle Text Input
  const handleChange = (e) => {
    setApplication({ ...application, [e.target.name]: e.target.value });
  };

  // Handle File Selection
  const handleFileSelect = (file) => {
    if (file) {
      const newFile = new File([file], file.name, { type: file.type }); // Ensure it's a valid File object
      setApplication((prev) => ({ ...prev, applicationSvg: newFile }));
      setValue("applicationSvg", newFile);
    }
  };

  const onSubmit = async (data) => {
    if (!application.applicationSvg) {
      alert("Please upload an application image file.");
      return;
    }

    if (!portfolioId) {
      toast.error("Portfolio ID not found. Please try again.");
      return;
    }

    const formData = new FormData();
    formData.append("name", application.name);
    formData.append("applicationSvg", application.applicationSvg);
    formData.append("portfolioId", portfolioId);

    try {
      await addSoftwareApplication(formData, token);

      setApplication({ name: "", applicationSvg: null });
      setValue("applicationSvg", null);
      setValue("name", ""); 
      onFileSelect(null); 
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };



  return (
    <div className="bg-gray-900 border border-blue-500 text-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Add Software Application</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Application Name */}
        <div>
          <label className="block text-gray-300 font-medium">Application Name</label>
          <input
            type="text"
            name="name"
            value={application.name}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* File Upload */}
        <Upload
          name="applicationSvg"
          label="Upload Application Image (SVG, PNG, JPG)"
          register={register}
          setValue={setValue}
          watch={watch} 
          errors={errors}
          onFileSelect={handleFileSelect}
        />


        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
          >
            Add Software Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default SoftwareApplicationForm;
