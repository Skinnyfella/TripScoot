import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const handleError = (error, context) => {
  // In development, we can still see errors
  if (process.env.NODE_ENV === 'development') {
    console.error(`${context}:`, error);
  }
  // Here you could also implement proper error tracking/logging service
  // e.g., Sentry, LogRocket, etc.
};

function Home() {
  const [location, setLocation] = useState({ name: "", coords: null });
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const navigate = useNavigate();

  // Function to geocode a city name using Nominatim
  const geocodeCity = async (city) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`
      );
      if (response.data.length === 0) {
        throw new Error(`No coordinates found for city: ${city}`);
      }
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lng: parseFloat(lon) };
    } catch (error) {
      handleError(error, 'Geocode failed');
      return null;
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      setIsLoading(true);
      setLocationError(null);
      
      try {
        if ("geolocation" in navigator) {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              { 
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
              }
            );
          });

          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=12`
            );
            const address = response.data.address;
            const cityName = address.city || address.town || address.village || address.state || "Unknown Location";
            
            if (!isManualEntry) {
              setLocation({ name: cityName, coords: { lat: latitude, lng: longitude } });
            }
          } catch (error) {
            handleError(error, 'Reverse geocode failed');
            await fetchFromIPAPI();
          }
        } else {
          await fetchFromIPAPI();
        }
      } catch (error) {
        handleError(error, 'Location detection failed');
        if (error.code === 1) {
          setLocationError("Please enable location access in your browser settings for accurate results.");
        } else if (error.code === 2) {
          setLocationError("Unable to determine your location. Please enter it manually.");
        } else {
          setLocationError("Location detection failed. Please enter your location manually.");
        }
        setLocation({ name: '', coords: null });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, [isManualEntry]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (location.name.trim()) {
      // Geocode the manually entered location
      const coords = await geocodeCity(location.name);
      if (coords) {
        navigate("/results", { 
          state: { 
            location: location.name,
            coords
          } 
        });
      } else {
        // If geocoding fails, show an error to the user instead of falling back
        alert(`Could not find coordinates for "${location.name}". Please try a different location.`);
      }
    } else {
      alert("Please enter a location.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="title-animation text-center mb-12">
        <h1 className="text-5xl font-bold mb-2">
          Trip<span className="text-primary">Scout</span>
        </h1>
        <p className="text-lg text-gray-400">Discover places around you</p>
      </div>

      <div className="search-box-animation w-full max-w-md">
        <div className="glass-effect rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-6">What is your location?</h2>
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                className="input-animation w-full bg-white/10 border border-white/20 rounded-lg py-3 px-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                type="text"
                value={location.name}
                onChange={(e) => {
                  setIsManualEntry(true); // Mark as manual entry
                  setLocation(prev => ({ ...prev, name: e.target.value }));
                }}
                placeholder="Enter your location"
                aria-label="Location input"
              />
            </div>
            <button
              type="submit"
              className="hover-scale tap-scale w-full mt-4 bg-primary text-background font-semibold py-3 px-6 rounded-lg transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              Select Location
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8 text-gray-400 text-sm">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p>Detecting your location...</p>
          </div>
        ) : locationError ? (
          <div className="text-center space-y-2">
            <p className="text-red-400">{locationError}</p>
            <button
              onClick={() => fetchLocation()}
              className="text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <p>We use GPS and IP address to find your approximate location</p>
        )}
      </div>
    </div>
  );
}

export default Home;