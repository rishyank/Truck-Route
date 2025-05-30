import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TruckMap from "./TruckMap";
import RouteInfo from "./RouteInfo";
import { Navigation, MapPin, Route } from "lucide-react";

const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2 flex items-center gap-2">
          Truck Route Tracker
        </h1>
        <p className="text-muted-foreground">
          Real-time tracking and route visualization | Last updated:{" "}
          {currentTime}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Live Truck Position
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[600px]">
              <TruckMap />
            </CardContent>
          </Card>
        </div>

        <div>
          <RouteInfo lastUpdate={currentTime} status="active" />
        </div>
      </div>

      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>Your Trusted Delivery Partner © D2D</p>
      </footer>
    </div>
  );
};

export default Dashboard;
