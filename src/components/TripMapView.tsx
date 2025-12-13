import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, ChevronRight, ChevronLeft, MapPin, X, Menu, Save, Check, LogIn, Calendar, Utensils } from 'lucide-react';
import ExpensePanel from './ExpensePanel';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { usePendingTrip } from '@/hooks/usePendingTrip';
import { useNavigate } from 'react-router-dom';

// Clean perplexity references like [1], [2], [1][4] from text
const cleanPerplexityRefs = (text: string): string => {
  return text.replace(/\[\d+\](\[\d+\])*/g, '').trim();
};

// Fetch route from OSRM (free routing service)
const fetchOSRMRoute = async (coordinates: [number, number][]): Promise<[number, number][] | null> => {
  if (coordinates.length < 2) return null;
  
  // OSRM expects lon,lat format
  const coordString = coordinates.map(c => `${c[1]},${c[0]}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coordString}?overview=full&geometries=geojson`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.code === 'Ok' && data.routes?.[0]?.geometry?.coordinates) {
      // Convert from [lon, lat] to [lat, lon] for Leaflet
      return data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
    }
    return null;
  } catch (error) {
    console.error('OSRM routing error:', error);
    return null;
  }
};

interface CrowdScores {
  "08:00": number;
  "12:00": number;
  "16:00": number;
  "20:00": number;
}

interface DiningSpot {
  name: string;
  type: string;
  coordinates: { lat: number; lon: number };
}

interface Activity {
  name: string;
  type: string;
  description: string;
  cost_tier: string;
  is_free: boolean;
  coordinates: { lat: number; lon: number };
  estimated_crowd_scores: CrowdScores;
  nearby_context?: {
    dining_spots: DiningSpot[];
  };
}

interface DayItinerary {
  day_number: number;
  date: string;
  activities: Activity[];
}

interface TripOverview {
  transport_mode?: string;
  total_estimated_distance_km?: number;
  currency?: string;
}

interface LocalLogistics {
  tap_water_drinkable?: boolean;
  security_advisory?: string;
}

// Legacy interfaces for backward compatibility
interface LegacyDestination {
  name: string;
  description: string;
  coordinates: { lat: number; lng: number };
  crowd_scores: CrowdScores;
}

interface LegacyCityInfo {
  water_drinkable: boolean;
  safety_advisory: string;
  currency: string;
}

interface BudgetAnalysis {
  user_total_budget: number;
  estimated_logistics_cost: number;
  is_feasible: boolean;
  warning_message: string;
}

interface LogisticsSummary {
  transport_mode: string;
  total_transport_cost_estimate: number;
  currency: string;
}

interface FlightDetails {
  one_way_avg_price: number;
  round_trip_avg_price: number;
  suggested_airlines: string[];
}

interface SuggestedHotel {
  name: string;
  cost_per_night: number;
  rating: string;
  coordinates: { lat: number; lon: number };
}

interface AccommodationDay {
  day_number: number;
  date: string;
  suggested_hotels: SuggestedHotel[];
  daily_gas_estimate: number | null;
}

interface TripData {
  // New format
  trip_overview?: TripOverview;
  local_logistics?: LocalLogistics;
  daily_itinerary?: DayItinerary[];
  // Budget data
  budget_analysis?: BudgetAnalysis;
  logistics_summary?: LogisticsSummary;
  flight_details?: FlightDetails | null;
  accommodation_plan?: AccommodationDay[];
  dining_manifest?: DiningSpot[];
  // Legacy format
  city_info?: LegacyCityInfo;
  must_see_destinations?: LegacyDestination[];
  hidden_gems?: (LegacyDestination & { type: string })[];
}

interface FormData {
  origin?: string;
  destination?: string;
  dateFrom?: Date | null;
  dateTo?: Date | null;
  travelers?: { adults: number; kids: number };
  budget?: string;
  transport?: string | string[];
  crowdPreference?: string;
}

interface TripMapViewProps {
  data: TripData;
  onNewTrip: () => void;
  destinationCity: string;
  formData?: FormData;
  isSavedTrip?: boolean;
}

