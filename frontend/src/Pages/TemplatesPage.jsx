import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import TemplateCard from "../components/core/Template/TemplateCard";
import Button from "../components/common/AnimatedButton";
import { getAllTemplates } from "../services/operations/TemplateApi";
import { setTemplateId } from "../slices/PortfolioSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// const templates = [
//   { id: 1, name: "Portfolio", creator: "Harsh Kumar Vimal", description: "A clean and minimal portfolio template for showcasing your work.", image: "https://i.ytimg.com/vi/S9NOXjdipl4/maxresdefault.jpg" },
//   { id: 2, name: "Creative Portfolio", creator: "Jane Doe", description: "A modern and responsive portfolio template for designers and artists.", image: "https://market-resized.envatousercontent.com/previews/files/560376481/theme-preview/Image-Preview.jpg?w=590&h=300&cf_fit=crop&crop=top&format=auto&q=85&s=6688dbf72c1d65124939cca9588b9a935c30f171ee8e2c19ff72b4ff07438def" },
//   { id: 3, name: "Developer Portfolio", creator: "John Smith", description: "A sleek and professional portfolio template for developers.", image: "https://s3u.tmimgcdn.com/800x0/u6975116/VCJPf9hV2j4Pq5EeNoE8.png" },
//   { id: 4, name: "Minimal Portfolio", creator: "Alice Johnson", description: "A stylish and content-focused portfolio template for creatives.", image: "https://i.ytimg.com/vi/RroDdybvu5s/maxresdefault.jpg" },
//   { id: 5, name: "Corporate Portfolio", creator: "Michael Scott", description: "A professional portfolio template for business and corporate professionals.", image: "https://user-images.githubusercontent.com/25823744/174600959-93342e13-9137-4543-acc0-1cd31ae83ee0.png" },
//   { id: 6, name: "Freelancer Portfolio", creator: "Emily Davis", description: "A high-converting portfolio template for freelancers.", image: "https://i.pinimg.com/736x/e8/c8/b0/e8c8b0adfadbc97aa96ff53e7392738e.jpg" },
//   { id: 7, name: "Agency Portfolio", creator: "Chris Brown", description: "A sleek portfolio template for creative agencies.", image: "https://cdn.prod.website-files.com/5e8e816d43060db856099187/63b325e620d72639be415d63_2-dark-mode-design-portfolio-webflow-template-1.5x.png" },
// ];

const ITEMS_PER_PAGE = 6;

export default function TemplatesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);


  useEffect(() => {
    const fetchTemplates = async () => {
      const result = await getAllTemplates();
      console.log("ye hai apne sb templates",result)
      if (result) {
        setTemplates(result)
      }
    }
    fetchTemplates()
  }, [])

  const filteredTemplates = templates.filter(template =>
    template?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.CreatedBy.toLowerCase().includes(searchQuery.toLowerCase())||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE);
  const paginatedTemplates = filteredTemplates.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
 

  const handleStartBuilding = ()=> {

    dispatch(setTemplateId(selectedTemplate._id));
    navigate('/PortfolioCreate/UploadDetails')
 
  }

 

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6 text-center">🔥 Select Your Dream Template</h1>

      <input 
        type="text"
        placeholder="🔍 Search by name or creator..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-6 p-2 w-full sm:w-96 text-white border rounded-lg shadow-md"
      />

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1 }}
      >
        {paginatedTemplates.length > 0 ? (
          paginatedTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} onSelect={setSelectedTemplate} />
          ))
        ) : (
          <p className="text-gray-400 col-span-3">No templates found.</p>
        )}
      </motion.div>

      {/* Pagination Controls */}
      <div className="mt-10 flex space-x-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
        >
          ◀ Prev
        </button>
        <span className="px-4 py-2 text-lg">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
        >
          Next ▶
        </button>
      </div>

      {selectedTemplate && (
        <motion.div 
          className="fixed inset-0 bg-black/70 flex items-center justify-center"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
        >
          <div className="bg-gray-700 text-black p-6 rounded-xl max-w-lg relative shadow-2xl">
            <button 
              onClick={() => setSelectedTemplate(null)} 
              className="absolute top-3 right-4 text-xl font-bold text-gray-700"
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold text-white">{selectedTemplate.name}</h2>
            <p className="text-gray-100 mt-2">{selectedTemplate.description}</p>
            <p className="text-sm text-gray-200 mt-1">Created by: <span className="font-semibold">{selectedTemplate.CreatedBy}</span></p>
            <img src={selectedTemplate.previewImage} alt={selectedTemplate.name} className="mt-4 rounded-lg" />
            <div onClick={handleStartBuilding} className="mt-4">
              <Button content="Start Building" />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}