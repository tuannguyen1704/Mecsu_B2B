import React from 'react';
import { motion } from 'motion/react';
import { Share2 } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface ProductGalleryProps {
  images: (string | null)[];
  productName: string;
  activeImage: number;
  setActiveImage: (index: number) => void;
}

export default function ProductGallery({ images, productName, activeImage, setActiveImage }: ProductGalleryProps) {
  const currentImage = images[activeImage];

  return (
    <div className="flex flex-col gap-4 font-sans h-fit">
      {/* Main Image on top */}
      <div className="relative aspect-square bg-white flex items-center justify-center p-4 overflow-hidden group border border-slate-100 rounded-sm">
        {currentImage ? (
          <motion.img 
            key={productName + activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={currentImage} 
            alt={productName} 
            className="max-w-full max-h-full object-contain cursor-zoom-in"
          />
        ) : (
          <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
            No Image
          </div>
        )}
        
        {/* Share icon (top right like image) */}
        <div className="absolute top-0 right-0">
          <button className="p-2 text-slate-500 hover:text-slate-700 transition-colors">
            <Share2 size={24} />
          </button>
        </div>

        {/* Zoom Indicator */}
        <div className="absolute bottom-4 left-0 right-0 text-center">
           <span className="text-[13px] text-[#565959]">Click to see full view</span>
        </div>
      </div>

      {/* Thumbnails below main image */}
      <div className="flex gap-2 h-16 xl:h-20 overflow-x-auto pb-2 scrollbar-none">
        {images.map((img, i) => (
          <button 
            key={i}
            onMouseEnter={() => setActiveImage(i)}
            onClick={() => setActiveImage(i)}
            className={`aspect-square h-full border-2 transition-all duration-200 p-1 flex items-center justify-center bg-white rounded-md overflow-hidden shrink-0 ${
              activeImage === i 
                ? 'border-[#007185] shadow-sm' 
                : 'border-transparent hover:border-[#007185]/40 opacity-70 hover:opacity-100'
            }`}
          >
            {img ? (
              <img src={img} alt="" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="w-full h-full bg-slate-50 flex items-center justify-center text-[10px] text-slate-300">
                No
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
