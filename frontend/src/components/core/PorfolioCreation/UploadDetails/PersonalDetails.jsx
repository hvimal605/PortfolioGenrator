import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import Upload from "../../../common/Upload";
import { addPersonalDetails } from "../../../../services/operations/PortfolioApi";
import { setPortfolio, setStep } from "../../../../slices/PortfolioSlice";
import { useNavigate } from "react-router-dom";

const PersonalDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth);
  const { templateId } = useSelector((state) => state.portfolio);

  useEffect(() => {
      if (!templateId) {
        navigate("/portfolioCreate");
      }
    }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,  // ✅ Use reset to clear form fields
    formState: { errors },
  } = useForm();

  const handleFileSelect = (file, name) => {
    setValue(name, file);
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] && key !== "avatar" && key !== "resume") {
        formData.append(key, data[key]);
      }
    });

    if (!data.avatar || !data.resume) {
      return toast.error("Profile image and resume are required!");
    }

    formData.append("avatar", data.avatar);
    formData.append("resume", data.resume);
    formData.append("templateId", templateId);


    const result = await addPersonalDetails(formData, token);
    console.log("laao result hi dekhe guys", result)
    if (result) {
      dispatch(setStep(1));
      dispatch(setPortfolio(result));

      reset();
      setValue("avatar", null);  
      setValue("resume", null);  

    }

  };

  return (
    <div className="bg-gray-900 border border-yellow-400 text-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Personal Details</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input {...register("FirstName", { required: true })} placeholder="First Name" className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg" />
          <input {...register("LastName", { required: true })} placeholder="Last Name" className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input {...register("email", { required: true })} placeholder="Email" className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg" />
          <input {...register("phone", { required: true })} placeholder="Phone Number" className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg" />
        </div>

        <input {...register("address", { required: true })} placeholder="Address" className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input {...register("linkedIn")} placeholder="LinkedIn" className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg" />
          <input {...register("github")} placeholder="GitHub" className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg" />
          <input {...register("twitter")} placeholder="Twitter" className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg" />
          <input {...register("personalWebsite")} placeholder="Personal Website" className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg" />
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <Upload name="avatar" label="Upload Profile Picture" register={register} setValue={setValue} watch={watch} errors={errors} onFileSelect={(file) => handleFileSelect(file, "avatar")} />
          <Upload name="resume" label="Upload Resume" register={register} setValue={setValue} watch={watch} errors={errors} onFileSelect={(file) => handleFileSelect(file, "resume")} />
        </div>

        <div className="text-center">
          <button type="submit" className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalDetails;
