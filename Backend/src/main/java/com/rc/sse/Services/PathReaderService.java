package com.rc.sse.Services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PathReaderService {
    private  final HashMap<String,JsonNode> truckRoutes = new HashMap<>();
    private final ObjectMapper objectMapper;
    @Autowired
    public PathReaderService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }
    @PostConstruct
    public void init() {

        List<String> paths = List.of(
                "geojsons/bislett_to_ekeberg.geojson"
        );
        int id = 0;
        for (String path : paths) {
            try {

                ClassPathResource resource = new ClassPathResource(path);
                try (InputStream inputStream = resource.getInputStream()) {
                    JsonNode jsonNode = objectMapper.readTree(inputStream);
                    String key = "truck_" + id;
                    truckRoutes.put(key, jsonNode);
                    id++;
                }
            } catch (IOException e) {
                System.out.println(e.getMessage());
            }
        }
    }

    public  JsonNode getRoute(String truckId) {

        return truckRoutes.get(truckId);
    }

    public Map<String, JsonNode> getAllRoutes() {
        return Collections.unmodifiableMap(truckRoutes);
    }
}
