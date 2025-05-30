package com.rc.sse.Controllers;


import com.fasterxml.jackson.databind.JsonNode;
import com.rc.sse.DTOs.TruckLocation;
import com.rc.sse.Services.KafkaSseBridge;
import com.rc.sse.Services.TruckService;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

import java.time.Duration;
import java.time.LocalTime;

@RestController
public class ServerEventsController {
    @Autowired
    KafkaSseBridge kafkaSseBridge;
    @Autowired
    TruckService truckService;

    @GetMapping(value = "api/sse-events",produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<TruckLocation> streamFlux(){
        return kafkaSseBridge.getMessages();
    }

    @GetMapping("api/truck/route/{truck_id}")
    public ResponseEntity<JsonNode> getTruckRoute(@PathVariable(required = true) String truck_id){
        return ResponseEntity.ok(truckService.getRoute(truck_id));
    }
}
