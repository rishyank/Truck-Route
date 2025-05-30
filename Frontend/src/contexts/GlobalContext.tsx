import React, { createContext, useState, useEffect, useContext } from "react";

// Define RouteData type
interface RouteData {
  type: string;
  features: any[];
  metadata: {
    attribution: string;
    service: string;
    timestamp: number;
    query: {
      coordinates: number[][];
      profile: string;
      profileName: string;
      format: string;
    };
    engine: {
      version: string;
      build_date: string;
      graph_date: string;
    };
  };
}

// Allow routeData to be null initially
interface GlobalContextType {
  routeData: RouteData | null;
}

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Create the context
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Global provider
const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [routeData, setRouteData] = useState<RouteData | null>(null);

  useEffect(() => {
    const fetchRouteData = async (truck_id: string) => {
      try {
        const response = await fetch(`${baseUrl}/truck/route/${truck_id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch route data");
        }
        const data = await response.json();
        setRouteData(data);
      } catch (error) {
        console.error("Error fetching route data:", error);
      }
    };

    fetchRouteData("truck_0");
  }, []);

  return (
    <GlobalContext.Provider value={{ routeData }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use the context
const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

export { GlobalProvider, useGlobalContext };
