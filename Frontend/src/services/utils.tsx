export const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export const fetchLocationName = async (
  lng: number,
  lat: number
): Promise<string> => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${TOKEN}`
  );
  const data = await response.json();
  return data?.features?.[0]?.place_name || "Unknown Location";
};
