import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import TripMapView from "@/components/TripMapView";

const ViewTrip = () => {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState<any>(null);
  const [destination, setDestination] = useState("");

  useEffect(() => {
    const storedTrip = sessionStorage.getItem("viewingTrip");
    if (storedTrip) {
      const parsed = JSON.parse(storedTrip);
      setTripData(parsed.tripData);
      setDestination(parsed.destination);
    } else {
      navigate("/saved-trips");
    }
  }, [navigate]);

  const handleNewTrip = () => {
    sessionStorage.removeItem("viewingTrip");
    navigate("/");
  };

  if (!tripData) {
    return (
      <Layout>
        <main className="flex justify-center items-center px-5 py-20 min-h-[calc(100vh-140px)]">
          <div className="text-slate-500">Loading trip...</div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout hideFooter>
      <TripMapView 
        data={tripData} 
        onNewTrip={handleNewTrip} 
        destinationCity={destination}
        isSavedTrip={true}
      />
    </Layout>
  );
};

export default ViewTrip;
