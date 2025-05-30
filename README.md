# 🚛 Real-Time Truck Route Tracker

This project provides a real-time truck route visualization using a **Spring Boot** backend and a **React + Mapbox** frontend. The backend consumes location updates from Kafka and exposes APIs to fetch pre-planned routes and stream live location updates. The frontend animates the truck's movement on a map.

[![Watch the video](https://github.com/rishyank/Truck-Route/blob/main/truc_info.JPG)](https://github.com/rishyank/Truck-Route/blob/main/truck_route.mp4)


---

## 🔧 Backend - Spring Boot + Kafka

### Features

- Get truck's planned route by `truck_id`. Only truck route is available `truck_0`.
- **bislett_to_ekeberg.geojson** contains the predefined truck route in GeoJson format. This file is placed in Static folder of spring boot application served and by the `/api/truck/route/{truck_id}`.
- Receive real-time truck location updates using Server-Sent Events (SSE)
- Kafka consumer integration for location updates

### API Documentation

Once running, Swagger UI is available at:  
[http://localhost:8085/api/swagger-ui.html](http://localhost:8085/api/swagger-ui.html)

#### 🔹 `GET /api/truck/route/{truck_id}`

Returns the planned route (as a list of coordinates) for a truck.

**Path Parameters:**
- `truck_id` (string) – ID of the truck

**Response:**
```json
{
  "route": [
    { "lat": 12.9716, "lon": 77.5946 },
    { "lat": 13.0350, "lon": 77.5970 }
  ]
}
```
#### 🔹 GET /api/sse-events
Streams real-time truck location updates via SSE. The frontend listens to this endpoint to animate truck movement.

**Response:**
```json
{
  "lat": 12.9781,
  "lon": 77.5913
}
```
---

##  🧱 Kafka Integration
Kafka is used to push location updates to the Spring Boot app.

Kafka Config in spring boot **application.properties**:
```bash
spring.application.name=sse
server.port = 8085
springdoc.api-docs.path=/api/v3/api-docs
springdoc.swagger-ui.path=/api/swagger-ui.html
spring.kafka.admin.properties.request.timeout.ms = 30000
spring.kafka.bootstrap-servers=local:9092
spring.kafka.consumer.auto-offset-rest = earliest
```
---

## 🖼️ Frontend - React + Mapbox

### Features

* Displays truck route on a Mapbox map
* Shows live truck position moving along the route
* Connects to backend using SSE for real-time updates

### Setup

1. Go to Frontend/ directory
2. Modify the **.env.development** and **.env.production**. Replace the mapbox token.
```bash
VITE_API_BASE_URL=http://localhost:8085/api
VITE_MAPBOX_TOKEN=your-map-box-token
```
3. Install and run:
```bash
npm install
npm run build
```
This will generate a dist/ directory with static files (HTML, JS, CSS, etc.).
After build, copy the output from **dist/** to  Spring Boot's backend folder **src/main/resources/static**.

4. Go to backend folder run the command below to produce the JAR file:
```bash
./mvnw clean package
```

Run the below command: 
```bash
java -jar target/sse-0.0.1-SNAPSHOT.jar
```
The React app will now be available at:
```bash
http://localhost:8085/
```
## 📦 Directory Structure

```bash
project-root/
├── backend/         # Spring Boot app
├── frontend/        # React app with Mapbox
└── README.md
```
--- 
## Truck Location Kafka Producer

There repo conatains a python file **truck_info_producer.py** which read the bislett_to_ekeberg.geojson and publish the coordinates to Kafka at every second.

install the confluent_kafka Python package, `pip install confluent-kafka` beofre running the python script.

Inside the python change the following setting as required.

```bash
    geojson_path = r"bislett_to_ekeberg.geojson"
    kafka_bootstrap_servers = 'localhost:9092'
    kafka_topic = 'truck-location'
```
