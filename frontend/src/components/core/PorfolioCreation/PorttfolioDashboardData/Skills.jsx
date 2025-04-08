import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export const Skills = ({ skills }) => (
  <div className="w-full bg-black text-white p-6 rounded-xl shadow-lg border-2 border-gray-700 mt-5">
    <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-700">
      <h2 className="text-2xl font-semibold">Skill Proficiency</h2>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all">
        Manage Skills
      </button>
    </div>
    <div className="p-2 rounded-lg grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
      {skills.map((skill, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24">
            <CircularProgressbar
              value={skill.proficiency}
              text={`${skill.proficiency}%`}
              styles={buildStyles({
                textColor: "#fff",
                pathColor: "#00fc22",
                trailColor: "#374151",
              })}
            />
          </div>
          <span className="mt-2 text-sm font-medium">{skill.title
          }</span>
        </div>
      ))}
    </div>
  </div>
);
