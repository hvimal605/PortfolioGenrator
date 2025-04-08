import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import FileUpload from "../../../common/FileUpload";
import Upload from "../../../common/Upload";
import { addProject } from "../../../../services/operations/PortfolioApi";
import { useSelector } from "react-redux";

const ProjectForm = () => {
  const { token } = useSelector((state) => state.auth);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const [project, setProject] = useState({
    title: "",
    description: "",
    technologies: "",
    githubLink: "",
    projectLink: "",
    projectBanner: null,
  });

  // Handle Text Input
  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  // Handle File Selection
  const handleFileSelect = (file) => {
    if (file) {
      const newFile = new File([file], file.name, { type: file.type });
      setProject((prev) => ({ ...prev, projectBanner: newFile }));
      setValue("projectBanner", newFile);
    }
  };

  const onSubmit = async (data) => {
    if (!project.projectBanner) {
      alert("Please upload a project banner.");
      return;
    }

    const portfolioId = localStorage.getItem("portfolioId");
    if (!portfolioId) {
      toast.error("Portfolio ID not found. Please try again.");
      return;
    }

    const formData = new FormData();
    formData.append("title", project.title);
    formData.append("description", project.description);
    formData.append("technologies", project.technologies);
    formData.append("gitRepoLink", project.githubLink);
    formData.append("projectLink", project.projectLink);
    formData.append("projectBanner", project.projectBanner);
    formData.append("portfolioId", portfolioId);

    try {
      await addProject(formData ,token)
      setProject({ title: "", description: "", technologies: "", githubLink: "", projectLink: "", projectBanner: null });
      setValue("title", "");
      setValue("description", "");
      setValue("technologies", "");
      setValue("gitRepoLink", "");
      setValue("projectLink", "");
      setValue("projectBanner", null);
    
      handleFileSelect(null);
      
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project. Please try again.");
    }
  };

  return (
    <div className="bg-gray-900 border border-purple-400 text-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Add New Project</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-gray-300 font-medium">Project Title</label>
          <input type="text" name="title" value={project.title} onChange={handleChange} className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block text-gray-300 font-medium">Description</label>
          <textarea name="description" value={project.description} onChange={handleChange} className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block text-gray-300 font-medium">Technologies Used</label>
          <input type="text" name="technologies" value={project.technologies} onChange={handleChange} className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block text-gray-300 font-medium">GitHub Repository Link</label>
          <input type="url" name="githubLink" value={project.githubLink} onChange={handleChange} className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block text-gray-300 font-medium">Project Link</label>
          <input type="url" name="projectLink" value={project.projectLink} onChange={handleChange} className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
          <Upload name="skillSvg" label="Upload Skill Icon (SVG, PNG, JPG)" register={register}  setValue={setValue} watch={watch} errors={errors} onFileSelect={handleFileSelect} />
        
          
          

        <div className="text-center">
          <button type="submit" className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300">
            Add Project
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
