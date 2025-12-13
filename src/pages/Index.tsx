import { useState } from "react";
import { Plane, Train, Bus, Car, Ship, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import CityAutocomplete from "@/components/CityAutocomplete";
import TransportButton from "@/components/TransportButton";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import TripResults from "@/components/TripResults";
import LoadingOverlay from "@/components/LoadingOverlay";

interface TripData {
  departureLocation: string;
  destinationLocation: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  budgetUSD: number | null;
  preferredTransport: string[];
  travelDurationDays: number | null;
}

const transportOptions = [
  { type: "plane", icon: Plane, label: "Plane" },
  { type: "train", icon: Train, label: "Train" },
  { type: "bus", icon: Bus, label: "Bus" },
  { type: "car", icon: Car, label: "Car Rental" },
  { type: "ship", icon: Ship, label: "Cruise/Ship" },
];

const Index = () => {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [people, setPeople] = useState(1);
  const [budget, setBudget] = useState("");
  const [selectedTransport, setSelectedTransport] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tripResults, setTripResults] = useState<any>(null);
  const { toast } = useToast();

  const toggleTransport = (type: string) => {
    setSelectedTransport((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!destination || !departure) {
      toast({
        title: "Missing Information",
        description: "Please enter both a destination and departure location!",
        variant: "destructive",
      });
      return;
    }

    const tripData: TripData = {
      departureLocation: departure,
      destinationLocation: destination,
      startDate: dateFrom,
      endDate: dateTo,
      numberOfPeople: people,
      budgetUSD: budget ? parseFloat(budget) : null,
      preferredTransport: selectedTransport,
      travelDurationDays: null,
    };

    console.log("Trip Data JSON:", JSON.stringify(tripData, null, 2));

    setIsLoading(true);
    setTripResults(null);

    try {
      const response = await fetch("https://bubatron28.app.n8n.cloud/webhook-test/bb609b3a-9f45", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tripData),
      });

      if (!response.ok) {
        throw new Error("Service unavailable");
      }

      const data = await response.json();
      setTripResults(data);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Service Overloaded",
        description: "Our AI planners are busy. Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewTrip = () => {
    setTripResults(null);
    setDeparture("");
    setDestination("");
    setDateFrom("");
    setDateTo("");
    setPeople(1);
    setBudget("");
    setSelectedTransport([]);
  };

  if (tripResults) {
    return (
      <Layout>
        <TripResults data={tripResults} onNewTrip={handleNewTrip} />
      </Layout>
    );
  }

  return (
    <Layout>
      {isLoading && <LoadingOverlay />}

      <div className="hero-container">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Plan Your Perfect Trip with AI</h1>
        <p className="text-secondary mb-8">Select your preferences and let our algorithms do the rest.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-group min-w-[200px]">
              <label htmlFor="departure">From where?</label>
              <CityAutocomplete
                id="departure"
                value={departure}
                onChange={setDeparture}
                placeholder="e.g. London, Chicago..."
              />
            </div>

            <div className="input-group min-w-[200px]">
              <label htmlFor="destination">Where to go?</label>
              <CityAutocomplete
                id="destination"
                value={destination}
                onChange={setDestination}
                placeholder="e.g. Tokyo, Paris..."
              />
            </div>

            <div className="input-group min-w-[140px]">
              <label htmlFor="date-from">From</label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-3 border-2 border-border rounded-lg"
              />
            </div>

            <div className="input-group min-w-[140px]">
              <label htmlFor="date-to">To</label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-3 border-2 border-border rounded-lg"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group min-w-[140px]">
              <label htmlFor="people">Travelers</label>
              <Input
                id="people"
                type="number"
                min={1}
                value={people}
                onChange={(e) => setPeople(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-3 border-2 border-border rounded-lg"
              />
            </div>

            <div className="input-group min-w-[140px]">
              <label htmlFor="budget">Budget ($)</label>
              <Input
                id="budget"
                type="number"
                placeholder="5000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-3 py-3 border-2 border-border rounded-lg"
              />
            </div>
          </div>

          <div className="text-left my-5">
            <label className="text-sm font-semibold mb-2.5 block text-foreground">
              Preferred Transport (Select Multiple)
            </label>
            <div className="flex gap-2.5 flex-wrap mt-2.5">
              {transportOptions.map((transport) => (
                <TransportButton
                  key={transport.type}
                  type={transport.type}
                  icon={transport.icon}
                  label={transport.label}
                  selected={selectedTransport.includes(transport.type)}
                  onToggle={toggleTransport}
                />
              ))}
            </div>
          </div>

          <button type="submit" className="confirm-btn" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating...
              </span>
            ) : (
              "GENERATE ITINERARY"
            )}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Index;
