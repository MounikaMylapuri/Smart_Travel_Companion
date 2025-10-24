import React, { createContext, useContext, useState, ReactNode } from "react";
import axios from "../services/api";

interface Trip {
  _id: string;
  title: string;
  description: string;
  destination: {
    country: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  startDate: string;
  endDate: string;
  budget: {
    total: number;
    currency: string;
    spent: number;
  };
  travelers: Array<{
    name: string;
    email: string;
    role: string;
  }>;
  status: "planning" | "upcoming" | "ongoing" | "completed" | "cancelled";
  tags: string[];
  photos: string[];
  documents: Array<{
    name: string;
    url: string;
    type: string;
    uploadedAt: string;
  }>;
  notes: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface TripContextType {
  trips: Trip[];
  currentTrip: Trip | null;
  loading: boolean;
  fetchTrips: () => Promise<void>;
  fetchTrip: (id: string) => Promise<void>;
  createTrip: (tripData: Partial<Trip>) => Promise<Trip>;
  updateTrip: (id: string, tripData: Partial<Trip>) => Promise<Trip>;
  deleteTrip: (id: string) => Promise<void>;
  setCurrentTrip: (trip: Trip | null) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
};

interface TripProviderProps {
  children: ReactNode;
}

export const TripProvider: React.FC<TripProviderProps> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/trips");
      setTrips(response.data.trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrip = async (id: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/trips/${id}`);
      setCurrentTrip(response.data);
    } catch (error) {
      console.error("Error fetching trip:", error);
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (tripData: Partial<Trip>): Promise<Trip> => {
    try {
      const response = await axios.post("/api/trips", tripData);
      const newTrip = response.data;
      setTrips((prev) => [newTrip, ...prev]);
      return newTrip;
    } catch (error) {
      console.error("Error creating trip:", error);
      throw error;
    }
  };

  const updateTrip = async (
    id: string,
    tripData: Partial<Trip>
  ): Promise<Trip> => {
    try {
      const response = await axios.put(`/api/trips/${id}`, tripData);
      const updatedTrip = response.data;
      setTrips((prev) =>
        prev.map((trip) => (trip._id === id ? updatedTrip : trip))
      );
      if (currentTrip?._id === id) {
        setCurrentTrip(updatedTrip);
      }
      return updatedTrip;
    } catch (error) {
      console.error("Error updating trip:", error);
      throw error;
    }
  };

  const deleteTrip = async (id: string) => {
    try {
      await axios.delete(`/api/trips/${id}`);
      setTrips((prev) => prev.filter((trip) => trip._id !== id));
      if (currentTrip?._id === id) {
        setCurrentTrip(null);
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
      throw error;
    }
  };

  const value: TripContextType = {
    trips,
    currentTrip,
    loading,
    fetchTrips,
    fetchTrip,
    createTrip,
    updateTrip,
    deleteTrip,
    setCurrentTrip,
  };

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
};
