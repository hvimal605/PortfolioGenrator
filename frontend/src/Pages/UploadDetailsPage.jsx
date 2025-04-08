import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../components/core/PorfolioCreation/UploadDetails/Navbar';
import PersonalDetails from '../components/core/PorfolioCreation/UploadDetails/PersonalDetails';
import Timeline from '../components/core/PorfolioCreation/UploadDetails/Timeline';
import Skills from '../components/core/PorfolioCreation/UploadDetails/Skills';
import Projects from '../components/core/PorfolioCreation/UploadDetails/Projects';
import SoftwareApplication from '../components/core/PorfolioCreation/UploadDetails/SoftwareApplication';
import PortfolioDashboardData from '../components/core/PorfolioCreation/PorttfolioDashboardData/PortfolioDashboardData';
import { setStep } from '../slices/PortfolioSlice';


const UploadDetailsPage = () => {
  const dispatch = useDispatch();
  const { step } = useSelector((state) => state.portfolio);

  const steps = ["Personal Details", "Timeline", "Skills", "Projects", "Software App", "Dashboard"];

  const handleNext = () => {
    if (step < steps.length - 1) {
      dispatch(setStep(step + 1));
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      dispatch(setStep(step - 1));
    }
  };

  return (
    <div className="min-h-screen h-full w-full bg-black pt-10 relative ">
      <div className="w-[90%] mx-auto md:w-[85%] sticky top-1 ">
        <Navbar steps={steps} currentStep={step} />
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {step === 0 && <PersonalDetails />}
        {step === 1 && <Timeline />}
        {step === 2 && <Skills />}
        {step === 3 && <Projects />}
        {step === 4 && <SoftwareApplication />}
        {step === 5 && <PortfolioDashboardData />}
      </div>

      {/* <div className="flex justify-between max-w-5xl mx-auto p-6 absolute top-[50%] left-[17%]">
        <button 
          onClick={handlePrevious} 
          disabled={step === 0} 
          className={`px-4 py-2  bg-gray-700 text-white rounded ${step === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'}`}>
          Previous
        </button>
        </div>
        <div className="flex justify-between max-w-5xl mx-auto p-6 absolute top-[50%] right-[19%]">
        <button 
          onClick={handleNext} 
          disabled={step === steps.length - 1} 
          className={`px-4 py-2  bg-blue-500 text-white rounded ${step === steps.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}>
          Next
        </button>
        </div> */}
      
    </div>
  );
};

export default UploadDetailsPage;
