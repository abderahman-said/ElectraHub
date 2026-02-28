import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Pause, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';

export const CycleCard = ({ 
  items = [], 
  autoPlay = true, 
  interval = 3000,
  showDots = true,
  showArrows = true,
  className = "",
  aspectRatio = "aspect-video"
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || isHovered || items.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === items.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, items.length, interval]);

  const goToNext = () => {
    setCurrentIndex(currentIndex === items.length - 1 ? 0 : currentIndex + 1);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? items.length - 1 : currentIndex - 1);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  if (items.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-xl flex items-center justify-center ${aspectRatio} ${className}`}>
        <p className="text-gray-500">No items to display</p>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <div 
      className={`relative group overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Content */}
      <div className={aspectRatio}>
        {currentItem.type === 'image' ? (
          <img
            src={currentItem.src}
            alt={currentItem.alt || ''}
            className="w-full h-full object-cover"
          />
        ) : currentItem.type === 'video' ? (
          <video
            src={currentItem.src}
            className="w-full h-full object-cover"
            autoPlay={currentItem.autoPlay}
            muted={currentItem.muted}
            loop={currentItem.loop}
            controls={currentItem.controls}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="text-center text-white p-8">
              {currentItem.icon && <currentItem.icon className="w-16 h-16 mx-auto mb-4" />}
              <h3 className="text-2xl font-bold mb-2">{currentItem.title}</h3>
              <p className="text-lg opacity-90">{currentItem.description}</p>
            </div>
          </div>
        )}
      </div>

      {/* Overlay Content */}
      {currentItem.overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
          <div className="text-white">
            <h3 className="text-xl font-bold mb-2">{currentItem.overlay.title}</h3>
            <p className="text-sm opacity-90">{currentItem.overlay.description}</p>
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      {showArrows && items.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
            aria-label="Previous item"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
            aria-label="Next item"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Play/Pause Button */}
      {items.length > 1 && (
        <button
          onClick={togglePlayPause}
          className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>
      )}

      {/* Progress Indicator */}
      {items.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-linear"
            style={{ 
              width: isPlaying ? `${((currentIndex + 1) / items.length) * 100}%` : `${((currentIndex + 1) / items.length) * 100}%`,
              transition: isPlaying ? `width ${interval}ms linear` : 'none'
            }}
          />
        </div>
      )}

      {/* Dots Indicator */}
      {showDots && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white w-6' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Item Counter */}
      {items.length > 1 && (
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {currentIndex + 1} / {items.length}
        </div>
      )}
    </div>
  );
};

// Preset configurations for common use cases
export const ProductCycleCard = ({ products, ...props }) => {
  const items = products.map(product => ({
    type: 'image',
    src: product.images?.[0] || '/placeholder-product.jpg',
    alt: product.name_ar || product.name,
    overlay: {
      title: product.name_ar || product.name,
      description: `${product.wholesale_price} جنيه`
    }
  }));
  
  return <CycleCard items={items} {...props} />;
};

export const CategoryCycleCard = ({ categories, ...props }) => {
  const items = categories.map(category => ({
    type: 'custom',
    title: category.name_ar,
    description: `${category.product_count || 0} منتج`,
    icon: () => (
      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
        <span className="text-2xl">📦</span>
      </div>
    ),
    overlay: {
      title: category.name_ar,
      description: `${category.product_count || 0} منتج متاح`
    }
  }));
  
  return <CycleCard items={items} {...props} />;
};

export const PromotionCycleCard = ({ promotions, ...props }) => {
  const items = promotions.map(promo => ({
    type: 'custom',
    title: promo.title,
    description: promo.description,
    icon: () => (
      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
        <span className="text-2xl">🔥</span>
      </div>
    ),
    overlay: {
      title: promo.title,
      description: promo.discount ? `خصم ${promo.discount}%` : promo.description
    }
  }));
  
  return <CycleCard items={items} interval={4000} {...props} />;
};

export default CycleCard;
