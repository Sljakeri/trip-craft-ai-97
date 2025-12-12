import { useState } from 'react';
import { TravelForm } from '@/components/TravelForm';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { TripResults } from '@/components/TripResults';
import { Plane, Globe, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TripData {
  destination_summary?: string;
  accommodation?: Array<{ name: string; price: string; reason: string }>;
  dining?: Array<{ name: string; cuisine?: string; priceRange?: string; description?: string }>;
  activities?: Array<{ name: string; duration?: string; description?: string; location?: string }>;
  logistics?: {
    weather?: string;
    tips?: string[] | string;
    transportation?: string;
    currency?: string;
  };
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [destination, setDestination] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (formData: {
    destination: string;
    dates: string;
    budget: string;
    interests: string;
  }) => {
    setIsLoading(true);
    setDestination(formData.destination);

    try {
      const response = await fetch('https://bubatron28.app.n8n.cloud/webhook/bb609b3a-9f45', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body: {
            destination: formData.destination,
            dates: formData.dates,
            budget: formData.budget,
            interests: formData.interests,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Service temporarily unavailable');
      }

      const data = await response.json();
      setTripData(data);
    } catch (error) {
      console.error('Error fetching trip data:', error);
      toast({
        title: "Service Overloaded",
        description: "Our AI travel planner is currently busy. Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setTripData(null);
    setDestination('');
  };

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (tripData) {
    return <TripResults data={tripData} destination={destination} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg gradient-hero flex items-center justify-center shadow-soft">
              <Plane className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-semibold text-xl text-foreground">TravelAI</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              How it works
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Destinations
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-16">
        <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-coral/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-ocean/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sunset/5 blur-3xl" />
          </div>

          <div className="relative container mx-auto px-4 py-16 md:py-24">
            {/* Hero text */}
            <div className="text-center mb-12 md:mb-16 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4" />
                AI-Powered Trip Planning
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight">
                Your Perfect Trip,{' '}
                <span className="text-gradient">Crafted by AI</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-body">
                Tell us your dream destination and preferences. Our AI will curate a 
                personalized itinerary with the best hotels, restaurants, and experiences.
              </p>

              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-primary" />
                  100+ Destinations
                </span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sunset" />
                  Personalized Plans
                </span>
              </div>
            </div>

            {/* Form */}
            <TravelForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-primary" />
              <span className="font-display font-medium text-foreground">TravelAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 TravelAI. Crafting unforgettable journeys.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
