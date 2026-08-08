import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { useGalleryImages } from "@/hooks/useContent";

interface GalleryPhoto {
  src: string;
  aspectRatio: number;
  width: number;
  height: number;
}

const previewCount = 6; // 3×2 grid layout

const PhotoGallerySection = () => {
  const navigate = useNavigate();
  const { data: allImages = [] } = useGalleryImages();
  const [previewPhotos, setPreviewPhotos] = React.useState<GalleryPhoto[]>([]);

  const handleNavigateToGallery = () => {
    navigate("/full-gallery");
  };

  React.useEffect(() => {
    let isMounted = true;
    Promise.all(
      allImages.map(
        (src, idx) =>
          new Promise((resolve) => {
            const img = new window.Image();
            img.src = String(src);
            img.onload = () => {
              resolve({ 
                src, 
                aspectRatio: img.naturalWidth / img.naturalHeight,
                width: img.naturalWidth,
                height: img.naturalHeight
              });
            };
            img.onerror = (err) => {
              console.error(`PhotoGallerySection: ✗ Image ${idx + 1} failed to load:`, src, err);
              resolve(null);
            };
          })
      )
    ).then((results) => {
      if (isMounted) {
        const validPhotos = (results.filter(Boolean) as GalleryPhoto[]).slice(0, previewCount);
        setPreviewPhotos(validPhotos);
      }
    });
    return () => { isMounted = false; };
  }, [allImages]);

  return (
    <section className="min-h-screen bg-background flex flex-col justify-center items-center py-12 sm:py-16 lg:py-20">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 gradient-text px-4"
      >
        Photo Gallery
      </motion.h2>
      
      {/* 3×2 Grid Gallery */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {previewPhotos.map((photo, index) => (
            <motion.div
              key={`photo-${photo.src}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="aspect-[4/3] rounded-xl overflow-hidden shadow-lg cursor-pointer relative group"
              whileHover={{ 
                scale: 1.03, 
                y: -5,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNavigateToGallery}
              style={{ 
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              }}
            >
              <img
                src={photo.src}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
                style={{
                  transition: "transform 0.5s ease, filter 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.filter = "brightness(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.filter = "brightness(1)";
                }}
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center mt-8 sm:mt-12 px-4">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full text-white font-semibold transition-all duration-300 shadow-lg text-sm sm:text-base lg:text-lg hover:shadow-xl"
          onClick={handleNavigateToGallery}
        >
          View Complete Gallery
        </motion.button>
      </div>
    </section>
  );
}

export default PhotoGallerySection;