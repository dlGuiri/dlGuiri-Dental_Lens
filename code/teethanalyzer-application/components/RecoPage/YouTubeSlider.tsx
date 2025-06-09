import React, { useState, useEffect } from "react";

// Custom arrow components
const ChevronLeft = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polyline points="15,18 9,12 15,6"></polyline>
  </svg>
);

const ChevronRight = ({ size = 24, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polyline points="9,18 15,12 9,6"></polyline>
  </svg>
);

const Play = ({ size = 24, fill, className }: { size?: number; fill?: string; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polygon points="5,3 19,12 5,21" fill={fill || "currentColor"}></polygon>
  </svg>
);

interface Video {
  id: string;
  thumbnail: string;
}

const videos: Video[] = [
  { id: "wrdEE8Br7Zk", thumbnail: "https://img.youtube.com/vi/wrdEE8Br7Zk/maxresdefault.jpg" },
  { id: "WviE5aa5Ha0", thumbnail: "https://img.youtube.com/vi/WviE5aa5Ha0/maxresdefault.jpg" },
  { id: "Qi-7ns4BfgM", thumbnail: "https://img.youtube.com/vi/Qi-7ns4BfgM/maxresdefault.jpg" },
  { id: "4NcYkEfwoio", thumbnail: "https://img.youtube.com/vi/4NcYkEfwoio/maxresdefault.jpg" },
  { id: "l22FVfim394", thumbnail: "https://img.youtube.com/vi/l22FVfim394/maxresdefault.jpg" },
  { id: "aOebfGGcjVw", thumbnail: "https://img.youtube.com/vi/aOebfGGcjVw/maxresdefault.jpg" },
  { id: "yNMqbL8B224", thumbnail: "https://img.youtube.com/vi/yNMqbL8B224/maxresdefault.jpg" },
  { id: "cK726D70Sfg", thumbnail: "https://img.youtube.com/vi/cK726D70Sfg/maxresdefault.jpg" }
];

const YoutubeSlider = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [mainVideo, setMainVideo] = useState(videos[0]);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [visibleThumbnails, setVisibleThumbnails] = useState(3);

  // Responsive thumbnail count
  useEffect(() => {
    const updateVisibleThumbnails = () => {
      if (window.innerWidth < 640) { // sm breakpoint
        setVisibleThumbnails(1);
      } else if (window.innerWidth < 768) { // md breakpoint
        setVisibleThumbnails(2);
      } else {
        setVisibleThumbnails(3);
      }
    };

    updateVisibleThumbnails();
    window.addEventListener('resize', updateVisibleThumbnails);
    return () => window.removeEventListener('resize', updateVisibleThumbnails);
  }, []);

  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
  };

  const handlePrev = () => setStartIndex(Math.max(0, startIndex - 1));
  const handleNext = () => setStartIndex(Math.min(videos.length - visibleThumbnails, startIndex + 1));
  const handleThumbnailClick = (video: Video) => setMainVideo(video);

  // Calculate thumbnail width and gap based on screen size
  const getThumbnailDimensions = () => {
    if (visibleThumbnails === 1) {
      return { width: 'w-64 sm:w-72', height: 'h-36 sm:h-40', gap: 'gap-4' };
    } else if (visibleThumbnails === 2) {
      return { width: 'w-40', height: 'h-24', gap: 'gap-3' };
    } else {
      return { width: 'w-32 lg:w-48', height: 'h-20 lg:h-28', gap: 'gap-2 lg:gap-4' };
    }
  };

  const dimensions = getThumbnailDimensions();

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-sky-400 mb-4 sm:mb-6 text-center">
        Personalized Dental Tips
      </h2>

      {/* Main Video Player */}
      <div className="relative mb-4 sm:mb-6">
        <div className="relative mx-auto w-full max-w-4xl">
          <iframe
            src={`https://www.youtube.com/embed/${mainVideo.id}`}
            title="Main Video"
            className="w-full h-56 sm:h-72 md:h-80 lg:h-96 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-500 ease-in-out"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="relative flex items-center justify-center">
        {/* Previous Button - Hidden on mobile when showing 1 thumbnail */}
        <button 
          onClick={handlePrev}
          disabled={startIndex === 0}
          className={`absolute left-0 sm:left-2 z-10 p-1 sm:p-2 rounded-full transition-all duration-200 ${
            startIndex === 0 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-sky-400 hover:text-sky-600 hover:bg-sky-50'
          } ${visibleThumbnails === 1 ? 'hidden sm:block' : ''}`}
        >
          <ChevronLeft size={visibleThumbnails === 1 ? 24 : 28} />
        </button>

        {/* Thumbnails Container */}
        <div 
          className={`${visibleThumbnails === 1 ? 'mx-0' : 'mx-8 sm:mx-12 lg:mx-16'} overflow-hidden touch-pan-y`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className={`flex ${dimensions.gap} transition-transform duration-500 ease-in-out justify-center sm:justify-start`}
            style={{ 
              transform: `translateX(-${startIndex * (100 / visibleThumbnails)}%)`,
            }}
          >
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => handleThumbnailClick(video)}
                className={`relative cursor-pointer group transition-all duration-200 flex-shrink-0 ${
                  mainVideo.id === video.id 
                    ? 'ring-2 sm:ring-4 ring-violet-400 rounded-lg sm:rounded-xl' 
                    : 'hover:ring-2 hover:ring-sky-300 rounded-lg sm:rounded-xl'
                }`}
                style={{
                  width: visibleThumbnails === 1 ? '100%' : `calc(${100 / visibleThumbnails}% - ${visibleThumbnails === 3 ? '0.5rem' : '0.75rem'})`
                }}
              >
                <div className="relative overflow-hidden rounded-lg sm:rounded-xl">
                  <img
                    src={video.thumbnail}
                    alt="Video thumbnail"
                    className={`${dimensions.width} ${dimensions.height} w-full object-cover transition-transform duration-200 group-hover:scale-105`}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Play className="text-white" size={visibleThumbnails === 1 ? 32 : 20} fill="white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Button - Hidden on mobile when showing 1 thumbnail */}
        <button 
          onClick={handleNext}
          disabled={startIndex >= videos.length - visibleThumbnails}
          className={`absolute right-0 sm:right-2 z-10 p-1 sm:p-2 rounded-full transition-all duration-200 ${
            startIndex >= videos.length - visibleThumbnails
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-sky-400 hover:text-sky-600 hover:bg-sky-50'
          } ${visibleThumbnails === 1 ? 'hidden sm:block' : ''}`}
        >
          <ChevronRight size={visibleThumbnails === 1 ? 24 : 28} />
        </button>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center mt-4 sm:mt-6 gap-2">
        {Array.from({ length: videos.length - visibleThumbnails + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setStartIndex(idx)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${
              startIndex === idx 
                ? 'bg-sky-400' 
                : 'bg-gray-300 hover:bg-sky-200'
            }`}
          />
        ))}
      </div>

      {/* Mobile Swipe Hint */}
      {visibleThumbnails === 1 && (
        <p className="text-center text-xs text-gray-500 mt-2 sm:hidden">
          Swipe left or right to browse videos
        </p>
      )}
    </div>
  );
};

export default YoutubeSlider;