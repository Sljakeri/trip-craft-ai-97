import { ArrowLeft, Sparkles, Eye, Info } from "lucide-react";
import CityInfoCard from "./CityInfoCard";
import DestinationCard from "./DestinationCard";

interface CrowdScores {
  "08:00": number;
  "12:00": number;
  "16:00": number;
  "20:00": number;
}

interface Destination {
  name: string;
  description: string;
  coordinates: { lat: number; lng: number };
  crowd_scores: CrowdScores;
}

interface HiddenGem extends Destination {
  type: string;
}

interface CityInfo {
  water_drinkable: boolean;
  safety_advisory: string;
  currency: string;
}

interface TripData {
  city_info?: CityInfo;
  must_see_destinations?: Destination[];
  hidden_gems?: HiddenGem[];
}

interface TripResultsProps {
  data: TripData;
  onNewTrip: () => void;
}

const TripResults = ({ data, onNewTrip }: TripResultsProps) => {
  return (
    <div className="w-full max-w-6xl px-4 py-8">
      <button
        onClick={onNewTrip}
        className="flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8 font-semibold"
      >
        <ArrowLeft className="h-4 w-4" />
        Plan New Trip
      </button>

      {/* City Info Section */}
      {data?.city_info && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/20">
              <Info className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Essential Info</h2>
          </div>
          <CityInfoCard
            waterDrinkable={data.city_info.water_drinkable}
            safetyAdvisory={data.city_info.safety_advisory}
            currency={data.city_info.currency}
          />
        </section>
      )}

      {/* Must See Destinations */}
      {data?.must_see_destinations && data.must_see_destinations.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-secondary/20">
              <Eye className="h-5 w-5 text-secondary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Must-See Destinations</h2>
            <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {data.must_see_destinations.length} places
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.must_see_destinations.map((dest, index) => (
              <DestinationCard
                key={index}
                name={dest.name}
                description={dest.description}
                coordinates={dest.coordinates}
                crowdScores={dest.crowd_scores}
              />
            ))}
          </div>
        </section>
      )}

      {/* Hidden Gems */}
      {data?.hidden_gems && data.hidden_gems.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <Sparkles className="h-5 w-5 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Hidden Gems</h2>
            <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
              {data.hidden_gems.length} discoveries
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.hidden_gems.map((gem, index) => (
              <DestinationCard
                key={index}
                name={gem.name}
                description={gem.description}
                coordinates={gem.coordinates}
                crowdScores={gem.crowd_scores}
                isGem={true}
                type={gem.type}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default TripResults;
