package com.rc.sse.Services;


import com.rc.sse.DTOs.TruckLocation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

@Component
public class KafkaSseBridge {

    // Create a multicast sink to handle many subscribers and messages
    private final Sinks.Many<TruckLocation> sink = Sinks.many().multicast().onBackpressureBuffer();

    // This method provides the stream to be consumed over SSE
    public Flux<TruckLocation> getMessages() {
        return sink.asFlux();
    }
    // This method is called from Kafka consumer to push new messages
    public void emitMessage(TruckLocation msg) {
        sink.tryEmitNext(msg); // emits to all active subscribers
    }
}