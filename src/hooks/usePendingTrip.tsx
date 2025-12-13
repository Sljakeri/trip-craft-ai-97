import { useEffect, useCallback } from "react";

const PENDING_TRIP_KEY = "pendingTripData";

interface FormData {
  origin?: string;
  destination?: string;
  dateFrom?: string;
  dateTo?: string;
  travelers?: { adults: number; kids: number };
  budget?: string;
  transport?: string | string[];
  crowdPreference?: string;
}

interface PendingTripData {
  tripData: any;
  formData: FormData;
  destinationCity: string;
}

export const usePendingTrip = () => {
  const savePendingTrip = useCallback((data: PendingTripData) => {
    // Convert dates to strings for storage
    const storageData = {
      ...data,
      formData: {
        ...data.formData,
        dateFrom: data.formData.dateFrom ? String(data.formData.dateFrom) : null,
        dateTo: data.formData.dateTo ? String(data.formData.dateTo) : null,
      }
    };
    localStorage.setItem(PENDING_TRIP_KEY, JSON.stringify(storageData));
  }, []);

  const getPendingTrip = useCallback((): PendingTripData | null => {
    const stored = localStorage.getItem(PENDING_TRIP_KEY);
    if (!stored) return null;
    
    try {
      const data = JSON.parse(stored);
      // Convert date strings back to Date objects
      if (data.formData?.dateFrom) {
        data.formData.dateFrom = new Date(data.formData.dateFrom);
      }
      if (data.formData?.dateTo) {
        data.formData.dateTo = new Date(data.formData.dateTo);
      }
      return data;
    } catch {
      return null;
    }
  }, []);

  const clearPendingTrip = useCallback(() => {
    localStorage.removeItem(PENDING_TRIP_KEY);
  }, []);

  const hasPendingTrip = useCallback(() => {
    return localStorage.getItem(PENDING_TRIP_KEY) !== null;
  }, []);

  return { savePendingTrip, getPendingTrip, clearPendingTrip, hasPendingTrip };
};
