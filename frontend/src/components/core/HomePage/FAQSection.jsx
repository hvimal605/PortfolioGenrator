import React from "react";
import { motion } from "framer-motion";
import { IoIosArrowDown } from "react-icons/io";

const faqs = [
  {
    question: "How do I build my portfolio?",
    answer:
      "To build your portfolio, simply head to the dashboard, add your skills, projects, and media links. Customize the design to make it uniquely yours!",
  },
  {
    question: "Can I export my portfolio as a PDF?",
    answer:
      "Yes, you can export your portfolio as a high-quality PDF from the settings page. You can even choose to include or exclude specific sections.",
  },
  {
    question: "What media formats are supported?",
    answer:
      "You can upload images, videos, and documents in popular formats like JPG, PNG, MP4, and PDF.",
  },
  {
    question: "Where can I get detailed help?",
    answer:
      "Our help docs cover everything from building to exporting portfolios. You can access them via the link below.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-20 bg-black text-white">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl font-extrabold text-center mb-14 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-lime-400"
        >
          Frequently Asked Questions
        </motion.h2>

        {/* FAQ Items */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-xl overflow-hidden group hover:shadow-[0_0_30px_rgba(0,255,180,0.2)] transition-all duration-500"
            >
              <details className="group p-6 md:p-8 cursor-pointer">
                <summary className="flex items-center justify-between text-xl font-medium text-cyan-300 hover:text-lime-400 transition-colors duration-300">
                  <span>{faq.question}</span>
                  <IoIosArrowDown className="w-6 h-6 transform transition-transform duration-300 group-open:rotate-180 text-cyan-300 group-hover:text-lime-400" />
                </summary>
                <div className="mt-4 text-gray-300 text-lg leading-relaxed transition-all duration-300">
                  {faq.answer}
                </div>
              </details>
              <div className="absolute inset-0 z-[-1] bg-gradient-to-br from-cyan-500/10 to-lime-400/10 opacity-0 group-hover:opacity-100 transition duration-500 rounded-2xl blur-sm" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
