import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Truck } from "lucide-react";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { TOKEN } from "@/services/utils";
// MapBox token - In a real app this should be stored securely
const MAPBOX_TOKEN = TOKEN;
const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface TruckLocation {
  lat: number;
  lon: number;
}

const TruckMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const truckMarker = useRef<mapboxgl.Marker | null>(null);
  const { routeData } = useGlobalContext();
  const [truckLocation, setTruckLocation] = useState<TruckLocation | null>(
    null
  );

  const [mapboxToken, setMapboxToken] = useState<string>(MAPBOX_TOKEN);

  // Handle SSE events for real-time truck location
  useEffect(() => {
    const eventSource = new EventSource(`${baseUrl}/sse-events`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received SSE update:", data);
        if (data.lat && data.lon) {
          setTruckLocation({ lat: data.lat, lon: data.lon });
        }
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // Initialize map and add route
  useEffect(() => {
    if (!mapContainer.current || !routeData || !mapboxToken) return;

    if (!map.current) {
      mapboxgl.accessToken = mapboxToken;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [10.733, 59.9275], // Oslo coordinates
        zoom: 12,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    }

    new mapboxgl.Marker({ color: "green" })
      .setLngLat(routeData.features[0].geometry.coordinates[0])
      .setPopup(new mapboxgl.Popup().setText("Start Point"))
      .addTo(map.current);

    new mapboxgl.Marker({ color: "red" })
      .setLngLat(
        routeData.features[0].geometry.coordinates[
          routeData.features[0].geometry.coordinates.length - 1
        ]
      )
      .setPopup(new mapboxgl.Popup().setText("End Point"))
      .addTo(map.current);

    // Add route layer when map loads and route data is available
    map.current.on("load", () => {
      if (
        map.current &&
        routeData &&
        typeof routeData.type === "string" &&
        routeData.type === "FeatureCollection"
      ) {
        // Add the route source and layer
        if (!map.current.getSource("route")) {
          map.current.addSource("route", {
            type: "geojson",
            data: routeData as GeoJSON.FeatureCollection,
          });

          map.current.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#007AFF",
              "line-width": 5,
              "line-opacity": 0.75,
            },
          });

          // Fit map to the route
          const bounds = new mapboxgl.LngLatBounds();
          routeData.features[0].geometry.coordinates.forEach(
            (coord: number[]) => {
              bounds.extend([coord[0], coord[1]]);
            }
          );
          map.current.fitBounds(bounds, { padding: 100 });
        }
      }
    });

    return () => {
      // Cleanup
    };
  }, [routeData, mapboxToken]);

  // Update truck marker position
  useEffect(() => {
    if (!map.current || !truckLocation) return;

    // Wait for map to be loaded
    if (!map.current.loaded()) {
      map.current.on("load", () => updateTruckMarker());
      return;
    }

    updateTruckMarker();

    function updateTruckMarker() {
      if (!truckLocation) return;

      // Create a truck marker element

      const el = document.createElement("div");
      el.style.backgroundImage = 'url("/deliver_truck.svg")'; // Place truck-icon.svg in public folder
      el.style.width = "40px";
      el.style.height = "40px";
      el.style.backgroundSize = "contain";
      el.style.backgroundRepeat = "no-repeat";
      el.style.backgroundPosition = "center";

      // Remove previous marker if it exists
      if (truckMarker.current) {
        truckMarker.current.remove();
      }

      // Create new marker
      truckMarker.current = new mapboxgl.Marker(el)
        .setLngLat([truckLocation.lon, truckLocation.lat])
        .addTo(map.current!);

      // Fly to truck location
      map.current!.flyTo({
        center: [truckLocation.lon, truckLocation.lat],
        zoom: 14,
        speed: 0.4,
        essential: true,
      });
    }
  }, [truckLocation]);

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMapboxToken(e.target.value);
  };

  return (
    <div className="flex flex-col h-full">
      {!mapboxToken && (
        <div className="px-4 py-3 mb-4 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-800">
            Please enter your MapBox token to display the map.
          </p>
          <input
            type="text"
            className="w-full px-3 py-2 mt-2 border rounded-md"
            placeholder="Enter your MapBox token"
            value={mapboxToken}
            onChange={handleTokenChange}
          />
        </div>
      )}
      <div className="relative flex-1 min-h-[500px]">
        <div ref={mapContainer} className="absolute inset-0" />
      </div>
    </div>
  );
};

export default TruckMap;
