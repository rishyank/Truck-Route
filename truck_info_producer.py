import json
import time
from confluent_kafka import Producer


def load_coordinates_from_geojson(file_path):
    """Load coordinates from a GeoJSON file."""
    with open(file_path, 'r') as f:
        geojson = json.load(f)
    return geojson['features'][0]['geometry']['coordinates']


def delivery_report(err, msg):
    """Callback for Kafka message delivery status."""
    if err is not None:
        print(f"Delivery failed: {err}")
    else:
        print(f"Delivered message to {msg.topic()} [{msg.partition()}]")


def create_kafka_producer(bootstrap_servers):
    """Create a Confluent Kafka producer."""
    return Producer({'bootstrap.servers': bootstrap_servers})


def send_coordinates(producer, topic, coordinates, interval_sec=1):
    """Send each coordinate to Kafka with a delay."""
    for lon, lat in coordinates:
        data = {'lon': lon, 'lat': lat}
        producer.produce(
            topic=topic,
            value=json.dumps(data).encode('utf-8'),
            callback=delivery_report
        )
        producer.poll(0)  # Trigger any callbacks
        time.sleep(interval_sec)
    producer.flush()  # Ensure all messages are delivered


def main():
    geojson_path = r"bislett_to_ekeberg.geojson"
    kafka_bootstrap_servers = 'localhost:9092'
    kafka_topic = 'truck-location'

    coordinates = load_coordinates_from_geojson(geojson_path)
    producer = create_kafka_producer(kafka_bootstrap_servers)
    send_coordinates(producer, kafka_topic, coordinates)


if __name__ == "__main__":
    main()
