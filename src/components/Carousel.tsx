import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarouselProps {
  screens: Array<{
    id: number;
    title: string;
    content: string;
    backgroundColor?: string;
  }>;
}

const Carousel = ({ screens }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % screens.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, screens.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % screens.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + screens.length) % screens.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const getVisibleScreens = () => {
    const visible = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + screens.length) % screens.length;
      visible.push({
        ...screens[index],
        position: i,
        isActive: i === 0
      });
    }
    return visible;
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-8">
      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="sm"
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 text-foreground hover:bg-foreground/10 rounded-full p-3"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 text-foreground hover:bg-foreground/10 rounded-full p-3"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Carousel Container */}
      <div className="flex items-center justify-center space-x-8 py-12">
        {getVisibleScreens().map((screen, index) => (
          <div
            key={`${screen.id}-${currentIndex}`}
            className={`
              carousel-card flex-shrink-0 cursor-pointer
              ${screen.isActive 
                ? 'carousel-card-active w-96 h-64' 
                : 'w-72 h-48 opacity-70 hover:opacity-90'
              }
            `}
            onClick={() => !screen.isActive && goToSlide((currentIndex + screen.position + screens.length) % screens.length)}
            style={{
              backgroundColor: screen.backgroundColor || 'hsl(var(--card))',
            }}
          >
            <div className="p-8 h-full flex flex-col justify-center items-center text-center">
              <h3 className={`font-bold mb-4 text-card-foreground ${
                screen.isActive ? 'text-2xl' : 'text-lg'
              }`}>
                {screen.title}
              </h3>
              <p className={`text-card-foreground/80 ${
                screen.isActive ? 'text-base' : 'text-sm'
              }`}>
                {screen.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center space-x-3 mt-8">
        {screens.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`
              pagination-dot
              ${index === currentIndex 
                ? 'pagination-dot-active' 
                : 'pagination-dot-inactive'
              }
            `}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;