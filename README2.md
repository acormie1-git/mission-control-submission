📌 Setup Instructions
Prerequisites:

Node.js 18+ (node -v)
npm (npm -v)

1. Clone and Install <br>
   git clone <your-repo-url> <br>
   cd mission-control-submission <br>
   npm install

2. Environment Setup <br>
   Create .env file in project root with demo api key <br>
   NASA_API_KEY=DEMO_KEY

3. Run the Application and Tests: <br>
   npm start <br>
   npm test 

📌 API Endpoints

APOD (Astronomy Picture of the Day)

| Endpoint | Method | Description                                                                                   |
| -------- | ------ | --------------------------------------------------------------------------------------------- |
| /apod    | GET    | Retrieve APOD image/metadata for today or specific date. Supports date range or random count. |

Parameters:
date (YYYY-MM-DD): Specific date <br>
start_date, end_date: Date range <br>
count: Random images (conflicts with date params) <br>
thumbs: Include video thumbnails
 
Examples: <br>
GET /apod <br>
GET /apod?date=2024-01-01 <br>
GET /apod?count=5

Sample Response: <br>
{ <br>
"date": "2026-03-04", <br>
"explanation": "The globular cluster NGC 6397...", <br>
"hdurl": "https://apod.nasa.gov/apod/image/2603/NGC6397HST.jpg", <br>
"media_type": "image", <br>
"service_version": "v1", <br>
"title": "NGC 6397: A Nearby Globular Cluster", <br>
"url": "https://apod.nasa.gov/apod/image/2603/NGC6397HST1024.jpg" <br>
}



NeoWs (Near Earth Object Web Service)

| Endpoint  | Method | Description                              |
| --------- | ------ | ---------------------------------------- |
| /neo      | GET    | Browse NEOs with pagination              |
| /neo/feed | GET    | Asteroids by closest approach date range |
| /neo/:id  | GET    | Specific asteroid lookup by NASA JPL ID  |

Examples: <br>
GET /neo?page=0&size=10 <br>
GET /neo/feed?start_date=2015-09-07&end_date=2015-09-08 <br>
GET /neo/3542519

Sample Responses: <br>
Browse:
{
"page": 0,
"near_earth_objects": [...],
"links": { "next": "..." }
}<br>
Feed:
{
"element_count": 42,
"near_earth_objects": {
"2015-09-07": [...]
}
}<br>
Single Asteroid:
{
"id": "3542519",
"name": "(2010 RF12)",
"is_potentially_hazardous_asteroid": false,
"estimated_diameter": { ... }
}

DONKI (Space Weather Database)

| Endpoint             | Method | Description                 |
| -------------------- | ------ | --------------------------- |
| /donki/cme           | GET    | Coronal Mass Ejections      |
| /donki/flr           | GET    | Solar Flares                |
| /donki/notifications | GET    | Space weather notifications |

Parameters: startDate, endDate (YYYY-MM-DD), type (notifications only)

Examples: <br>
GET /donki/cme?startDate=2017-01-03&endDate=2017-01-03 <br>
GET /donki/flr?startDate=2016-01-01&endDate=2016-01-30 <br>
GET /donki/notifications?type=all

Sample Responses: <br>
CME:
[
{
"activityID": "2016-09-02T05:19:00Z",
"speed": 450.0,
"halfAngle": 25
}
]

Notifications:
[
{
"messageType": "Report",
"messageID": "2014-05-01T12:00:00Z",
"message": "Solar flare detected..."
}
]

📌 Design Decisions <br><br>
Framework Choice <br><br>
I chose Express.js because:

Prior experience

Industry standard with mature ecosystem

Minimal boilerplate for REST APIs

Excellent testing support (Supertest + Jest)

Clear separation of routing and business logic

Wide community adoption and documentation

<br>Project Structure:

src/
├── app.js              # Express app + middleware + routes
├── server.js           # HTTP server startup
├── routes/             # Express routers by domain
│   ├── apodRoutes.js
│   ├── neoRoutes.js
│   └── donkiRoutes.js
├── services/           # Business logic + NASA API calls
│   ├── apodService.js
│   ├── neoService.js
│   └── donkiService.js
└── lib/               # Shared utilities
├── httpClient.js
└── error.js
tests/                  # Jest + Supertest
├── apod.routes.test.js              
├── donki.routes.test.js           
├── neo.routes.test.js

Why this structure:

Single Responsibility: Routes handle HTTP, services handle business logic

Testable: Services are pure functions, easy to mock

Scalable: Easy to add new NASA APIs or domains

Maintainable: Clear separation of concerns

<br>Performance & Scaling Considerations:

HTTP client pooling: Axios instance reuses connections

Timeouts: 5s timeout prevents hanging requests

Validation: Input validation prevents bad NASA API calls

Error boundaries: Centralized error handling with structured responses

No database: Pure API proxy (appropriate for exercise scope)


<br>Trade-offs Made:

| Feature        | Choice                | Trade-off                                     |
| -------------- | --------------------- | --------------------------------------------- |
| Real-time data | Direct NASA API calls | No caching (fresh data always)                |
| Validation     | Simple param checks   | No full schema validation (express-validator) |
| Pagination     | NASA-native           | No custom pagination logic                    |
| DONKI scope    | CME/FLR/Notifications | Not all 10+ endpoints (focused MVP)           |
| Testing        | Mocked integration    | No real NASA API contract tests               |


<br>Future Improvements (More Time) <br><br>
Redis caching for repeated queries (NASA rate limits)

Rate limiting (express-rate-limit)

API versioning (/v1/apod, /v2/...)

OpenAPI/Swagger docs auto-generation

Input sanitization (Joi/validator.js)

Real NASA integration tests (flaky, separate suite)

Metrics (Prometheus response times, error rates)

GraphQL alternative to REST

Docker containerization

Health checks (/health, /ready)

<br>Testing Strategy<br><br>
95%+ coverage on routes/services

Unit tests: Mocked HTTP client

Integration tests: Full Express app stack

Error path coverage: Validation failures, NASA 5xx

No external deps: Tests don't hit real NASA APIs



