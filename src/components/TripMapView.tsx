import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ArrowLeft, ChevronRight, MapPin, X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Clean perplexity references like [1], [2], [1][4] from text
const cleanPerplexityRefs = (text: string): string => {
  return text.replace(/\[\d+\](\[\d+\])*/g, '').trim();
};

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

interface TripMapViewProps {
  data: TripData;
  onNewTrip: () => void;
  destinationCity: string;
}

interface ProcessedLocation {
  id: string;
  name: string;
  coords: [number, number];
  dropoff: [number, number];
  durationMin: number;
  type: 'landmark' | 'gem';
  description: string;
  crowd: { "09": number; "12": number; "16": number; "20": number };
  gemType?: string;
}

interface ItineraryItem {
  type: 'start' | 'visit';
  name: string;
  time?: string;
  arrive?: string;
  depart?: string;
  coords: [number, number];
  dropoff?: [number, number];
  crowdScore: number;
  travelMin?: number;
  dist?: number;
  data: ProcessedLocation | { name: string; city: string; safetyWarning: string; waterInfo: string; coords: [number, number] };
  transit?: { type: string; price?: string } | null;
  transportMode?: string;
  stopPoint?: [number, number] | null;
}

interface RouteLayer {
  legIndex: number;
  layer: L.LayerGroup | L.Polyline;
  isVehicle: boolean;
}

