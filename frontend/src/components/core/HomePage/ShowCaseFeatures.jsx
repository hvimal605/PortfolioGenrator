import React from 'react';
import FeatureCard from '../../common/FeatureCard';
import { FaCheckCircle } from "react-icons/fa";
import { GrDeploy } from "react-icons/gr";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";

import { FaUpload } from "react-icons/fa"; // Icon for upload feature

const features = [
  {
    heading: "Customizable Templates",
    desc: "Choose from a variety of sleek, modern templates and customize them to your liking for a personalized look.",
    borderColor: "border-blue-500",
    iconColor: "text-blue-500",
    icon: <FaCheckCircle />,
   
  },
  {
    heading: "Auto Deploy",
    desc: "Get your portfolio automatically deployed and ready to share with a direct portfolio link upon completion.",
    borderColor: "border-purple-500",
    iconColor: "text-purple-500",
    icon: <GrDeploy />,
  },
  {
    heading: "Premium Option Available",
    desc: "Unlock unlimited portfolios and extra features with our premium plan. Perfect for professionals and teams.",
    borderColor: "border-amber-500",
    iconColor: "text-amber-500",
    icon: <MdOutlineWorkspacePremium />,
  },
  {
    heading: "Update Your Portfolio Anytime",
    desc: "Make updates to your portfolio anytime. Keep it fresh, relevant, and reflective of your latest projects.",
    borderColor: "border-green-500",
    iconColor: "text-green-500",
    icon: <RxUpdate />,
  },
  {
    heading: "For Developers: Upload Templates",
    desc: "Developers can upload their own portfolio templates for others to use, contributing to the community and expanding template choices.",
    borderColor: "border-teal-500",
    iconColor: "text-teal-500",
    icon: <FaUpload />, // Upload icon
  },
];

const ShowCaseFeatures = () => {
  return (
    <section className="bg-gray-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8">Showcase Your Portfolio Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              heading={feature.heading}
              desc={feature.desc}
              borderColor={feature.borderColor}
              icon={feature.icon }
              iconColor={feature.iconColor}
           
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShowCaseFeatures;
