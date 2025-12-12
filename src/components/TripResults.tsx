import { MapPin, ArrowLeft, Hotel, Utensils, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AccommodationCard } from './AccommodationCard';
import { DiningCard } from './DiningCard';
import { ActivityCard } from './ActivityCard';
import { LogisticsCard } from './LogisticsCard';

interface Accommodation {
  name: string;
  price: string;
  reason: string;
}

interface Dining {
  name: string;
  cuisine?: string;
  priceRange?: string;
  description?: string;
}

interface Activity {
  name: string;
  duration?: string;
  description?: string;
  location?: string;
}

interface Logistics {
  weather?: string;
  tips?: string[] | string;
  transportation?: string;
  currency?: string;
}

interface TripResultsProps {
  data: {
    destination_summary?: string;
    accommodation?: Accommodation[];
    dining?: Dining[];
    activities?: Activity[];
    logistics?: Logistics;
  };
  destination: string;
  onReset: () => void;
}

export const TripResults = ({ data, destination, onReset }: TripResultsProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-coral to-sunset overflow-hidden">
        <div className="absolute inset-0 bg-midnight/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-8">
          <Button
            variant="ghost"
            onClick={onReset}
            className="absolute top-4 left-4 text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Plan Another Trip
          </Button>
          
          <div className="flex items-center gap-2 text-primary-foreground/80 mb-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Your Curated Itinerary</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground">
            {destination}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Summary */}
        {data.destination_summary && (
          <div className="mb-12 max-w-3xl animate-fade-in-up">
            <p className="text-lg md:text-xl text-foreground leading-relaxed font-body">
              {data.destination_summary}
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Accommodations */}
            {data.accommodation && data.accommodation.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Hotel className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-display font-semibold text-foreground">
                    Where to Stay
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {data.accommodation.map((item, index) => (
                    <AccommodationCard
                      key={index}
                      name={item.name}
                      price={item.price}
                      reason={item.reason}
                      index={index}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Dining */}
            {data.dining && data.dining.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-sunset/10 flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-sunset" />
                  </div>
                  <h2 className="text-2xl font-display font-semibold text-foreground">
                    Where to Eat
                  </h2>
                </div>
                
                <div className="space-y-3">
                  {data.dining.map((item, index) => (
                    <DiningCard
                      key={index}
                      name={item.name}
                      cuisine={item.cuisine}
                      priceRange={item.priceRange}
                      description={item.description}
                      index={index}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Activities */}
            {data.activities && data.activities.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-ocean/10 flex items-center justify-center">
                    <Camera className="w-5 h-5 text-ocean" />
                  </div>
                  <h2 className="text-2xl font-display font-semibold text-foreground">
                    Things to Do
                  </h2>
                </div>
                
                <div className="space-y-3">
                  {data.activities.map((item, index) => (
                    <ActivityCard
                      key={index}
                      name={item.name}
                      duration={item.duration}
                      description={item.description}
                      location={item.location}
                      index={index}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {data.logistics && (
                <LogisticsCard {...data.logistics} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
