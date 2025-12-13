import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const loadingMessages = [
  "Searching for flights...",
  "Checking local events...",
  "Curating restaurants...",
  "Finding hidden gems...",
  "Optimizing your budget...",
  "Planning activities...",
  "Checking weather forecasts...",
  "Almost there...",
];

const LoadingOverlay = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="bg-card p-8 rounded-2xl shadow-xl text-center max-w-md">
        <Loader2 className="h-16 w-16 text-secondary animate-spin mx-auto mb-6" />
        <h2 className="text-xl font-bold text-foreground mb-2">Creating Your Itinerary</h2>
        <p className="text-secondary animate-pulse">{loadingMessages[messageIndex]}</p>
        <div className="mt-6 w-full bg-muted rounded-full h-2 overflow-hidden">
          <div 
            className="h-full w-1/2 rounded-full animate-pulse"
            style={{ background: "linear-gradient(to right, hsl(var(--secondary)), hsl(195 86% 41%))" }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
