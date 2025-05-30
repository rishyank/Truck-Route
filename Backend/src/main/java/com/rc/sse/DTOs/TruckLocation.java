package com.rc.sse.DTOs;

public class TruckLocation {
    private double lat;
    private  double lon;

    public double getLon() { return lon; }
    public void setLon(double lon) { this.lon = lon; }

    public TruckLocation(){};
    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }

    @Override
    public String toString() {
        return "TruckLocation{lon=" + lon + ", lat=" + lat + "}";
    }
}
