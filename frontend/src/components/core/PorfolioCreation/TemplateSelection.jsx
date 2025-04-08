import { useEffect, useState } from "react";
import TemplateCard from "../Template/TemplateCard";
import { getAllTemplates } from "../../../services/operations/TemplateApi";


export default function TemplateSelection({ onTemplateSelect }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);

   useEffect(() => {
      const fetchTemplates = async () => {
        const result = await getAllTemplates();
        // console.log("ye hai apne sb templates",result)
        if (result) {
          setTemplates(result)
        }
      }
      fetchTemplates()
    }, [])

 
  // const templates = [
  //   { id: 1, name: "Portfolio", creator: "Harsh Kumar Vimal", description: "A clean and minimal portfolio template for showcasing your work.", image: "https://i.ytimg.com/vi/S9NOXjdipl4/maxresdefault.jpg" },
  //   { id: 2, name: "Creative Portfolio", creator: "Jane Doe", description: "A modern and responsive portfolio template for designers and artists.", image: "https://market-resized.envatousercontent.com/previews/files/560376481/theme-preview/Image-Preview.jpg?w=590&h=300&cf_fit=crop&crop=top&format=auto&q=85&s=6688dbf72c1d65124939cca9588b9a935c30f171ee8e2c19ff72b4ff07438def" },
  //   { id: 3, name: "Developer Portfolio", creator: "John Smith", description: "A sleek and professional portfolio template for developers.", image: "https://s3u.tmimgcdn.com/800x0/u6975116/VCJPf9hV2j4Pq5EeNoE8.png" },
  //   { id: 4, name: "Minimal Portfolio", creator: "Alice Johnson", description: "A stylish and content-focused portfolio template for creatives.", image: "https://i.ytimg.com/vi/RroDdybvu5s/maxresdefault.jpg" },
  //   { id: 5, name: "Corporate Portfolio", creator: "Michael Scott", description: "A professional portfolio template for business and corporate professionals.", image: "https://user-images.githubusercontent.com/25823744/174600959-93342e13-9137-4543-acc0-1cd31ae83ee0.png" },
  //   { id: 6, name: "Freelancer Portfolio", creator: "Emily Davis", description: "A high-converting portfolio template for freelancers.", image: "https://i.pinimg.com/736x/e8/c8/b0/e8c8b0adfadbc97aa96ff53e7392738e.jpg" },
  //   { id: 7, name: "Agency Portfolio", creator: "Chris Brown", description: "A sleek portfolio template for creative agencies.", image: "https://cdn.prod.website-files.com/5e8e816d43060db856099187/63b325e620d72639be415d63_2-dark-mode-design-portfolio-webflow-template-1.5x.png" },
  // ];

  const handleSelect = (template) => {
    setSelectedTemplate(template);
    onTemplateSelect(template); // Pass the selected template back to PortfolioCreatePage
  };
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template._id}
            onClick={() => handleSelect(template)}
            className={`relative cursor-pointer transition-transform duration-300 ease-in-out ${
              selectedTemplate?._id === template._id
                ? "border-8 border-green-600 scale-105 shadow-lg"
                : "border border-transparent"
            } rounded-xl p-`}
          >
            {/* Tick Icon for Selected Template */}
            {selectedTemplate?._id === template._id && (
              <div className="absolute top-2 right-2 bg-green-600 border-green-300 border-2  text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-md z-10">
                ✓
              </div>
            )}
            
            <TemplateCard template={template} />
          </div>
        ))}
      </div>
    </div>
  );
}
