package com.rc.sse.Services;

import com.rc.sse.DTOs.TruckLocation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class TruckLocationConsumer {
    private final KafkaSseBridge bridge;
    @Autowired
    public TruckLocationConsumer(KafkaSseBridge bridge) {
        this.bridge = bridge;
    }

    @KafkaListener(topics = "truck-location", groupId = "truck-group", containerFactory = "truckKafkaListenerContainerFactory")
    public void consume(TruckLocation location) {
        bridge.emitMessage(location);
    }
}
