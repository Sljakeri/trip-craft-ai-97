import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Calendar, Trash2, Eye } from "lucide-react";

interface SavedTrip {
  id: string;
  name: string;
  origin: string | null;
  destination: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  trip_data: any;
}

const SavedTrips = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchTrips();
    }
  }, [user]);

  const fetchTrips = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("saved_trips")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching trips:", error);
      toast({
        title: "Error",
        description: "Failed to load your saved trips.",
        variant: "destructive",
      });
    } else {
      setTrips(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (tripId: string) => {
    setDeletingId(tripId);
    
    const { error } = await supabase
      .from("saved_trips")
      .delete()
      .eq("id", tripId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete the trip.",
        variant: "destructive",
      });
    } else {
      setTrips(trips.filter(t => t.id !== tripId));
      toast({
        title: "Trip Deleted",
        description: "The trip has been removed from your saved trips.",
      });
    }
    setDeletingId(null);
  };

  const handleViewTrip = (trip: SavedTrip) => {
    // Store trip data in sessionStorage for viewing
    sessionStorage.setItem("viewingTrip", JSON.stringify({
      tripData: trip.trip_data,
      destination: trip.destination,
      origin: trip.origin,
    }));
    navigate("/view-trip");
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <main className="flex justify-center items-center px-5 py-20 min-h-[calc(100vh-140px)]">
          <div className="text-slate-500">Loading...</div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex justify-center px-5 py-20">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-10">
            <div className="inline-block bg-indigo-50 text-indigo-600 text-sm font-semibold px-5 py-2 rounded-full mb-4">
              My Trips
            </div>
            <h1 className="text-4xl font-bold text-slate-800 mb-4 tracking-tight">
              Saved Itineraries
            </h1>
            <p className="text-slate-500 text-base">
              View and manage your saved travel plans
            </p>
          </div>

          {trips.length === 0 ? (
            <div className="bg-white p-14 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.08)] text-center">
              <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-700 mb-2">No trips saved yet</h2>
              <p className="text-slate-500 mb-6">Start planning your first adventure!</p>
              <Link 
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-indigo-500 text-white font-semibold rounded-full hover:bg-indigo-600 transition-colors"
              >
                Plan a Trip
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {trips.map((trip) => (
                <div 
                  key={trip.id} 
                  className="bg-white p-6 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">{trip.name}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {trip.origin && `${trip.origin} → `}{trip.destination}
                      </span>
                      {(trip.start_date || trip.end_date) && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(trip.start_date)}
                          {trip.end_date && ` - ${formatDate(trip.end_date)}`}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewTrip(trip)}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-full hover:bg-indigo-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(trip.id)}
                      disabled={deletingId === trip.id}
                      className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      {deletingId === trip.id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link 
              to="/profile"
              className="text-indigo-600 font-medium hover:underline"
            >
              ← Back to Profile
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default SavedTrips;
