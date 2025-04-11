import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, HomeIcon, SparklesIcon } from "@heroicons/react/24/outline";
import axios from "axios";

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

const handleError = (error, context) => {
  console.error(`${context}:`, error);
  if (error.response) {
    console.error('Server Error:', error.response.data);
  } else if (error.request) {
    console.error('Network Error:', error.request);
  }
};

function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("hotels");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        const { lat, lng } = state?.coords || {};

        if (lat && lng) {
          params.append("lat", lat);
          params.append("lng", lng);
        } else if (state?.location) {
          params.append("location", state.location);
        } else {
          handleError(new Error("No coordinates or location provided"), "Parameter validation");
          setItems([]);
          setIsLoading(false);
          return;
        }

        let endpoints = [];
        if (activeTab === "hotels") {
          endpoints = selectedCategory === "all" 
            ? [`${API_URL}/api/hotels`, `${API_URL}/api/restaurants`]
            : [`${API_URL}/api/${selectedCategory}s`];
        } else {
          endpoints = selectedCategory === "all"
            ? [`${API_URL}/api/activities`, `${API_URL}/api/malls`]
            : [`${API_URL}/api/${selectedCategory === "activity" ? "activities" : "malls"}`];
        }

        const responses = await Promise.all(
          endpoints.map(endpoint =>
            axios.get(endpoint, { 
              params,
              withCredentials: true,
              headers: {
                'Accept': 'application/json'
              }
            })
          )
        );

        const combinedData = responses.flatMap(response => {
          const data = Array.isArray(response.data) ? response.data : [];
          return data.map(item => ({
            id: item.id || `${Date.now()}-${Math.random()}`,
            name: item.name || "Unnamed Location",
            location: item.location || "Address not available",
            type: item.type || "unknown"
          }));
        });

        setItems(combinedData);
      } catch (error) {
        handleError(error, "Loading places");
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, selectedCategory, state]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="glass-effect sticky top-0 z-50 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate("/")} className="hover-scale tap-scale p-2 rounded-full hover:bg-white/10">
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">
            Trip<span className="text-primary">Scout</span>
          </h1>
          <div className="w-6" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold mb-6">
          {activeTab === "hotels" ? "Hotels & Restaurants" : "Fun Activities"} in{" "}
          <span className="text-primary">{state?.location || "your area"}</span>
        </h2>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {(activeTab === "hotels" 
            ? ["all", "hotel", "restaurant"]
            : ["all", "mall", "activity"]
          ).map(category => (
            <button
              key={category}
              className={`hover-scale tap-scale px-4 py-2 rounded-full capitalize ${
                selectedCategory === category
                  ? "bg-primary text-background"
                  : "bg-white/10 hover:bg-white/20"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === "all" ? "All" : `${category}s`}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <div key={`${item.id}-${item.name}`} className="glass-effect rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <p className="text-gray-400 mt-1">{item.location}</p>
                    <span className="inline-block mt-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                      {item.type.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="text-center text-gray-400">
                <p className="mb-2">No {selectedCategory === "all" ? "results" : `${selectedCategory}s`} found in this area.</p>
                <button
                  onClick={() => navigate("/")}
                  className="text-primary underline hover:opacity-80"
                >
                  Try a different location
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 glass-effect">
        <div className="max-w-7xl mx-auto grid grid-cols-2 divide-x divide-white/10">
          <button
            className={`hover-scale tap-scale p-4 flex items-center justify-center gap-2 ${
              activeTab === "hotels" ? "text-primary" : "text-white/70"
            }`}
            onClick={() => {
              setActiveTab("hotels");
              setSelectedCategory("all");
            }}
          >
            <HomeIcon className="h-6 w-6" />
            <span className="font-medium">Hotels & Restaurants</span>
          </button>
          <button
            className={`hover-scale tap-scale p-4 flex items-center justify-center gap-2 ${
              activeTab === "activities" ? "text-primary" : "text-white/70"
            }`}
            onClick={() => {
              setActiveTab("activities");
              setSelectedCategory("all");
            }}
          >
            <SparklesIcon className="h-6 w-6" />
            <span className="font-medium">Fun Activities</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default Results;