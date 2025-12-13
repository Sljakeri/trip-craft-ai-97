import React, { useState, useEffect, useRef } from "react";
import {
  Plane,
  Train,
  Bus,
  Car,
  Calendar as CalendarIcon,
  Users,
  MapPin,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ArrowUp,
  Star,
  ArrowRight,
  Sparkles,
  Leaf,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import TripResults from "@/components/TripResults";
import LoadingOverlay from "@/components/LoadingOverlay";
import Layout from "@/components/Layout";

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

const MAJOR_CITIES = [
  "New York, USA",
  "London, UK",
  "Paris, France",
  "Tokyo, Japan",
  "Belgrade, Serbia",
  "Dubai, UAE",
  "Singapore, Singapore",
  "Barcelona, Spain",
  "Rome, Italy",
  "Bangkok, Thailand",
  "Istanbul, Turkey",
  "Berlin, Germany",
  "Sydney, Australia",
  "Toronto, Canada",
  "Los Angeles, USA",
  "Amsterdam, Netherlands",
];

const reviews = {
  count: 1200,
  avatars: [
    { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&q=80&fit=crop", alt: "User 1" },
    { src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&q=80&fit=crop", alt: "User 2" },
    { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&q=80&fit=crop", alt: "User 3" },
    { src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&q=80&fit=crop", alt: "User 4" },
    { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&q=80&fit=crop", alt: "User 5" },
  ],
};

const Label = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <label className={`text-sm font-medium leading-none ${className}`}>{children}</label>
);

const SelectTrigger = ({
  label,
  icon: Icon,
  onClick,
  active,
}: {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  active: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex h-10 w-full items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${active ? "ring-2 ring-primary" : ""}`}
  >
    <div className="flex items-center gap-2 text-muted-foreground">
      {Icon && <Icon size={16} />}
      <span className={label ? "text-foreground" : "text-muted-foreground"}>{label || "Select..."}</span>
    </div>
    <ChevronDown size={16} className="opacity-50" />
  </button>
);

const Calendar = ({ selected, onSelect }: { selected: Date | null; onSelect: (date: Date) => void }) => {
  const [currentMonth, setCurrentMonth] = useState(selected || new Date());
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const handleSelectDate = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onSelect(newDate);
  };

  const renderDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days: React.ReactNode[] = [];

    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="h-9 w-9" />);

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = selected && date.toDateString() === selected.toDateString();
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <button
          key={day}
          onClick={() => handleSelectDate(day)}
          type="button"
          className={`h-9 w-9 p-0 font-normal text-sm rounded-md flex items-center justify-center transition-colors
            ${isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted"}
            ${isToday && !isSelected ? "bg-muted text-foreground" : ""}
          `}
        >
          {day}
        </button>,
      );
    }
    return days;
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="p-3 bg-card">
      <div className="flex justify-between items-center mb-4 space-x-1">
        <span className="text-sm font-medium">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <div className="flex items-center space-x-1">
          <Button variant="outline" size="icon" className="h-7 w-7 p-0" onClick={handlePrevMonth} type="button">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-7 w-7 p-0" onClick={handleNextMonth} type="button">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="text-[0.8rem] text-muted-foreground font-medium text-center h-9 flex items-center justify-center"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">{renderDays()}</div>
    </div>
  );
};

const HeroSection = () => (
  <div className="container text-center px-4 mb-10">
    <div className="mx-auto flex max-w-screen-lg flex-col gap-6">
      <h1 className="text-3xl font-extrabold lg:text-6xl text-foreground">
        See the World, <br />
        <span className="text-primary">Not the Crowd.</span>
      </h1>
      <p className="text-balance lg:text-xl text-muted-foreground max-w-2xl mx-auto">
        Our AI predicts crowd levels in real-time to build itineraries that optimize for peace, privacy, and authentic
        experiences.
      </p>
    </div>

    <div className="mx-auto mt-10 flex w-fit flex-col items-center gap-4 sm:flex-row mb-12">
      <span className="mx-4 inline-flex items-center -space-x-4">
        {reviews.avatars.map((avatar, index) => (
          <Avatar key={index} className="h-14 w-14 border-2 border-card">
            <AvatarImage src={avatar.src} alt={avatar.alt} />
          </Avatar>
        ))}
      </span>
      <div>
        <div className="flex items-center gap-1 justify-center sm:justify-start">
          {[...Array(5)].map((_, index) => (
            <Star key={index} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-left font-medium text-muted-foreground text-sm">from {reviews.count}+ happy travelers</p>
      </div>
    </div>
  </div>
);

const ProcessSteps = () => (
  <>
    <div className="text-center mt-24 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-foreground">How it works</h2>
      <p className="text-lg text-muted-foreground mt-2">We use AI to make your vacation more peaceful.</p>
    </div>

    <div className="mt-12 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-12 md:gap-4 items-center max-w-5xl mx-auto px-4">
      {[
        { icon: MapPin, title: "Define Trip", desc: "Set your destination, budget, and crowd preferences." },
        { icon: Sparkles, title: "AI Processing", desc: "Our engine scans historical data & live sensors." },
        { icon: Leaf, title: "Experience", desc: "Travel comfortably with optimized routing." },
      ].map((step, idx) => (
        <React.Fragment key={step.title}>
          {idx > 0 && (
            <div className="hidden md:flex justify-center text-muted-foreground/30">
              <ArrowRight size={32} />
            </div>
          )}
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-card shadow-xl border border-border flex items-center justify-center text-primary relative group hover:scale-105 transition-transform duration-300 cursor-default">
              <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                {idx + 1}
              </span>
              <step.icon size={32} />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">{step.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-[200px]">{step.desc}</p>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  </>
);

const Index = () => {
  const { toast } = useToast();

  const dateRef = useRef<HTMLDivElement>(null);
  const travelersRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  const [dateOpen, setDateOpen] = useState(false);
  const [activeDateTab, setActiveDateTab] = useState<"from" | "to">("from");
  const [travelersOpen, setTravelersOpen] = useState(false);
  const [originDropdownOpen, setOriginDropdownOpen] = useState(false);
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tripResults, setTripResults] = useState<any>(null);

  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    dateFrom: null as Date | null,
    dateTo: null as Date | null,
    travelers: { adults: 1, kids: 0 },
    budget: "",
    transport: "car",
    crowdPreference: "avoid",
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) setDateOpen(false);
      if (travelersRef.current && !travelersRef.current.contains(event.target as Node)) setTravelersOpen(false);
      if (originRef.current && !originRef.current.contains(event.target as Node)) setOriginDropdownOpen(false);
      if (destRef.current && !destRef.current.contains(event.target as Node)) setDestDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectTransport = (type: string) => {
    setFormData((prev) => ({ ...prev, transport: type }));
  };

  const handleDateSelect = (date: Date) => {
    if (activeDateTab === "from") {
      setFormData((prev) => ({ ...prev, dateFrom: date }));
      setActiveDateTab("to");
    } else {
      setFormData((prev) => ({ ...prev, dateTo: date }));
    }
  };

  const formatDate = (date: Date | null) =>
    date ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
  const formatDateForAPI = (date: Date | null) => (date ? date.toISOString().split("T")[0] : "");

  const updateTravelers = (type: "adults" | "kids", operation: "inc" | "dec") => {
    setFormData((prev) => {
      const current = prev.travelers[type];
      const newValue = operation === "inc" ? current + 1 : Math.max(0, current - 1);
      if (type === "adults" && newValue < 1) return prev;
      return { ...prev, travelers: { ...prev.travelers, [type]: newValue } };
    });
  };

  const handleCitySelect = (city: string, type: "origin" | "destination") => {
    setFormData((prev) => ({ ...prev, [type]: city }));
    if (type === "origin") setOriginDropdownOpen(false);
    if (type === "destination") setDestDropdownOpen(false);
  };

  const filterCities = (query: string) =>
    query ? MAJOR_CITIES.filter((city) => city.toLowerCase().includes(query.toLowerCase())) : MAJOR_CITIES;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.destination || !formData.origin) {
      toast({
        title: "Missing Information",
        description: "Please enter both a destination and departure location!",
        variant: "destructive",
      });
      return;
    }

    const tripData: TripData = {
      departureLocation: formData.origin,
      destinationLocation: formData.destination,
      startDate: formatDateForAPI(formData.dateFrom),
      endDate: formatDateForAPI(formData.dateTo),
      numberOfPeople: formData.travelers.adults + formData.travelers.kids,
      budgetUSD: formData.budget ? parseFloat(formData.budget) : null,
      preferredTransport: [formData.transport],
      travelDurationDays: null,
    };

    console.log("Trip Data JSON:", JSON.stringify(tripData, null, 2));

    setIsLoading(true);
    setTripResults(null);

    try {
      const response = await fetch("https://bubatron28.app.n8n.cloud/webhook/bb609b3a-9f45", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripData),
      });

      if (!response.ok) throw new Error("Service unavailable");

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
    setFormData({
      origin: "",
      destination: "",
      dateFrom: null,
      dateTo: null,
      travelers: { adults: 1, kids: 0 },
      budget: "",
      transport: "car",
      crowdPreference: "avoid",
    });
  };

  const Counter = ({ label, value, type }: { label: string; value: number; type: "adults" | "kids" }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => updateTravelers(type, "dec")}
          disabled={type === "adults" && value <= 1}
        >
          <Minus size={14} />
        </Button>
        <span className="w-4 text-center text-sm font-medium">{value}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => updateTravelers(type, "inc")}
        >
          <Plus size={14} />
        </Button>
      </div>
    </div>
  );

  const totalTravelers = formData.travelers.adults + formData.travelers.kids;

  if (tripResults) {
    return (
      <Layout hideFooter>
        <TripResults 
          data={tripResults} 
          onNewTrip={handleNewTrip} 
          destinationCity={formData.destination}
          formData={formData}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      {isLoading && <LoadingOverlay />}

      <section className="relative pt-8 pb-16 overflow-hidden bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <HeroSection />

          <Card className="max-w-4xl mx-auto p-6 shadow-xl bg-card/80 backdrop-blur-sm relative z-10 text-left">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Locations Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 relative" ref={originRef}>
                  <Label>Where from?</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      className="pl-10"
                      placeholder="e.g. New York, London"
                      value={formData.origin}
                      onChange={(e) => {
                        setFormData({ ...formData, origin: e.target.value });
                        setOriginDropdownOpen(true);
                      }}
                      onFocus={() => setOriginDropdownOpen(true)}
                    />
                  </div>
                  {originDropdownOpen && (
                    <div className="absolute top-full left-0 z-20 mt-1 w-full max-h-60 overflow-y-auto rounded-md border border-border bg-popover shadow-lg p-1">
                      {filterCities(formData.origin).length > 0 ? (
                        filterCities(formData.origin).map((city, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                            onClick={() => handleCitySelect(city, "origin")}
                          >
                            {city}
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-muted-foreground">No results found.</div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2 relative" ref={destRef}>
                  <Label>Where to?</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      className="pl-10"
                      placeholder="e.g. Belgrade, Serbia"
                      value={formData.destination}
                      onChange={(e) => {
                        setFormData({ ...formData, destination: e.target.value });
                        setDestDropdownOpen(true);
                      }}
                      onFocus={() => setDestDropdownOpen(true)}
                    />
                  </div>
                  {destDropdownOpen && (
                    <div className="absolute top-full left-0 z-20 mt-1 w-full max-h-60 overflow-y-auto rounded-md border border-border bg-popover shadow-lg p-1">
                      {filterCities(formData.destination).length > 0 ? (
                        filterCities(formData.destination).map((city, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded-md transition-colors"
                            onClick={() => handleCitySelect(city, "destination")}
                          >
                            {city}
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-sm text-muted-foreground">No results found.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Dates & People Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 space-y-2 relative" ref={dateRef}>
                  <Label>When?</Label>
                  <SelectTrigger
                    icon={CalendarIcon}
                    label={
                      formData.dateFrom
                        ? `${formatDate(formData.dateFrom)} ${formData.dateTo ? `- ${formatDate(formData.dateTo)}` : ""}`
                        : "Select dates"
                    }
                    onClick={() => setDateOpen(!dateOpen)}
                    active={dateOpen}
                  />
                  {dateOpen && (
                    <div className="absolute top-full left-0 z-20 mt-2 w-full max-w-[340px] p-0 rounded-md border border-border bg-popover shadow-xl overflow-hidden">
                      <div className="flex border-b border-border p-2 gap-2 bg-muted/50">
                        <button
                          type="button"
                          onClick={() => setActiveDateTab("from")}
                          className={`flex-1 text-xs font-medium py-1.5 px-2 rounded transition-colors text-left ${activeDateTab === "from" ? "bg-card shadow-sm text-foreground ring-1 ring-border" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                        >
                          <span className="block text-[10px] text-muted-foreground uppercase tracking-wider">
                            Departure
                          </span>
                          {formData.dateFrom ? formatDate(formData.dateFrom) : "Select date"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveDateTab("to")}
                          className={`flex-1 text-xs font-medium py-1.5 px-2 rounded transition-colors text-left ${activeDateTab === "to" ? "bg-card shadow-sm text-foreground ring-1 ring-border" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                        >
                          <span className="block text-[10px] text-muted-foreground uppercase tracking-wider">
                            Return
                          </span>
                          {formData.dateTo ? formatDate(formData.dateTo) : "Select date"}
                        </button>
                      </div>
                      <div className="p-2">
                        <Calendar
                          selected={activeDateTab === "from" ? formData.dateFrom : formData.dateTo}
                          onSelect={handleDateSelect}
                        />
                      </div>
                      <div className="p-3 border-t border-border bg-muted/50 flex justify-end">
                        <Button type="button" size="sm" className="h-8 text-xs" onClick={() => setDateOpen(false)}>
                          Done
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2 relative" ref={travelersRef}>
                  <Label>Travelers</Label>
                  <SelectTrigger
                    icon={Users}
                    label={`${totalTravelers} Traveler${totalTravelers > 1 ? "s" : ""}`}
                    onClick={() => setTravelersOpen(!travelersOpen)}
                    active={travelersOpen}
                  />
                  {travelersOpen && (
                    <div className="absolute top-full left-0 z-20 mt-2 w-full p-4 rounded-md border border-border bg-popover shadow-lg min-w-[200px]">
                      <div className="space-y-2">
                        <Counter label="Adults" value={formData.travelers.adults} type="adults" />
                        <div className="h-px bg-border" />
                        <Counter label="Kids" value={formData.travelers.kids} type="kids" />
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="w-full mt-4"
                        onClick={() => setTravelersOpen(false)}
                      >
                        Done
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Budget ($)</Label>
                  <Input
                    type="number"
                    placeholder="5000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
              </div>

              {/* Transport & Preferences */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase text-muted-foreground tracking-wider">Transport Mode</Label>
                    <div className="flex gap-2">
                      {[
                        { id: "car", icon: Car },
                        { id: "plane", icon: Plane },
                        { id: "bus", icon: Bus },
                        { id: "train", icon: Train },
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => selectTransport(mode.id)}
                          className={`p-2 rounded-md transition-all ${formData.transport === mode.id ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary ring-offset-2" : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"}`}
                          aria-label={mode.id}
                        >
                          <mode.icon size={18} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2 flex-1 md:max-w-xs">
                    <Label className="text-xs uppercase text-muted-foreground tracking-wider">Crowd Tolerance</Label>
                    <div className="grid grid-cols-3 gap-1 bg-muted p-1 rounded-lg">
                      {["Avoid", "Balanced", "Popular"].map((pref) => (
                        <button
                          key={pref}
                          type="button"
                          onClick={() => setFormData({ ...formData, crowdPreference: pref.toLowerCase() })}
                          className={`text-xs font-medium py-1.5 rounded-md transition-all ${formData.crowdPreference === pref.toLowerCase() ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                        >
                          {pref}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full h-12 text-base" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating...
                  </span>
                ) : (
                  <>
                    Generate Optimized Itinerary
                    <ArrowUp className="ml-2 rotate-45" size={18} />
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                <ShieldCheck size={12} className="inline mr-1" />
                AI analyzes historical foot traffic, weather, and local events.
              </p>
            </form>
          </Card>

          <ProcessSteps />

          <div className="mt-20 flex justify-center pb-12">
            <Button size="lg" className="text-base shadow-xl hover:shadow-2xl">
              Get Started Now
              <ArrowUp className="ml-2 rotate-45" size={18} />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
