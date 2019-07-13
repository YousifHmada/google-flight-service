Node js application to scrape google flights

Endpoints
- /flights?origin_airport={origin_airport}&des_airport={des_airport}&from={from}&to={to}
- /status

Query Example
- /flights?origin_airport_code=Cairo&des_airport_code=Spain&from=07-30-2019&to=08-01-2019

Steps
- git clone https://github.com/YousifHmada/google-flight-service.git
- npm install
- node server.js
- curl localhost:3000/flights?origin_airport_code=Cairo&des_airport_code=Spain&from=07-30-2019&to=08-01-2019