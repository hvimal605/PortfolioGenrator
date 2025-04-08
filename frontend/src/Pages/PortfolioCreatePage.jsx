import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TemplateSelection from "../components/core/PorfolioCreation/TemplateSelection";

import AnimatedButton5 from "../components/common/AnimatedButton5";
import ShineText from "../components/common/ShineText";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTemplateId } from "../slices/PortfolioSlice";

const PortfolioCreatePage = () => {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const dispatch = useDispatch();

  

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // console.log("ye hai ji template",template._id)
    dispatch(setTemplateId(template._id));
    setStep(2);
  };

  const handleUploadDetails = () => {
    setStep(3);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white font-sans  overflow-hidden">
      {/* Dotted animated background */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30 animate-moveDots"></div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -200 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-5 mb-8 relative"
          >
            <h1 className="text-4xl md:text-6xl font-bold">
              Welcome to Your <ShineText text={"Portfolio"} /> Journey
            </h1>
            <p className="text-base md:text-lg lg:text-xl">
              Ready to create your professional portfolio? Let's get started!
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(2)}
            >
              <AnimatedButton5 text={"Select Template"} />
            </motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -200 }}
            transition={{ duration: 0.5 }}
            className="text-center w-full relative flex justify-center flex-col items-center"
          >
            {/* Select Template Title */}

            <h2 className="text-2xl md:text-4xl font-bold ">
              Select Template
            </h2>
            {/* Template Selection Section */}
            <div className=" w-full h-[78vh] overflow-y-auto  p-2 rounded-lg">
              <TemplateSelection onTemplateSelect={handleTemplateSelect} />
            </div>

            {selectedTemplate && (
              <motion.button
                className="mt-3"
                whileTap={{ scale: 0.95 }}
                onClick={handleUploadDetails}
              >
                <Link to={'/PortfolioCreate/UploadDetails'}>
                <AnimatedButton5 text={'Upload Details'} />
                </Link>
              </motion.button>
            )}
          </motion.div>
        )}

       
      </AnimatePresence>
    </div>
  );
};

export default PortfolioCreatePage;