const TripMapView: React.FC<TripMapViewProps> = ({ data, onNewTrip, destinationCity, formData, isSavedTrip = false }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { savePendingTrip } = usePendingTrip();
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const diningMarkersRef = useRef<L.Marker[]>([]);

  const [currentDayIndex, setCurrentDayIndex] = useState<number | 'all'>(0);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Check if using new data format
  const isNewFormat = Boolean(data.daily_itinerary && data.daily_itinerary.length > 0);
  
  // Get currency
  const currency = isNewFormat 
    ? data.trip_overview?.currency || 'USD'
    : data.city_info?.currency || 'USD';

  // Get days data
  const days = data.daily_itinerary || [];
  const currentDay = currentDayIndex === 'all' ? null : days[currentDayIndex];
  const allActivities = days.flatMap((day, dayIdx) => 
    day.activities.map((activity, actIdx) => ({ ...activity, dayNumber: day.day_number, dayIndex: dayIdx, activityIndex: actIdx }))
  );
  

  // Get logistics info
  const waterInfo = isNewFormat 
    ? (data.local_logistics?.tap_water_drinkable ? "Tap water is safe to drink." : "Drink bottled water only.")
    : (data.city_info?.water_drinkable ? "Tap water is safe to drink." : "Drink bottled water only.");
  
  const securityInfo = isNewFormat
    ? cleanPerplexityRefs(data.local_logistics?.security_advisory || "Stay aware of your surroundings.")
    : cleanPerplexityRefs(data.city_info?.safety_advisory || "Stay aware of your surroundings.");

  const handleSaveTrip = async () => {
    if (!user) {
      savePendingTrip({
        tripData: data,
        formData: {
          ...formData,
          dateFrom: formData?.dateFrom?.toISOString() || undefined,
          dateTo: formData?.dateTo?.toISOString() || undefined,
        },
        destinationCity,
      });
      toast({
        title: "Login to Save",
        description: "Redirecting you to login. Your trip will be saved automatically.",
      });
      navigate("/login?redirect=save-trip");
      return;
    }

    setIsSaving(true);
    try {
      const tripName = `Trip to ${destinationCity}`;
      
      const { error } = await supabase
        .from("saved_trips")
        .insert([{
          user_id: user.id,
          name: tripName,
          origin: formData?.origin || null,
          destination: destinationCity,
          start_date: formData?.dateFrom ? formData.dateFrom.toISOString().split('T')[0] : null,
          end_date: formData?.dateTo ? formData.dateTo.toISOString().split('T')[0] : null,
          budget: formData?.budget || null,
          travelers_adults: formData?.travelers?.adults || 1,
          travelers_kids: formData?.travelers?.kids || 0,
          transport_modes: formData?.transport ? (Array.isArray(formData.transport) ? formData.transport : [formData.transport]) : [],
          crowd_preference: formData?.crowdPreference || null,
          trip_data: data as unknown as Record<string, unknown>,
        }] as any);

      if (error) throw error;

      setIsSaved(true);
      toast({
        title: "Trip Saved!",
        description: "You can view it anytime in your saved trips.",
      });
    } catch (error: any) {
      console.error("Error saving trip:", error);
      toast({
        title: "Save Failed",
        description: error.message || "Could not save the trip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Get center coordinates
  const getCenterCoords = useCallback((): [number, number] => {
    if (isNewFormat && days.length > 0 && days[0].activities.length > 0) {
      const firstAct = days[0].activities[0];
      return [firstAct.coordinates.lat, firstAct.coordinates.lon];
    }
    if (data.must_see_destinations?.length) {
      return [data.must_see_destinations[0].coordinates.lat, data.must_see_destinations[0].coordinates.lng];
    }
    return [48.8566, 2.3522]; // Default to Paris
  }, [data, days, isNewFormat]);

  // Get current activity based on view mode
  const currentActivity = currentDayIndex === 'all' 
    ? allActivities[currentActivityIndex] 
    : currentDay?.activities?.[currentActivityIndex];

  // Draw markers for current day or all days
  const drawDayMarkers = useCallback(() => {
    if (!mapRef.current || !routeLayerGroupRef.current) return;

    routeLayerGroupRef.current.clearLayers();
    diningMarkersRef.current = [];

    const activitiesToDraw = currentDayIndex === 'all' ? allActivities : currentDay?.activities || [];
    
    if (activitiesToDraw.length === 0) return;

    // Add markers for each activity
    activitiesToDraw.forEach((activity, index) => {
      const isActive = index === currentActivityIndex;
      const coords: [number, number] = [activity.coordinates.lat, activity.coordinates.lon];
      
      let bgClass = 'bg-accent';
      if (activity.type === 'Hidden Gem') bgClass = 'bg-purple-500';
      else if (activity.type === 'Landmark') bgClass = 'bg-primary';
      if (isActive) bgClass = 'bg-green-500';

      // For "all" view, show day number in marker
      const markerLabel = currentDayIndex === 'all' 
        ? `D${(activity as typeof allActivities[0]).dayNumber}` 
        : `${index + 1}`;

      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-pin ${bgClass}" style="width:${isActive ? 36 : 30}px;height:${isActive ? 36 : 30}px;border-radius:50%;border:3px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:${isActive ? 12 : 10}px;box-shadow:0 3px 8px rgba(0,0,0,0.3);transition:all 0.2s;">${markerLabel}</div>`,
        iconSize: [isActive ? 36 : 30, isActive ? 36 : 30],
        iconAnchor: [isActive ? 18 : 15, isActive ? 36 : 30],
        popupAnchor: [0, -32]
      });

      const marker = L.marker(coords, { icon })
        .bindPopup(`<div class="font-bold text-sm text-center text-gray-900">${cleanPerplexityRefs(activity.name)}</div><div class="text-xs text-center text-gray-600">${activity.type}</div>`)
        .addTo(routeLayerGroupRef.current!);

      if (isActive) {
        marker.openPopup();
      }
    });

    // Draw dining spots for current activity only
    if (currentActivity?.nearby_context?.dining_spots) {
      currentActivity.nearby_context.dining_spots.forEach((spot) => {
        const coords: [number, number] = [spot.coordinates.lat, spot.coordinates.lon];
        
        const diningIcon = L.divIcon({
          className: 'dining-marker',
          html: `<div style="width:24px;height:24px;border-radius:50%;background:#f97316;border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,0.2);">🍽️</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 24],
          popupAnchor: [0, -24]
        });

        const marker = L.marker(coords, { icon: diningIcon })
          .bindPopup(`<div class="font-bold text-sm text-gray-900">${spot.name}</div><div class="text-xs text-gray-600">${spot.type}</div>`)
          .addTo(routeLayerGroupRef.current!);
        
        diningMarkersRef.current.push(marker);
      });
    }

    // Draw routes using OSRM for road-based routing
    const drawRoutes = async () => {
      if (!routeLayerGroupRef.current) return;
      
      let coordsToRoute: [number, number][] = [];
      
      if (currentDayIndex === 'all') {
        coordsToRoute = allActivities.map(a => [a.coordinates.lat, a.coordinates.lon] as [number, number]);
      } else if (currentDay && currentDay.activities.length > 1) {
        coordsToRoute = currentDay.activities.map(a => [a.coordinates.lat, a.coordinates.lon] as [number, number]);
      }
      
      if (coordsToRoute.length > 1) {
        const routeCoords = await fetchOSRMRoute(coordsToRoute);
        
        if (routeCoords && routeLayerGroupRef.current) {
          L.polyline(routeCoords, {
            color: '#4f46e5',
            weight: 4,
            opacity: 0.8
          }).addTo(routeLayerGroupRef.current);
        } else if (routeLayerGroupRef.current) {
          // Fallback to straight lines if OSRM fails
          L.polyline(coordsToRoute, {
            color: '#4f46e5',
            weight: 3,
            opacity: 0.6,
            dashArray: '8, 8'
          }).addTo(routeLayerGroupRef.current);
        }
      }
    };
    
    drawRoutes();

    // Fit bounds to show all activities
    const bounds = L.latLngBounds(
      activitiesToDraw.map(a => [a.coordinates.lat, a.coordinates.lon] as [number, number])
    );
    mapRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: currentDayIndex === 'all' ? 12 : 15 });
  }, [currentDayIndex, currentDay, currentActivityIndex, currentActivity, allActivities, days]);

  // Focus on current activity
  const focusOnActivity = useCallback(() => {
    if (!mapRef.current || !currentActivity) return;
    
    const coords: [number, number] = [currentActivity.coordinates.lat, currentActivity.coordinates.lon];
    mapRef.current.flyTo(coords, 16, { animate: true, duration: 0.8 });
  }, [currentActivity]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const center = getCenterCoords();
    mapRef.current = L.map(mapContainer.current, { zoomControl: false }).setView(center, 13);
    L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(mapRef.current);

    routeLayerGroupRef.current = L.layerGroup().addTo(mapRef.current);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [getCenterCoords]);

  // Update markers when day or activity changes
  useEffect(() => {
    if (isNewFormat) {
      drawDayMarkers();
    }
  }, [currentDayIndex, currentActivityIndex, drawDayMarkers, isNewFormat]);

  // Navigation handlers
  const handleNextActivity = () => {
    if (currentDayIndex === 'all') {
      if (currentActivityIndex < allActivities.length - 1) {
        setCurrentActivityIndex(prev => prev + 1);
      }
      return;
    }
    if (!currentDay) return;
    if (currentActivityIndex < currentDay.activities.length - 1) {
      setCurrentActivityIndex(prev => prev + 1);
    } else if (currentDayIndex < days.length - 1) {
      setCurrentDayIndex(prev => (prev as number) + 1);
      setCurrentActivityIndex(0);
    }
  };

  const handlePrevActivity = () => {
    if (currentDayIndex === 'all') {
      if (currentActivityIndex > 0) {
        setCurrentActivityIndex(prev => prev - 1);
      }
      return;
    }
    if (currentActivityIndex > 0) {
      setCurrentActivityIndex(prev => prev - 1);
    } else if (typeof currentDayIndex === 'number' && currentDayIndex > 0) {
      setCurrentDayIndex(prev => (prev as number) - 1);
      const prevDay = days[currentDayIndex - 1];
      setCurrentActivityIndex(prevDay.activities.length - 1);
    }
  };

  const handleDayChange = (dayIndex: number | 'all') => {
    setCurrentDayIndex(dayIndex);
    setCurrentActivityIndex(0);
  };

  // Get crowd level label
  const getCrowdLevel = (scores: CrowdScores) => {
    const avg = (scores["08:00"] + scores["12:00"] + scores["16:00"] + scores["20:00"]) / 4;
    if (avg < 40) return { label: 'Low', color: 'text-green-600 bg-green-50 border-green-200' };
    if (avg < 70) return { label: 'Moderate', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { label: 'High', color: 'text-red-600 bg-red-50 border-red-200' };
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const isFirstStep = currentDayIndex === 0 && currentActivityIndex === 0;
  const isLastStep = currentDayIndex === days.length - 1 && currentActivityIndex === (currentDay?.activities.length || 1) - 1;

  return (
    <div className="relative w-full h-[calc(100vh-64px)]">
      {/* Map */}
      <div ref={mapContainer} className="absolute inset-0 z-0" />

      {/* Minimized Trigger */}
      {!sidebarVisible && (
        <button
          onClick={() => setSidebarVisible(true)}
          className="absolute top-4 left-4 z-50 bg-background text-foreground p-3 rounded-full shadow-lg hover:bg-muted transition-all border border-border"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar */}
      {sidebarVisible && (
        <div className="absolute top-4 left-4 w-[340px] max-h-[85vh] bg-background rounded-xl shadow-2xl flex flex-col z-50 border border-border overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border shrink-0">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h1 className="text-xl font-bold text-foreground">Trip Planner</h1>
                <p className="text-xs text-muted-foreground">📍 {destinationCity}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full">AI Beta</span>
                <button onClick={() => setSidebarVisible(false)} className="text-muted-foreground hover:text-destructive p-1 rounded-full hover:bg-muted">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Day Tabs */}
            {days.length > 0 && (
              <div className="flex gap-1 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                {/* All Days Button */}
                <button
                  onClick={() => handleDayChange('all')}
                  className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    currentDayIndex === 'all'
                      ? 'bg-primary text-primary-foreground shadow'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  All
                </button>
                {/* Individual Day Buttons */}
                {days.map((day, idx) => (
                  <button
                    key={day.day_number}
                    onClick={() => handleDayChange(idx)}
                    className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
                      idx === currentDayIndex
                        ? 'bg-primary text-primary-foreground shadow'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    Day {day.day_number}
                  </button>
                ))}
              </div>
            )}

            {/* Current Day Info */}
            {currentDayIndex === 'all' ? (
              <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground bg-muted px-3 py-2 rounded-lg">
                <Calendar className="w-3.5 h-3.5" />
                <span>Full Itinerary</span>
                <span className="text-border mx-1">|</span>
                <span>{allActivities.length} activities</span>
                <span className="text-border mx-1">|</span>
                <span>{days.length} days</span>
              </div>
            ) : currentDay && (
              <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground bg-muted px-3 py-2 rounded-lg">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(currentDay.date)}</span>
                <span className="text-border mx-1">|</span>
                <span>{currentDay.activities.length} activities</span>
                <span className="text-border mx-1">|</span>
                <span>{currency}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 mt-3">
              <Button variant="outline" onClick={onNewTrip} className="flex-1 h-9 text-sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                New Trip
              </Button>
              {!isSavedTrip && (
                <Button 
                  onClick={handleSaveTrip} 
                  disabled={isSaving || isSaved}
                  variant={isSaved ? "outline" : "default"}
                  className="flex-1 h-9 text-sm"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : isSaved ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Activity Content */}
          {currentActivity ? (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-4 py-3">
                {/* Progress */}
                <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">
                  <span>
                    {currentDayIndex === 'all' ? (
                      <>Activity <span className="text-primary">{currentActivityIndex + 1}</span> / {allActivities.length} (Day {(currentActivity as typeof allActivities[0]).dayNumber})</>
                    ) : (
                      <>Activity <span className="text-primary">{currentActivityIndex + 1}</span> / {currentDay?.activities.length}</>
                    )}
                  </span>
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getCrowdLevel(currentActivity.estimated_crowd_scores).color}`}>
                    Crowd: {getCrowdLevel(currentActivity.estimated_crowd_scores).label}
                  </span>
                </div>

                {/* Activity Card */}
                <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
                  <div className={`p-4 border-b border-border ${currentActivity.type === 'Hidden Gem' ? 'bg-purple-50 dark:bg-purple-950/30' : ''}`}>
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground text-lg leading-tight">
                          {cleanPerplexityRefs(currentActivity.name)}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            currentActivity.type === 'Hidden Gem' 
                              ? 'bg-purple-100 text-purple-700 border-purple-200' 
                              : 'bg-blue-100 text-blue-700 border-blue-200'
                          }`}>
                            {currentActivity.type === 'Hidden Gem' ? '💎' : '🏛️'} {currentActivity.type}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            currentActivity.is_free 
                              ? 'bg-green-100 text-green-700 border-green-200' 
                              : 'bg-gray-100 text-gray-700 border-gray-200'
                          }`}>
                            {currentActivity.is_free ? '🆓 Free' : currentActivity.cost_tier}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {cleanPerplexityRefs(currentActivity.description)}
                    </p>

                    {/* Nearby Dining */}
                    {currentActivity.nearby_context?.dining_spots && currentActivity.nearby_context.dining_spots.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-dashed border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <Utensils className="w-3.5 h-3.5 text-orange-500" />
                          <span className="text-[10px] font-bold uppercase text-muted-foreground">Nearby Dining</span>
                        </div>
                        <div className="space-y-1.5">
                          {currentActivity.nearby_context.dining_spots.map((spot, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                              <span className="text-xs font-medium text-foreground">{spot.name}</span>
                              <span className="text-[10px] text-muted-foreground">{spot.type}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Day 1 shows safety info */}
                {currentDayIndex === 0 && currentActivityIndex === 0 && (
                  <div className="mt-3 space-y-2">
                    <div className="flex items-start gap-2 text-xs p-2.5 rounded-lg bg-blue-50 text-blue-900">
                      <span>💧</span>
                      <span>{waterInfo}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs p-2.5 rounded-lg bg-amber-50 text-amber-900">
                      <span>⚠️</span>
                      <span>{securityInfo}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Footer */}
              <div className="p-4 border-t border-border shrink-0">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={handlePrevActivity}
                    disabled={isFirstStep}
                    className="flex-1 h-9 text-xs"
                  >
                    <ChevronLeft className="w-3 h-3 mr-1" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNextActivity}
                    disabled={isLastStep}
                    className={`flex-[2] h-9 text-xs ${isLastStep ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  >
                    {isLastStep ? 'Trip Complete!' : 'Next'}
                    {!isLastStep && <ChevronRight className="w-3 h-3 ml-1" />}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No itinerary data available</p>
              <p className="text-xs">Generate a trip to see your daily plan</p>
            </div>
          )}
        </div>
      )}

      {/* Expense Panel */}
      <ExpensePanel 
        currency={currency} 
        dailyItinerary={data.daily_itinerary}
        currentDayIndex={currentDayIndex}
        budgetAnalysis={data.budget_analysis}
        logisticsSummary={data.logistics_summary}
        flightDetails={data.flight_details}
        accommodationPlan={data.accommodation_plan}
        diningManifest={data.dining_manifest}
      />
    </div>
  );
};

export default TripMapView;
