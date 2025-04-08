import React from "react";
import { motion } from "framer-motion";
import { FaRegEdit, FaPalette, FaShareSquare, FaCheckCircle } from "react-icons/fa";
import { GrSelect } from "react-icons/gr";
import { MdOutlinePublish } from "react-icons/md";
import { FaRegShareFromSquare } from "react-icons/fa6";

const steps = [
  {
    id: 1,
    icon: <GrSelect size={30} className="text-green-400" />,
    title: "Choose a Template",
    titleColor: "text-green-400",
    description: "Start by selecting a template that suits your style.",
  },
  {
    id: 2,
    icon: <FaPalette size={30} className="text-pink-400" />,
    title: "Customize",
    titleColor: "text-pink-400",
    description: "Personalize it with colors, fonts, and your content.",
  },
  {
    id: 3,
    icon: <MdOutlinePublish size={30} className="text-cyan-400" />,
    title: "Publish",
    titleColor: "text-cyan-400",
    description: "Publish your portfolio with a single click.",
  },
  {
    id: 4,
    icon: <FaRegShareFromSquare size={30} className="text-red-400" />,
    title: "Share",
    titleColor: "text-red-400",
    description: "Share your portfolio with the world.",
  },
];

const StepsGuide = () => {
  return (
    <section className="py-16 bg-black text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-10 text-center">How It Works</h2>
        <div className="relative border-l-2 border-dashed border-gray-400 ml-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="mb-14 ml-6 flex flex-col justify-start gap-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.3,
                duration: 0.6,
                ease: "easeInOut",
              }}
              viewport={{ once: true }}
            >
              {/* Dot and Icon */}
              <motion.span
                className="absolute -left-7 flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full"
                whileHover={{ rotate: 360 , scale:1.3 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {step.icon}
              </motion.span>

              {/* Step Content */}
              <h3
                className={`text-2xl font-semibold ${step.titleColor} mb-2 ml-2 mt-2`}
              >
                {step.title}
              </h3>
              <p className="text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsGuide;
