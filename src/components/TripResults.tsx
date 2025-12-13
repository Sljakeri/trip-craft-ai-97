import { MapPin, Hotel, Utensils, Camera, Cloud, ArrowLeft } from "lucide-react";
import { AccommodationCard } from "./AccommodationCard";
import { DiningCard } from "./DiningCard";
import { ActivityCard } from "./ActivityCard";
import { LogisticsCard } from "./LogisticsCard";

interface TripResultsProps {
  data: any;
  onNewTrip: () => void;
}

const TripResults = ({ data, onNewTrip }: TripResultsProps) => {
  return (
    <div className="w-full max-w-6xl px-4">
      <button
        onClick={onNewTrip}
        className="flex items-center gap-2 text-secondary hover:underline mb-6 font-semibold"
      >
        <ArrowLeft className="h-4 w-4" />
        Plan New Trip
      </button>

      {/* Destination Summary */}
      <div 
        className="text-primary-foreground p-8 rounded-2xl mb-8"
        style={{ background: "linear-gradient(to right, hsl(var(--primary)), hsl(222 33% 21%))" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="h-8 w-8" />
          <h1 className="text-2xl md:text-3xl font-bold">Your Itinerary</h1>
        </div>
        <p className="text-lg opacity-90">
          {data?.destination_summary || "Your personalized travel plan is ready!"}
        </p>
      </div>

      {/* Accommodations */}
      {data?.accommodation && data.accommodation.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Hotel className="h-6 w-6 text-secondary" />
            <h2 className="text-2xl font-bold text-foreground">Accommodations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.accommodation.map((item: any, index: number) => (
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
      {data?.dining && data.dining.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="h-6 w-6 text-secondary" />
            <h2 className="text-2xl font-bold text-foreground">Dining</h2>
          </div>
          <div className="space-y-3">
            {data.dining.map((item: any, index: number) => (
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
      {data?.activities && data.activities.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Camera className="h-6 w-6 text-secondary" />
            <h2 className="text-2xl font-bold text-foreground">Activities</h2>
          </div>
          <div className="space-y-3">
            {data.activities.map((item: any, index: number) => (
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

      {/* Logistics */}
      {data?.logistics && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Cloud className="h-6 w-6 text-secondary" />
            <h2 className="text-2xl font-bold text-foreground">Travel Info</h2>
          </div>
          <LogisticsCard 
            weather={data.logistics.weather}
            tips={data.logistics.tips}
            transportation={data.logistics.transportation}
            currency={data.logistics.currency}
          />
        </section>
      )}
    </div>
  );
};

export default TripResults;
