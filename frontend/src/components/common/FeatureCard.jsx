import React from "react";
import { motion } from "framer-motion";

const FeatureCard = ({ icon, heading, desc, borderColor, iconColor }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50  }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.09 }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 20,
        duration: 0.8,
        delay:0.3,
      }}
      viewport={{ once: true }}
      className={`relative p-6 rounded-lg shadow-lg bg-gray-900 border-2 ${borderColor} hover:bg-gray-700 transition-colors`}
    >
      

      {/* Icon */}
      <div className={`text-4xl mb-4 text-gradient ${iconColor}`}>{icon}</div>
      {/* Heading */}
      <h3 className="text-2xl font-bold mb-2 text-white">{heading}</h3>
      {/* Description */}
      <p className="text-gray-300">{desc}</p>
    </motion.div>
  );
};

export default FeatureCard;
