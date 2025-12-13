import TripMapView from "./TripMapView";

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
  destinationCity?: string;
}

const TripResults = ({ data, onNewTrip, destinationCity = "Your Destination" }: TripResultsProps) => {
  return (
    <TripMapView 
      data={data} 
      onNewTrip={onNewTrip} 
      destinationCity={destinationCity}
    />
  );
};

export default TripResults;
