import { useState, useEffect } from 'react';
import { Plane, MapPin, Utensils, Hotel, Calendar, Sparkles } from 'lucide-react';

const loadingMessages = [
  { text: "Searching for the best flights...", icon: Plane },
  { text: "Discovering hidden gems...", icon: MapPin },
  { text: "Curating local restaurants...", icon: Utensils },
  { text: "Finding perfect accommodations...", icon: Hotel },
  { text: "Planning your daily itinerary...", icon: Calendar },
  { text: "Adding final touches...", icon: Sparkles },
];

export const LoadingOverlay = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = loadingMessages[messageIndex].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-8 text-center px-6">
        {/* Animated rings */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" style={{ width: '120px', height: '120px', margin: '-10px' }} />
          <div className="absolute inset-0 rounded-full border-2 border-coral-light/30 animate-spin-slow" style={{ width: '140px', height: '140px', margin: '-20px' }} />
          <div className="w-24 h-24 rounded-full gradient-hero flex items-center justify-center shadow-glow">
            <CurrentIcon className="w-10 h-10 text-primary-foreground animate-float" />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h3 className="text-2xl font-display font-semibold text-foreground animate-fade-in-up" key={messageIndex}>
            {loadingMessages[messageIndex].text}
          </h3>
          <p className="text-muted-foreground font-body">
            Our AI is crafting your perfect journey
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2">
          {loadingMessages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                index === messageIndex
                  ? 'bg-primary w-6'
                  : index < messageIndex
                  ? 'bg-primary/60'
                  : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
