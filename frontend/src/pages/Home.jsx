import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon, ShieldExclamationIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const handleError = (error, context) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`${context}:`, error);
  }
};

const fetchFromIPAPI = async () => {
  try {
    const response = await axios.get('https://ipapi.co/json/');
    const { city, latitude, longitude } = response.data;
    return { 
      name: city || "Unknown Location", 
      coords: { lat: latitude, lng: longitude } 
    };
  } catch (error) {
    handleError(error, 'IP Geolocation failed');
    return null;
  }
};

function Home() {
  const [location, setLocation] = useState({ name: "", coords: null });
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);
  const [isHttps, setIsHttps] = useState(window.location.protocol === 'https:');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocation = async () => {
      setIsLoading(true);
      setLocationError(null);
      
      if (!isHttps) {
        setLocationError("For accurate location detection, please use our secure site.");
        const ipLocation = await fetchFromIPAPI();
        if (ipLocation && !isManualEntry) {
          setLocation(ipLocation);
        }
        setIsLoading(false);
        return;
      }

      try {
        if ("geolocation" in navigator && isHttps) {
          // Request geolocation with specific options for better mobile support
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              resolve,
              reject,
              { 
                enableHighAccuracy: true,
                timeout: 10000, // Increased timeout for slower mobile connections
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
            const ipLocation = await fetchFromIPAPI();
            if (ipLocation && !isManualEntry) {
              setLocation(ipLocation);
            }
          }
        } else {
          const ipLocation = await fetchFromIPAPI();
          if (ipLocation && !isManualEntry) {
            setLocation(ipLocation);
          }
        }
      } catch (error) {
        handleError(error, 'Location detection failed');
        if (error.code === 1) {
          setLocationError("Please enable location access in your device settings or enter location manually.");
        } else if (error.code === 2) {
          setLocationError("Unable to detect location. Please check your GPS or enter location manually.");
        } else if (error.code === 3) {
          setLocationError("Location request timed out. Please try again or enter location manually.");
        } else {
          setLocationError("Location detection failed. Please enter your location manually.");
        }
        
        // Fallback to IP-based location
        const ipLocation = await fetchFromIPAPI();
        if (ipLocation && !isManualEntry) {
          setLocation(ipLocation);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocation();
  }, [isManualEntry, isHttps]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (location.name.trim()) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location.name)}&format=json&limit=1`
        );
        
        if (response.data.length === 0) {
          setLocationError("Location not found. Please try a different location name.");
          return;
        }
        
        const { lat, lon } = response.data[0];
        navigate("/results", { 
          state: { 
            location: location.name,
            coords: { lat: parseFloat(lat), lng: parseFloat(lon) }
          } 
        });
      } catch (error) {
        handleError(error, 'Geocoding failed');
        setLocationError("Could not find this location. Please try a different name.");
      }
    } else {
      setLocationError("Please enter a location.");
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
          {!isHttps && (
            <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2">
              <ShieldExclamationIcon className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-500">
                For better location accuracy, please use our secure site at{" "}
                <a
                  href={`https://${window.location.host}`}
                  className="underline hover:opacity-80"
                >
                  https://{window.location.host}
                </a>
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                className="input-animation w-full bg-white/10 border border-white/20 rounded-lg py-3 px-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                type="text"
                value={location.name}
                onChange={(e) => {
                  setIsManualEntry(true);
                  setLocationError(null);
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

      <div className="mt-8 text-center">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p>Detecting your location...</p>
          </div>
        ) : locationError ? (
          <div className="space-y-2 max-w-md mx-auto">
            <p className="text-red-400 text-sm">{locationError}</p>
            {!isManualEntry && (
              <button
                onClick={() => {
                  setLocationError(null);
                  setIsLoading(true);
                  navigator.geolocation.getCurrentPosition(() => {}, () => {}, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                  });
                }}
                className="text-primary text-sm hover:underline"
              >
                Try again
              </button>
            )}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">
            {isHttps ? "Using secure location detection" : "Using approximate location"}
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;