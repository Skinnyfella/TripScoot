TripScout
Discover hotels, restaurants, and fun activities near you with TripScout, a location-based travel exploration app.
Table of Contents
Overview (#overview)

Features (#features)

Tech Stack (#tech-stack)

Installation (#installation)

Usage (#usage)

API Integration (#api-integration)

Contributing (#contributing)

License (#license)

Contact (#contact)

Overview
TripScout is a web application that helps users find nearby hotels, restaurants, malls, and leisure activities based on their location. It uses geolocation or manual location input to fetch relevant places and display them in a user-friendly interface. Whether you're exploring a new city or looking for local hotspots, TripScout makes discovery seamless.
Check out the live app: TripScout
Features
Automatic Location Detection: Uses browser geolocation or IP-based fallback to identify your location.

Manual Location Input: Enter a city name to explore places anywhere.

Categorized Results: Browse hotels/restaurants or fun activities (malls, leisure spots) with category filters.

Responsive Design: Clean, modern UI with animations and glassmorphism effects, optimized for mobile and desktop.

Error Handling: Graceful handling of location errors with user-friendly messages.

Caching: Backend caching with node-cache to optimize API performance.

Tech Stack
Frontend
React: Component-based UI with hooks (useState, useEffect, etc.).

React Router: For navigation between home and results pages.

Axios: For making API requests to the backend and Nominatim.

Heroicons: For sleek, scalable icons.

Tailwind CSS: For styling with utility-first classes.

Vite: Fast build tool for development and production.

Backend
Node.js & Express: RESTful API to fetch place data.

Geoapify API: For place search and geocoding.

Winston: Logging for debugging and error tracking.

Node-Cache: In-memory caching to reduce API calls.

CORS: Configured to support development and production environments.

Dotenv: For environment variable management.

Installation
To run TripScout locally, follow these steps:
Clone the Repository:
bash

git clone https://github.com/Skinnyfella/tripscout.git
cd tripscout

Install Dependencies:
For the frontend:
bash

cd client
npm install

For the backend:
bash

cd server
npm install

Set Up Environment Variables:
Create a .env file in the server directory with:
env

GEOAPIFY_API_KEY=your_geoapify_api_key
NODE_ENV=development
LOG_LEVEL=info

Optionally, create a .env file in the client directory:
env

VITE_API_URL=http://localhost:3000

Run the Application:
Start the backend:
bash

cd server
npm start

Start the frontend:
bash

cd client
npm run dev

Open http://localhost:5173 in your browser.

Usage
Home Page:
Allow location access for automatic detection or enter a city name manually.

Click "Select Location" to proceed.

Results Page:
Toggle between "Hotels & Restaurants" and "Fun Activities".

Filter by specific categories (e.g., hotels, restaurants, malls, activities).

View place names, addresses, and types in a clean, card-based layout.

Error Handling:
If location detection fails, you'll see a prompt to try again or enter a location manually.

API Integration
TripScout uses:
Nominatim (OpenStreetMap): For geocoding city names and reverse geocoding coordinates.

Geoapify: For fetching place data within a 10km radius of the user's location.

Custom Backend: Handles API requests, caching, and error logging.

To use the Geoapify API, sign up at Geoapify to get an API key.
Contributing
Contributions are welcome! To contribute:
Fork the repository.

Create a feature branch (git checkout -b feature/your-feature).

Commit your changes (git commit -m "Add your feature").

Push to the branch (git push origin feature/your-feature).

Open a pull request.

Please ensure your code follows the existing style and includes tests where applicable.
License
This project is licensed under the MIT License. See the LICENSE file for details.
Contact
Built by Skinnyfella.
Reach out via GitHub Issues or email for questions or feedback.

