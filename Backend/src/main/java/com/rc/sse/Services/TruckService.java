package com.rc.sse.Services;


import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;

@Service
public class TruckService {
    private  final PathReaderService jsonNodeReaderService;
    public TruckService(PathReaderService jsonNodeReaderService) {
        this.jsonNodeReaderService = jsonNodeReaderService;
    }
    public JsonNode getRoute(String truckId) {
        return jsonNodeReaderService.getRoute(truckId);
    }
}
