import React, { useEffect, useRef } from "react";

const YouTubeSlider: React.FC = () => {
  const videoListRef = useRef<HTMLDivElement>(null);
  const scrollBarThumbRef = useRef<HTMLDivElement>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const scrollBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const videoList = videoListRef.current!;
    const scrollBarThumb = scrollBarThumbRef.current!;
    const sliderScrollBar = scrollBarRef.current!;
    const maxScrollLeft = videoList.scrollWidth - videoList.clientWidth;

    const handleMouseDown = (e: MouseEvent) => {
      const startX = e.clientX;
      const thumbPosition = scrollBarThumb.offsetLeft;

      const handleMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - startX;
        const newThumbPosition = thumbPosition + deltaX;
        const maxThumbPosition = sliderScrollBar.clientWidth - scrollBarThumb.offsetWidth;
        const boundedPosition = Math.max(0, Math.min(maxThumbPosition, newThumbPosition));
        const scrollPosition = (boundedPosition / maxThumbPosition) * maxScrollLeft;

        scrollBarThumb.style.left = `${boundedPosition}px`;
        videoList.scrollLeft = scrollPosition;
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    scrollBarThumb.addEventListener("mousedown", handleMouseDown);

    const handleSlideButtons = () => {
      if (prevButtonRef.current && nextButtonRef.current) {
        prevButtonRef.current.style.display = videoList.scrollLeft <= 0 ? "none" : "block";
        nextButtonRef.current.style.display = videoList.scrollLeft >= maxScrollLeft ? "none" : "block";
      }
    };

    const updateScrollThumbPosition = () => {
      const scrollPosition = videoList.scrollLeft;
      const thumbPosition = (scrollPosition / maxScrollLeft) * (sliderScrollBar.clientWidth - scrollBarThumb.offsetWidth);
      scrollBarThumb.style.left = `${thumbPosition}px`;
    };

    const handleScroll = () => {
      handleSlideButtons();
      updateScrollThumbPosition();
    };

    videoList.addEventListener("scroll", handleScroll);
    handleSlideButtons();

    return () => {
      scrollBarThumb.removeEventListener("mousedown", handleMouseDown);
      videoList.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSlide = (direction: "prev" | "next") => {
    const videoList = videoListRef.current!;
    const scrollAmount = videoList.clientWidth * (direction === "prev" ? -1 : 1);
    videoList.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const videos = [
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "https://www.youtube.com/embed/3JZ_D3ELwOQ",
    "https://www.youtube.com/embed/L_jWHffIx5E",
    "https://www.youtube.com/embed/9bZkp7q19f0",
    "https://www.youtube.com/embed/eY52Zsg-KVI",
    "https://www.youtube.com/embed/fLexgOxsZu0",
    "https://www.youtube.com/embed/fLexgOxsZu0",
    "https://www.youtube.com/embed/fLexgOxsZu0",
    "https://www.youtube.com/embed/fLexgOxsZu0",
    "https://www.youtube.com/embed/fLexgOxsZu0"
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Personalized Dental Tips</h2>

      <div style={styles.sliderWrapper}>
        <button
          onClick={() => handleSlide("prev")}
          ref={prevButtonRef}
          style={{ ...styles.slideButton, left: "0" }}
        >
          ◀
        </button>

        <div style={styles.videoList} ref={videoListRef}>
          {videos.map((src, index) => (
            <iframe
              key={index}
              style={styles.videoItem}
              src={src}
              title={`YouTube video ${index + 1}`}
              frameBorder="0"
              allowFullScreen
            />
          ))}
        </div>

        <button
          onClick={() => handleSlide("next")}
          ref={nextButtonRef}
          style={{ ...styles.slideButton, right: "0" }}
        >
          ▶
        </button>
      </div>

      <div style={styles.sliderScrollbar} ref={scrollBarRef}>
        <div style={styles.scrollbarTrack}>
          <div style={styles.scrollbarThumb} ref={scrollBarThumbRef}></div>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "1200px",
    width: "95%",
    margin: "auto",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    background: "linear-gradient(135deg, #6eb5ff 0%, #4a90e2 50%, #357abd 100%)",
    borderRadius: "24px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    minHeight: "400px",
  },
  heading: {
    fontSize: "1.8rem",
    fontWeight: 600,
    marginBottom: "1.5rem",
    textAlign: "center",
    color: "white",
    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  sliderWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "10px",
    backdropFilter: "blur(10px)",
  },
  videoList: {
    display: "flex",
    overflowX: "scroll",
    scrollBehavior: "smooth",
    scrollbarWidth: "none" as any,
    msOverflowStyle: "none",
    width: "100%",
    padding: "10px 0",
  },
  videoItem: {
    minWidth: "320px",
    height: "180px",
    marginRight: "10px",
    borderRadius: "12px",
    pointerEvents: "auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
  slideButton: {
    position: "absolute",
    zIndex: 2,
    fontSize: "1.5rem",
    padding: "10px 16px",
    backgroundColor: "rgba(255,255,255,0.9)",
    border: "none",
    cursor: "pointer",
    top: "50%",
    transform: "translateY(-50%)",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
    borderRadius: "50%",
    fontWeight: "bold",
    color: "#357abd",
    transition: "all 0.3s ease",
  },
  sliderScrollbar: {
    height: "20px",
    marginTop: "15px",
  },
  scrollbarTrack: {
    height: "6px",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: "6px",
    position: "relative",
  },
  scrollbarThumb: {
    height: "100%",
    width: "60px",
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: "6px",
    position: "absolute",
    left: "0",
    cursor: "grab",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
};

export default YouTubeSlider;