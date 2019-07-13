# Node js application to scrape google flights

# Endpoints
- /flights?origin_airport={origin_airport}&des_airport={des_airport}&from={from}&to={to}
- /status

# Query Example & Sample response
- /flights?origin_airport=Cairo&des_airport=Spain&from=07-30-2019&to=08-01-2019
```json
  {
    "data": [
        {
            "name": "Tunisair",
            "logo": "https://www.gstatic.com/flights/airline_logos/70px/TU.png",
            "duration": "9 h 30 m",
            "start-end": "02:20 – 11:50",
            "stops": "1 stop",
            "price": "$248",
            "date": "2019-07-30"
        },
        {
            "name": "Alitalia",
            "logo": "https://www.gstatic.com/flights/airline_logos/70px/AZ.png",
            "duration": "6 h 10 m",
            "start-end": "17:05 – 23:15",
            "stops": "1 stop",
            "price": "$353",
            "date": "2019-07-30"
        },
        {
            "name": "Royal Air Maroc",
            "logo": "https://www.gstatic.com/flights/airline_logos/70px/AT.png",
            "duration": "10 h 35 m",
            "start-end": "08:05 – 18:40",
            "stops": "1 stop",
            "price": "$371",
            "date": "2019-07-30"
        }
        ...
    ]
}
```

# Steps to get started
- git clone https://github.com/YousifHmada/google-flight-service.git
- cd google-flight-service/
- npm install
- node server.js
- open http://localhost:3000/status
- open http://localhost:3000/flights?origin_airport=Cairo&des_airport=Spain&from=07-30-2019&to=08-01-2019
- open http://localhost:3000/status
