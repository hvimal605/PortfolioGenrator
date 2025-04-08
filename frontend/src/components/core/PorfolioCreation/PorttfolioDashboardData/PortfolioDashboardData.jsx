import { useEffect, useState } from "react";
import { Projects } from "./Projects";
import { Skills } from "./Skills";
import { SoftwareApplications } from "./SoftwareApplications";
import { Timeline } from "./Timeline";

import { Link, useParams } from "react-router-dom";
import { getFullDetailsOfPortfolio } from "../../../../services/operations/PortfolioApi";
import { PersonalportfolioData } from "./PersonalportfolioData";
import AnimatedButton4 from "../../../common/AnimatedButton4";

// const projects = [
//   { title: "Restaurant Website", stack: "MERN", deployed: "No" },
//   { title: "EdTech Website", stack: "MERN", deployed: "Yes" },
//   { title: "Chat Website", stack: "MERN", deployed: "Yes" },
// ];
// const timeline = [
//   { title: "High school", from: "2019", to: "2020" },
//   { title: "Intermediate", from: "2021", to: "2022" },
//   { title: "Graduation(Current)", from: "2022", to: "2026" },
// ];
// const skills = [
//   { name: "Html", proficiency: 100 },
//   { name: "CSS", proficiency: 92 },
//   { name: "JavaScript", proficiency: 80 },
//   { name: "React JS", proficiency: 80 },
//   { name: "Tailwind CSS", proficiency: 80 },
//   { name: "Node Js", proficiency: 80 },
//   { name: "Express Js", proficiency: 80 },
//   { name: "Mongodb", proficiency: 85 },
//   { name: "UI/UX", proficiency: 70 },
//   { name: "Redux Toolkit", proficiency: 90 },
// ];
// const software = [
//   "Visual Studio Code", "POSTMAN", "Autocad", "Blender", "Maya", "Unity", "Figma", "MATLAB"
// ];
// const personalDetails = {
//   firstName: "Harsh",
//   lastName: "Kumar Vimal",
//   aboutMe :"I am a MERN Stack Developer",
//   email: "harsh@example.com",
//   phone: "123-456-7890",
//   linkedIn: "linkedin.com/in/harshkumarvimal",
//   facebook: "facebook.com/harshkumarvimal",
//   instagram: "instagram.com/harshkumarvimal",
//   twitter: "twitter.com/harshkumarvimal",
//   profilePic: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?cs=srgb&dl=pexels-italo-melo-881954-2379004.jpg&fm=jpg",
//   resume: "https://www.jobhero.com/resources/wp-content/uploads/2023/07/tutor-template-resume-JH.svg"
// };


const PortfolioDashboardData = ({token}) => {
  // const { portfolioId } = useParams(); // Assuming you're getting ID from URL
 const portfolioId = localStorage.getItem("portfolioId")
 
  const [portfolioData, setPortfolioData] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const data = await getFullDetailsOfPortfolio(portfolioId, token);
      setPortfolioData(data);
    };

    fetchPortfolio();
  }, [portfolioId, token]);
 
  console.log("ye dekhlete h ek baarf", portfolioData)

  if (!portfolioData) {
    return <p className="text-center text-white">Loading Portfolio...</p>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-3">
      <h1 className="text-3xl font-bold text-center">Portfolio Dashboard</h1>
      <PersonalportfolioData portfolioData={portfolioData} />
      <Timeline timeline={portfolioData.timeline} />
      <Skills skills={portfolioData.skills} />
      <SoftwareApplications software={portfolioData.softwareApplications} />
      <Projects projects={portfolioData.projects} />
         <Link to={'/portfolio/deploy'}>
                <AnimatedButton4 text={'Deploy'} />
                </Link>
    </div>
  );
};

export default PortfolioDashboardData;
