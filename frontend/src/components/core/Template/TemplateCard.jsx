import { motion } from "framer-motion";
import AnimatedButton2 from "../../common/AnimatedButton2";
import { FaRegEdit } from "react-icons/fa";

export default function TemplateCard({ template, onSelect }) {
  return (
    <motion.div
      className="relative group cursor-pointer bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-green-200 shadow-md hover:shadow-lg transition duration-300 border border-pink-600 hover:border-white/40 hover:scale-[1.03] "
      whileHover={{ scale: 1.02 }}
    >
      {/* Image with Gradient Overlay */}
      <div className="relative">
        <img
          src={template.previewImage}
          alt={template.name}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent"></div>
      </div>

      {/* Card Content */} 
      <div className="p-5 text-center text-white">
        <h2 className="text-xl font-bold tracking-wide text-white/90 group-hover:text-white transition duration-300">
          {template.name}
        </h2>
        <p className="text-sm text-gray-300 mt-2 leading-relaxed">
          {template.description}
        </p>
        <p className="text-xs text-gray-400 mt-3">
          Created by: <span className="font-semibold text-gray-200">{template.CreatedBy}</span>
        </p>

        {/* Buttons */}
        <div className="mt-4 flex justify-center space-x-4 flex-wrap">
  <a
    href={template.previewUrl
      }
    target="_blank"
    rel="noopener noreferrer"
    className="w-full lg:w-auto flex justify-center mb-4 lg:mb-0"
  >
    <AnimatedButton2 text="Preview Template" />
  </a>
  <button
    className="px-5 py-1 bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:bg-pink-700 transition duration-300 lg:w-auto"
    onClick={() => onSelect(template)}
  >
    <FaRegEdit className=" text-2xl" />
  </button>
</div>

      </div>
    </motion.div>
  );
}