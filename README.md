# External Data Dashboard

A **full-stack dashboard for weather and currency data** built with **Next.js, React, Node.js, Express, and MongoDB**. Users can **view real-time weather information and currency rates**, and convert currencies using a clean, interactive UI.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Architecture](#architecture)
5. [Setup & Run](#setup--run)
6. [Challenges & Learnings](#challenges--learnings)
7. [Demo / Usage](#demo--usage)
8. [Future Enhancements](#future-enhancements)
9. [Deployment](#deployment)

---

## Project Overview

**Goal:** Build a dashboard that fetches and displays external data from APIs (weather & currency).

This project demonstrates:

* Full-stack development skills
* Integration with third-party APIs
* Reusable HTTP client with retries and error handling
* Conditional rendering and interactive components
* Type-safe frontend and backend using TypeScript

---

## Tech Stack

* **Frontend:** Next.js 13, React 18, Tailwind CSS, Axios  
* **Backend:** Node.js, Express.js, TypeScript  
* **Database:** MongoDB  
* **External APIs:** OpenWeatherMap, ExchangeRate-API  
* **Other:** dotenv, Cors

---

## Features

1. Fetch and display **current weather** by city  
2. Fetch and display **currency rates** for a base currency  
3. **Currency converter** for selected currencies  
4. Loading and error states for API requests  
5. Mobile-friendly UI  
6. Reusable HTTP client with timeout and retry logic

---

## Architecture

```
Frontend (Next.js)                Backend (Express)                 External APIs / MongoDB
-----------------                 ----------------                 -----------------------
React Components                   REST API Endpoints                 OpenWeatherMap
  |                                |                                 ExchangeRate-API
  | apiClient.get("/weather") <----|                                  
  | apiClient.get("/currency") <---|                                  
  | display data dynamically        |                                  
User interacts with inputs          |                                  
(city, base currency, conversion)  |                                  
  | triggers API calls ------------>|                                  
                                   | httpClient handles retries, timeouts, and errors
                                   | fetches data from external APIs
                                   |
Response returned to frontend <-----|
UI updates dynamically

```

**Flow:**

1. Frontend calls `/api/weather` or `/api/currency` → API fetches data from external services  
2. Backend uses **httpClient** to call external APIs with retries and error handling  
3. Response returned to frontend → UI updates dynamically  
4. Users interact with inputs (city, base currency, conversion amount) → triggers API calls  

---

## Setup & Run

1. **Clone the repo**
2. **Install dependencies**

```bash
# backend
cd backend
npm install

# frontend
cd frontend
npm install
```

3. **Set environment variables** (`.env`)

```env
MONGO_URI=your_mongo_uri
DB_NAME=eds_db_live
BACKEND_PORT=3000
FRONTEND_PORT=3001
URL=http://localhost
OPENWEATHER_API_KEY=your_openweathermap_key
OPENWEATHER_API_BASE_URL=https://api.openweathermap.org/data/2.5
EXCHANGERATE_API_KEY=your_exchangerate_key

NEXT_PUBLIC_API_BASE_URL=http://localhost:3000 // env frontend
```

4. **Run backend**

```bash
npm run dev
```

5. **Run frontend**

```bash
npm run dev
```

6. **Open in browser** → `http://localhost:3001`

---

## Challenges & Learnings

* Handling retries and errors for external API calls
* Type-safe Axios client and request parameter typing
* Conditional rendering based on API responses
* Integrating multiple external data sources into a single dashboard
* Environment configuration and cross-origin setup

---

## Demo / Usage

* Enter a city to fetch current weather information
* Enter a base currency to fetch exchange rates
* Convert amounts between supported currencies

---

## Future Enhancements

* Add historical weather and currency charts
* Cache API responses to reduce requests
* Add user authentication and preferences
* Unit and integration tests for frontend and backend

## Deployment Link
https://external-data-service.vercel.app
