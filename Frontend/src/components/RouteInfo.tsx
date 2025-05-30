import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Route } from "lucide-react";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { TOKEN, fetchLocationName } from "@/services/utils";
// Set your token
mapboxgl.accessToken = TOKEN;

const RouteInfo: React.FC = () => {
  const { routeData } = useGlobalContext();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [startName, setStartName] = useState<string | null>(null);
  const [endName, setEndName] = useState<string | null>(null);

  useEffect(() => {
    if (!routeData || !routeData.features?.length) return;
    if (!mapContainerRef.current || mapRef.current) return;

    const coordinates = routeData.features[0].geometry.coordinates;
    const startCoord = coordinates[0];
    const endCoord = coordinates[coordinates.length - 1];

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: startCoord,
      zoom: 12,
    });

    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl());

    const setupMap = async () => {
      const startName = await fetchLocationName(startCoord[0], startCoord[1]);
      const endName = await fetchLocationName(endCoord[0], endCoord[1]);

      setStartName(startName);
      setEndName(endName);

      new mapboxgl.Marker({ color: "green" })
        .setLngLat(startCoord)
        .setPopup(
          new mapboxgl.Popup().setHTML(`
          <strong>Start:</strong><br/>
          ${startName}
        `)
        )
        .addTo(map);

      new mapboxgl.Marker({ color: "red" })
        .setLngLat(endCoord)
        .setPopup(
          new mapboxgl.Popup().setHTML(`
          <strong>End:</strong><br/>
          ${endName}
        `)
        )
        .addTo(map);

      map.on("load", () => {
        map.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates,
            },
          },
        });

        map.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#007AFF",
            "line-width": 4,
          },
        });

        const bounds = coordinates.reduce(
          (b, coord) => b.extend(coord),
          new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
        );
        map.fitBounds(bounds, { padding: 40 });
      });
    };

    setupMap();

    return () => map.remove();
  }, [routeData]);

  // Early return UI while loading
  if (!routeData || !routeData.features?.length) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Route className="h-5 w-5 text-primary" />
            Route Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Loading or no route data available.
          </p>
        </CardContent>
      </Card>
    );
  }

  const coordinates = routeData.features[0].geometry.coordinates;
  const startCoord = coordinates[0];
  const endCoord = coordinates[coordinates.length - 1];

  const startLocation = "Start Point";
  const endLocation = "End Point";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-500";
      case "delayed":
        return "text-amber-500";
      case "completed":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  const status: "active" | "delayed" | "completed" = "active";
  const lastUpdate = new Date(
    routeData.metadata.timestamp
  ).toLocaleTimeString();

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Route className="h-5 w-5 text-primary" />
          Active Route Information
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-4">
          {/* Start */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
            </div>
            <div>
              <p className="font-medium text-sm">Origin</p>
              <p className="text-sm text-muted-foreground">
                {startName || startLocation}
              </p>
              <p className="text-xs text-muted-foreground">
                {startCoord[0].toFixed(4)}, {startCoord[1].toFixed(4)}
              </p>
            </div>
          </div>

          <div className="ml-4 pl-1 border-l-2 border-dashed border-muted h-6"></div>

          {/* End */}
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <div className="h-2 w-2 rounded-full bg-secondary"></div>
            </div>
            <div>
              <p className="font-medium text-sm">Destination</p>
              <p className="text-sm text-muted-foreground">
                {endName || endLocation}
              </p>
              <p className="text-xs text-muted-foreground">
                {endCoord[0].toFixed(4)}, {endCoord[1].toFixed(4)}
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Status:</span>
            <span
              className={`text-sm font-medium ${getStatusColor(
                status
              )} capitalize`}
            >
              {status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Last update:</span>
            <span className="text-sm">{lastUpdate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Vehicle:</span>
            <span className="text-sm">Truck #A-12345</span>
          </div>
        </div>

        {/* Map */}
        <div
          ref={mapContainerRef}
          className="mt-4 rounded overflow-hidden"
          style={{ height: "300px", width: "100%" }}
        />
      </CardContent>
    </Card>
  );
};

export default RouteInfo;
