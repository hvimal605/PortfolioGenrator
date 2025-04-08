import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Core styles
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/autoplay"; // Optional for smoother autoplay
import templateImg1 from "../../../assets/images/templateImg1.png";

// Import required modules directly
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import AnimatedButton2 from "../../common/AnimatedButton2";

const templates = [
  {
    name: "Modern Portfolio",
    previewLink: "#",
    image: "https://i.ytimg.com/vi/S9NOXjdipl4/maxresdefault.jpg",
  },
  {
    name: "Creative Portfolio",
    previewLink: "#",
    image: "https://market-resized.envatousercontent.com/previews/files/560376481/theme-preview/Image-Preview.jpg?w=590&h=300&cf_fit=crop&crop=top&format=auto&q=85&s=6688dbf72c1d65124939cca9588b9a935c30f171ee8e2c19ff72b4ff07438def",
  },
  {
    name: "Minimal Portfolio",
    previewLink: "#",
    image: "https://s3u.tmimgcdn.com/800x0/u6975116/VCJPf9hV2j4Pq5EeNoE8.png",
  },
  {
    name: "Professional Portfolio",
    previewLink: "#",
    image: "https://i.ytimg.com/vi/RroDdybvu5s/maxresdefault.jpg",
  },
  {
    name: "Modern Portfolio",
    previewLink: "#",
    image: "https://i.ytimg.com/vi/S9NOXjdipl4/maxresdefault.jpg",
  },
  {
    name: "Creative Portfolio",
    previewLink: "#",
    image: "https://market-resized.envatousercontent.com/previews/files/560376481/theme-preview/Image-Preview.jpg?w=590&h=300&cf_fit=crop&crop=top&format=auto&q=85&s=6688dbf72c1d65124939cca9588b9a935c30f171ee8e2c19ff72b4ff07438def",
  },
  {
    name: "Minimal Portfolio",
    previewLink: "#",
    image: "https://s3u.tmimgcdn.com/800x0/u6975116/VCJPf9hV2j4Pq5EeNoE8.png",
  },
  {
    name: "Professional Portfolio",
    previewLink: "#",
    image: "https://i.ytimg.com/vi/RroDdybvu5s/maxresdefault.jpg",
  },
];

const TemplateSwiper = () => {
  return (
    <section
      className="py-12 relative "
      style={{
        backgroundImage: `url('https://i.pinimg.com/originals/c4/05/e5/c405e59f2114f36defe07f92a771d9a5.gif')`, // Replace with your GIF link
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay to darken the background */}
      <div className="relative container mx-auto px-6 md:px-12 z-10">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-500">
          Portfolio Templates
        </h2>

        {/* Swiper */}
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          slidesPerView={1}
          spaceBetween={5}
          pagination={{ clickable: true }}
          navigation
          autoplay={{
            disableOnInteraction: false, // Keep autoplay running after user interaction
          }}
          speed={1000} // Smooth transition duration in milliseconds
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="rounded-lg"
        >
          {templates.map((template, index) => (
            <SwiperSlide key={index}>
              <div
                className="border p-4 mt-3 mb-8 mr-3 ml-3 border-white border-dashed bg-black rounded-2xl shadow-lg overflow-hidden group transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                onMouseEnter={() =>
                  document.querySelector(".swiper").swiper.autoplay.stop()
                } // Stop autoplay on hover
                onMouseLeave={() =>
                  document.querySelector(".swiper").swiper.autoplay.start()
                } // Resume autoplay when hover ends
              >
                {/* Image */}
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-blue-400 group-hover:text-green-400 transition-colors duration-300">
                    {template.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    A professional and modern portfolio template designed to
                    showcase your work beautifully.
                  </p>
                  <a
                    href={template.previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <AnimatedButton2 text={"Preview Template"} />
                  </a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Custom Pagination Dots Styles */}
      <style jsx>{`
        .swiper-pagination-bullet {
          background-color: rgba(255, 255, 255);
          transition: background-color 0.3s ease;
         
        }

        .swiper-pagination-bullet-active {
          background-color: #4caf50; 
        }
      `}</style>
    </section>
  );
};

export default TemplateSwiper;
