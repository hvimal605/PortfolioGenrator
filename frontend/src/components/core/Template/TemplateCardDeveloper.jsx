import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";
import AnimatedButton2 from "../../common/AnimatedButton2";
import { format } from "date-fns";

export default function TemplateCardDeveloper({ template }) {
  const status = template.status;
  const formattedDate = (date) =>
    date && date !== "Pending" && date !== "Rejected"
      ? format(new Date(date), "dd MMM yyyy")
      : date;

  const statusColor = {
    Approved: "text-green-400 bg-green-700/20",
    Pending: "text-yellow-400 bg-yellow-600/20",
    Rejected: "text-red-500 bg-red-700/20",
  };

  return (
    <motion.div
      className="relative group bg-gradient-to-br from-black/60 via-gray-900/40 to-black/80 border border-pink-700 rounded-2xl overflow-hidden shadow-[0_0_15px_#ec4899] hover:shadow-[0_0_25px_#ec4899aa] transition-all duration-300 hover:scale-[1.025]"
      whileHover={{ scale: 1.025 }}
    >
      {/* Shine Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 via-transparent to-white/5 pointer-events-none" />

      {/* Card Content */}
      <div className="relative p-6 text-white space-y-4 z-10">
        {/* Header */}
        <div className="flex flex-col gap-1 items-center text-center">
          <h2 className="text-2xl font-bold text-white/90 tracking-wide group-hover:text-white transition">
            {template.name}
          </h2>
          <p className="text-sm text-gray-400">{template.description}</p>
        </div>

        {/* Status & Date Info */}
        <div className="text-sm space-y-1 text-gray-400 text-left">
          <p>📅 <span className="text-white">Submitted:</span> {formattedDate(template.createdAt)}</p>
          {template.reviewedAt && (
            <p>✅ <span className="text-white">Reviewed:</span> {formattedDate(template.reviewedAt)}</p>
          )}
          <p className="mt-2 font-semibold flex items-center gap-2">
            🔹 Status:
            <span
              className={`px-3 py-1 rounded-full font-semibold text-sm ${statusColor[status]} transition-all duration-300`}
            >
              {status}
            </span>
          </p>
        </div>

        {/* Buttons Row */}
        <div className="mt-5 flex justify-center items-center gap-4">
          <a
            href={template.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <AnimatedButton2 text="Preview Template" />
          </a>

          <a
            href={template.uploadedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-pink-500 text-2xl transition duration-300"
            title="Download Template"
          >
            <FaDownload />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
