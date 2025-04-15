import React, { useEffect, useState } from "react";
import { Projects } from "./Projects";
import { SoftwareApplications } from "./SoftwareApplications";
import { Timeline } from "./Timeline";
import { Link } from "react-router-dom";
import { getFullDetailsOfPortfolio } from "../../../../services/operations/PortfolioApi";
import { PersonalportfolioData } from "./PersonalportfolioData";
import AnimatedButton4 from "../../../common/AnimatedButton4";
import { useSelector } from "react-redux";
import { Skills } from "./skills";

const PortfolioDashboardData = ({selectedPortfolio}) => {
  console.log("ye dkeh le ",selectedPortfolio?.portfolioId)  
  const { token } = useSelector((state) => state.auth);
  const reduxPortfolio = useSelector((state) => state.portfolio.portfolio);
  const portfolioId = selectedPortfolio?.portfolioId || reduxPortfolio?._id;


  // console.log("Current Portfolio ID:", portfolioId);

  const [portfolioData, setPortfolioData] = useState(null);

  useEffect(() => {
    if (!portfolioId) return;

    const fetchPortfolio = async () => {
      try {
        const data = await getFullDetailsOfPortfolio(portfolioId, token);
        console.log("Fetched Portfolio Data:", data);
        setPortfolioData(data);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      }
    };

    fetchPortfolio();
  }, [portfolioId, token]);

  if (!portfolioData) {
    return <p className="text-center text-white">Loading Portfolio...</p>;
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen p-3">
      <h1 className="text-3xl font-bold text-center">Portfolio Dashboard</h1>

      <PersonalportfolioData  portfolioData={portfolioData} />
      <Timeline  timeline={portfolioData.timeline} />
      <Skills  skills={portfolioData.skills} />
      <SoftwareApplications software={portfolioData.softwareApplications} />
      <Projects  projects={portfolioData.projects} />

      {portfolioData.deployLink === "" && (
        <div className="mt-8 flex justify-center">
          <Link to={"/portfolio/deploy"} className="rounded-xl border-cyan-300 border-2">
            <AnimatedButton4 text={"Deploy"} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default PortfolioDashboardData;
