import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import FileUpload from "../../../common/FileUpload";
import { addSkill } from "../../../../services/operations/PortfolioApi";
import Upload from "../../../common/Upload";

const SkillForm = () => {
  const { token } = useSelector((state) => state.auth);
  const {portfolio} = useSelector((state)=>state.portfolio)
  const portfolioId = portfolio._id;
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();

  const [skill, setSkill] = useState({
    title: "",
    proficiency: "",
    skillSvg: null,
  });

  // Handle Text Input
  const handleChange = (e) => {
    setSkill({ ...skill, [e.target.name]: e.target.value });
  };

  // Handle File Selection
  const handleFileSelect = (file) => {
    if (file) {
      const newFile = new File([file], file.name, { type: file.type });
      setSkill((prev) => ({ ...prev, skillSvg: newFile }));
      setValue("skillSvg", newFile);
    }
  };

  const onSubmit = async (data) => {
    if (!skill.skillSvg) {
      alert("Please upload a skill image file.");
      return;
    }
    if (!portfolioId) {
      toast.error("Portfolio ID not found. Please try again.");
      return;
    }

    const formData = new FormData();
    formData.append("title", skill.title);
    formData.append("proficiency", skill.proficiency);
    formData.append("skillSvg", skill.skillSvg);
    formData.append("portfolioId", portfolioId);

    try {
      await addSkill(formData, token);
      setSkill({ title: "", proficiency: "", skillSvg: null });
      setValue("title", "");
      setValue("proficiency", "");
      setValue("skillSvg", null);
      handleFileSelect(null);
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  return (
    <div className="bg-gray-900 border border-green-500 text-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Add a New Skill</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-gray-300 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={skill.title}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-300 font-medium">Proficiency (%)</label>
          <input
            type="number"
            name="proficiency"
            value={skill.proficiency}
            onChange={handleChange}
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            max="100"
          />
        </div>

        <Upload name="skillSvg" label="Upload Skill Icon (SVG, PNG, JPG)" register={register}  setValue={setValue} watch={watch} errors={errors} onFileSelect={handleFileSelect} />

        <div className="text-center">
          <button
            type="submit"
            className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
          >
            Add Skill
          </button>
        </div>
      </form>
    </div>
  );
};

export default SkillForm;