const TripMapView: React.FC<TripMapViewProps> = ({ data, onNewTrip, destinationCity }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const routeLayersRef = useRef<RouteLayer[]>([]);

  const [currentMode, setCurrentMode] = useState<'walking' | 'driving' | 'smart'>('smart');
  const [currentItinerary, setCurrentItinerary] = useState<ItineraryItem[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [showSteps, setShowSteps] = useState(false);

  // Process API data into app format
  const processApiData = useCallback(() => {
    const locations: ProcessedLocation[] = [];
    
    const formatCrowd = (scores: CrowdScores) => ({
      "09": scores["08:00"] || 20,
      "12": scores["12:00"] || 50,
      "16": scores["16:00"] || 50,
      "20": scores["20:00"] || 50
    });

    const getDropoff = (coords: { lat: number; lng: number }): [number, number] => {
      return [coords.lat + 0.0005, coords.lng + 0.0005];
    };

    data.must_see_destinations?.forEach((item, idx) => {
      locations.push({
        id: `landmark_${idx}`,
        name: cleanPerplexityRefs(item.name),
        coords: [item.coordinates.lat, item.coordinates.lng],
        dropoff: getDropoff(item.coordinates),
        durationMin: 90,
        type: 'landmark',
        description: cleanPerplexityRefs(item.description),
        crowd: formatCrowd(item.crowd_scores)
      });
    });

    data.hidden_gems?.forEach((item, idx) => {
      locations.push({
        id: `gem_${idx}`,
        name: cleanPerplexityRefs(item.name),
        coords: [item.coordinates.lat, item.coordinates.lng],
        dropoff: getDropoff(item.coordinates),
        durationMin: 45,
        type: 'gem',
        description: cleanPerplexityRefs(item.description),
        crowd: formatCrowd(item.crowd_scores),
        gemType: cleanPerplexityRefs(item.type)
      });
    });

    // Use first destination as center, or default
    const centerCoords: [number, number] = locations.length > 0 
      ? locations[0].coords 
      : [48.8566, 2.3522];

    const hotel = {
      name: "Start Location",
      coords: centerCoords,
      city: destinationCity,
      safetyWarning: cleanPerplexityRefs(data.city_info?.safety_advisory || "Stay aware of your surroundings."),
      waterInfo: data.city_info?.water_drinkable ? "Tap water is safe to drink." : "Drink bottled water only."
    };

    return { locations, hotel };
  }, [data, destinationCity]);

  // Distance calculation
  const getDistanceKm = (coord1: [number, number], coord2: [number, number]) => {
    const R = 6371;
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLon = (coord2[1] - coord1[1]) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  // Time calculation
  const addMinutes = (timeStr: string, minutes: number) => {
    const [h, m] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m + minutes, 0, 0);
    return date.toTimeString().slice(0, 5);
  };

  // Solve itinerary
  const solveItinerary = useCallback((startCoords: [number, number], startTimeStr: string, locations: ProcessedLocation[], mode: string, hotel: any) => {
    let currentTime = startTimeStr;
    let currentCoords = startCoords;
    let unvisited = [...locations];
    const itinerary: ItineraryItem[] = [];
    let totalDirectDistance = 0;

    itinerary.push({ 
      type: 'start', 
      name: hotel.name, 
      time: currentTime, 
      coords: startCoords, 
      crowdScore: 0, 
      data: hotel 
    });

    while (unvisited.length > 0) {
      let bestPlace: ProcessedLocation | null = null;
      let lowestPenalty = Infinity;
      let bestTravelTime = 0;
      let bestArrivalTime = "";
      const landmarksLeft = unvisited.some(loc => loc.type === 'landmark');

      for (const place of unvisited) {
        if (landmarksLeft && place.type === 'gem') continue;

        const dist = getDistanceKm(currentCoords, place.coords);
        let useVehicle = mode === 'smart' ? dist > 2.0 : mode === 'driving';
        const speed = useVehicle ? 25 : 4.5;
        const travelMin = Math.round((dist / speed) * 60) + (mode === 'smart' && useVehicle ? 10 : 0);
        const arrivalTime = addMinutes(currentTime, travelMin);
        const penalty = dist + ((place.crowd["09"] || 50) * 2.5);

        if (penalty < lowestPenalty) {
          lowestPenalty = penalty;
          bestPlace = place;
          bestTravelTime = travelMin;
          bestArrivalTime = arrivalTime;
        }
      }

      if (!bestPlace) break;

      const visitTime = addMinutes(bestArrivalTime, bestPlace.durationMin);
      const distLeg = getDistanceKm(currentCoords, bestPlace.coords);

      let transportMode = 'foot';
      let transitInfo: { type: string; price?: string } | null = null;

      if (mode === 'driving') {
        transportMode = 'driving';
        transitInfo = { type: 'car' };
      } else if (mode === 'smart' && distLeg > 2.0) {
        transportMode = 'driving';
        transitInfo = { type: 'bus', price: "2.10" };
      }

      itinerary.push({
        type: 'visit',
        name: bestPlace.name,
        arrive: bestArrivalTime,
        depart: visitTime,
        coords: bestPlace.coords,
        dropoff: bestPlace.dropoff,
        crowdScore: bestPlace.crowd["09"] || 50,
        travelMin: bestTravelTime,
        dist: distLeg,
        data: bestPlace,
        transit: transitInfo,
        transportMode,
        stopPoint: transportMode === 'driving' ? bestPlace.dropoff : null
      });

      totalDirectDistance += distLeg;
      currentTime = visitTime;
      currentCoords = bestPlace.coords;
      unvisited = unvisited.filter(p => p.id !== bestPlace!.id);
    }

    return { itinerary, totalDirectDistance };
  }, []);

  // Draw routes on map
  const drawRouteOnMap = useCallback(async (itinerary: ItineraryItem[]) => {
    if (!mapRef.current || !routeLayerGroupRef.current) return;

    routeLayerGroupRef.current.clearLayers();
    markersRef.current = [];
    routeLayersRef.current = [];

    const legPromises = [];

    for (let i = 0; i < itinerary.length - 1; i++) {
      const start = itinerary[i];
      const end = itinerary[i + 1];
      const profile = end.transportMode === 'driving' ? 'driving' : 'foot';
      const dropoff = profile === 'driving' && end.dropoff ? end.dropoff : end.coords;

      const url = `https://router.project-osrm.org/route/v1/${profile}/${start.coords[1]},${start.coords[0]};${dropoff[1]},${dropoff[0]}?overview=full&geometries=geojson&steps=true`;

      legPromises.push(
        fetch(url)
          .then(res => res.json())
          .then(data => ({
            data,
            mode: profile,
            index: i,
            hasDropoff: profile === 'driving' && end.dropoff && (end.dropoff[0] !== end.coords[0] || end.dropoff[1] !== end.coords[1]),
            dropoff,
            finalDest: end.coords
          }))
          .catch(() => ({ error: true, index: i }))
      );
    }

    const results = await Promise.all(legPromises);

    results.forEach((res: any) => {
      if (res.error || !res.data?.routes?.length) return;

      const route = res.data.routes[0];
      const isVehicle = res.mode === 'driving';
      const color = isVehicle ? '#F59E0B' : '#3F72AF';

      const mainLayer = L.geoJSON(route.geometry, {
        style: { color, weight: 5, opacity: 0.8, lineCap: 'round', lineJoin: 'round' }
      }).addTo(routeLayerGroupRef.current!);

      routeLayersRef.current.push({ legIndex: res.index, layer: mainLayer, isVehicle });

      // Always draw dotted line from route end to actual destination marker
      // Get the last coordinate of the route geometry
      const routeCoords = route.geometry.coordinates;
      const lastRoutePoint = routeCoords[routeCoords.length - 1]; // [lng, lat]
      const destCoords = res.finalDest; // [lat, lng]
      
      // Check if there's a gap between route end and destination
      const routeEndLatLng: [number, number] = [lastRoutePoint[1], lastRoutePoint[0]];
      const destLatLng: [number, number] = [destCoords[0], destCoords[1]];
      
      // Calculate distance in meters between route end and destination
      const gapDistance = L.latLng(routeEndLatLng).distanceTo(L.latLng(destLatLng));
      
      // If there's any gap (more than 5 meters), draw dotted connector
      if (gapDistance > 5) {
        const walkConnector = L.polyline([routeEndLatLng, destLatLng], {
          color: '#EF4444', weight: 3, opacity: 0.8, dashArray: '6, 8'
        }).addTo(routeLayerGroupRef.current!);
        
        routeLayersRef.current.push({ legIndex: res.index, layer: walkConnector, isVehicle: false });
      }
    });

    // Add markers
    itinerary.forEach((item, index) => {
      let bgClass = 'bg-accent';
      let label: string | number = index;
      
      if (item.type === 'start') {
        bgClass = 'bg-primary';
        label = 'S';
      } else if ((item.data as ProcessedLocation).type === 'gem') {
        bgClass = 'bg-purple-500';
      } else if (item.crowdScore > 50) {
        bgClass = 'bg-red-500';
      }

      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-pin ${bgClass}" style="width:30px;height:30px;border-radius:50%;border:2px solid #fff;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:13px;box-shadow:0 3px 8px rgba(0,0,0,0.2);">${label}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -32]
      });

      const marker = L.marker(item.coords, { icon })
        .bindPopup(`<div class="font-bold text-sm text-center">${item.name}</div><div class="text-xs text-center text-gray-500">${item.arrive || item.time}</div>`)
        .addTo(routeLayerGroupRef.current!);
      
      markersRef.current.push(marker);
    });

    // Fit bounds with generous padding to ensure all routes are visible
    if (itinerary.length > 0 && mapRef.current) {
      const bounds = L.latLngBounds(itinerary.map(item => item.coords));
      // Add all route geometries to bounds
      routeLayersRef.current.forEach(rl => {
        if ('getBounds' in rl.layer && rl.layer.getBounds) {
          try {
            bounds.extend((rl.layer as any).getBounds());
          } catch (e) {
            // Polylines may not have getBounds
          }
        }
      });
      mapRef.current.fitBounds(bounds, { padding: [100, 100], maxZoom: 14 });
    }
  }, []);

  // Run optimization
  const runSimulation = useCallback(async () => {
    setIsOptimizing(true);

    await new Promise(r => setTimeout(r, 500));

    const { locations, hotel } = processApiData();
    const result = solveItinerary(hotel.coords, "09:00", locations, currentMode, hotel);
    
    setCurrentItinerary(result.itinerary);
    setCurrentStepIndex(0);
    setShowSteps(true);

    await drawRouteOnMap(result.itinerary);
    setIsOptimizing(false);
  }, [currentMode, processApiData, solveItinerary, drawRouteOnMap]);

  // Update step view
  const updateStepHighlight = useCallback(() => {
    if (!mapRef.current) return;

    // Dim all routes
    routeLayersRef.current.forEach(rl => {
      if ('eachLayer' in rl.layer) {
        (rl.layer as L.LayerGroup).eachLayer((layer: any) => {
          layer.setStyle?.({ opacity: 0.2, color: '#94A3B8' });
        });
      } else {
        (rl.layer as L.Polyline).setStyle({ opacity: 0.2, color: '#94A3B8' });
      }
    });

    // Highlight active leg
    const activeLegIndex = currentStepIndex > 0 ? currentStepIndex - 1 : 0;
    routeLayersRef.current
      .filter(rl => rl.legIndex === activeLegIndex)
      .forEach(rl => {
        const color = rl.isVehicle ? '#F59E0B' : '#3F72AF';
        if ('eachLayer' in rl.layer) {
          (rl.layer as L.LayerGroup).eachLayer((layer: any) => {
            layer.setStyle?.({ opacity: 1, color, weight: 6 });
          });
        } else {
          (rl.layer as L.Polyline).setStyle({ opacity: 1, color, weight: 6 });
        }
      });

    // Fly to current location
    const item = currentItinerary[currentStepIndex];
    if (item) {
      mapRef.current.flyTo(item.coords, 16, { animate: true, duration: 1 });
      markersRef.current[currentStepIndex]?.openPopup();
    }
  }, [currentStepIndex, currentItinerary]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const { hotel } = processApiData();

    mapRef.current = L.map(mapContainer.current, { zoomControl: false }).setView(hotel.coords, 13);
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
  }, [processApiData]);

  // Update highlight when step changes
  useEffect(() => {
    if (showSteps && currentItinerary.length > 0) {
      updateStepHighlight();
    }
  }, [currentStepIndex, showSteps, updateStepHighlight, currentItinerary]);

  const currentItem = currentItinerary[currentStepIndex];

  return (
    <div className="relative w-full h-[calc(100vh-64px)]">
      {/* Map - takes full page */}
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
        <div className="absolute top-4 left-4 w-[320px] max-h-[85vh] bg-background rounded-xl shadow-2xl flex flex-col z-50 border border-border overflow-hidden">
          {/* Loading Overlay */}
          {isOptimizing && (
            <div className="absolute inset-0 bg-background/90 z-50 flex flex-col items-center justify-center backdrop-blur-sm rounded-xl">
              <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin mb-3" />
              <p className="text-sm font-bold text-primary animate-pulse">Optimizing Route...</p>
            </div>
          )}

          {/* Header */}
          <div className="p-4 border-b border-border shrink-0">
            <div className="flex justify-between items-start mb-4">
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

            {/* Mode Toggle */}
            <div className="flex bg-muted p-1 rounded-lg mb-3">
              {(['walking', 'driving', 'smart'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setCurrentMode(mode)}
                  className={`flex-1 text-[10px] font-bold py-1.5 rounded-md transition-all capitalize ${
                    currentMode === mode ? 'bg-background shadow text-primary' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mb-3">
              <Button onClick={runSimulation} className="flex-1 h-9 text-sm">
                Optimize Route
                <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
              <Button variant="outline" onClick={onNewTrip} className="h-9 px-3 text-sm">
                <ArrowLeft className="w-4 h-4 mr-1" />
                New
              </Button>
            </div>

            {/* Start info */}
            <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground bg-muted px-3 py-2 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>Start: 09:00 AM</span>
              <span className="text-border mx-1">|</span>
              <span>{data.city_info?.currency || 'USD'}</span>
            </div>
          </div>

          {/* Steps Container */}
          {showSteps && currentItem && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-4 py-3">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">
                  <span>Stop <span className="text-primary">{currentStepIndex}</span> / <span>{currentItinerary.length - 1}</span></span>
                  <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded">{currentItem.arrive || currentItem.time}</span>
                </div>

                <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
                  {currentItem.type === 'start' ? (
                    <div className="p-4">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shrink-0">S</div>
                        <div>
                          <h3 className="font-bold text-foreground">{currentItem.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">Depart: <span className="font-mono text-primary">{currentItem.time}</span></p>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-dashed border-border space-y-2">
                        <div className="flex items-start gap-2 text-xs text-foreground bg-blue-50 dark:bg-blue-950 p-2.5 rounded-lg">
                          <span>💧</span>
                          <span>{(currentItem.data as any).waterInfo}</span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-foreground bg-amber-50 dark:bg-amber-950 p-2.5 rounded-lg">
                          <span>⚠️</span>
                          <span>{(currentItem.data as any).safetyWarning}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className={`p-4 border-b border-border ${(currentItem.data as ProcessedLocation).type === 'gem' ? 'bg-purple-50 dark:bg-purple-950/30' : ''}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-foreground text-lg leading-tight">{currentItem.name}</h3>
                            <div className="flex items-center gap-2 mt-2">
                              {(currentItem.data as ProcessedLocation).type === 'gem' && (
                                <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded text-[10px] font-bold border border-purple-200 dark:border-purple-800">
                                  💎 {(currentItem.data as ProcessedLocation).gemType || 'Gem'}
                                </span>
                              )}
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                currentItem.crowdScore > 50 
                                  ? 'text-orange-600 bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800' 
                                  : 'text-green-600 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
                              }`}>
                                Crowd: {currentItem.crowdScore}%
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="block text-xl font-bold text-primary">{currentItem.arrive}</span>
                            <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Arrival</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {(currentItem.data as ProcessedLocation).description}
                        </p>
                        <div className="flex items-center justify-between pt-3 mt-3 border-t border-dashed border-border">
                          {currentItem.transit?.type === 'bus' ? (
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-1 rounded border border-amber-100 dark:border-amber-800">
                                🚌 Bus ({currentItem.travelMin} min)
                              </span>
                              <span className="text-[10px] text-muted-foreground">€{currentItem.transit.price}</span>
                            </div>
                          ) : currentItem.transit?.type === 'car' ? (
                            <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                              🚗 Drive {currentItem.travelMin} min
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                              👣 Walk {currentItem.travelMin} min
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="p-4 border-t border-border shrink-0">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setCurrentStepIndex(i => Math.max(0, i - 1))}
                    disabled={currentStepIndex === 0}
                    className="flex-1 h-9 text-xs"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setCurrentStepIndex(i => Math.min(currentItinerary.length - 1, i + 1))}
                    className={`flex-[2] h-9 text-xs ${currentStepIndex === currentItinerary.length - 1 ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  >
                    {currentStepIndex === currentItinerary.length - 1 ? 'Finish Trip' : 'Next Stop'}
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TripMapView;
