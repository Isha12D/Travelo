import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { FaCalendarDay, FaMapMarkedAlt, FaUtensils } from "react-icons/fa";

const TravelBot = () => {
  const { city: cityParam } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [city, setCity] = useState(cityParam || "");
  const [days, setDays] = useState(searchParams.get("days") || "");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchItinerary = async (targetCity, targetDays) => {
    if (!targetCity.trim() || !targetDays || isNaN(targetDays) || targetDays <= 0) return;

    setLoading(true);
    setResponse("");

    try {
      const res = await axios.post("http://localhost:8080/user/travel-info", {
        city: targetCity,
        days: Number(targetDays),
      });
      setResponse(res.data.answer);
    } catch (err) {
      console.error("Error:", err);
      setResponse("⚠️ Something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cityParam && days) {
      fetchItinerary(cityParam, days);
    }
  }, [cityParam, days]);

  const handleStart = () => {
    if (!city.trim()) return alert("Please enter a city");
    if (!days || isNaN(days) || days <= 0) return alert("Enter a valid number of days");

    setSearchParams({ days });
    fetchItinerary(city, days);
  };

  // Split response by day for UI cards
  // Use regex to match each Day block
const dayResponses = response
  ? Array.from(response.matchAll(/(Day\s\d+:?\s*[\s\S]*?)(?=Day\s\d+:|$)/gi), m => m[1].trim())
  : [];


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 p-6">
      <div className="w-full max-w-4xl bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-blue-700 drop-shadow-md">
          ✈️ Explore {city || "Your Destination"}
        </h1>

        {/* Input Section */}
        {!cityParam && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <input
              type="text"
              placeholder="Enter city"
              className="w-full sm:w-1/2 text-center border-none bg-gray-100 text-gray-800 font-semibold text-lg rounded-lg py-3 focus:ring-2 focus:ring-blue-400 outline-none"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type="number"
              placeholder="Number of days"
              className="w-full sm:w-1/4 text-center border-none bg-gray-100 text-gray-800 font-semibold text-lg rounded-lg py-3 focus:ring-2 focus:ring-blue-400 outline-none"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              min={1}
            />
            <button
              onClick={handleStart}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all transform hover:scale-105"
            >
              Start Trip
            </button>
          </div>
        )}

        {/* Loading / Response */}
        <div className="min-h-[220px] bg-gray-100 rounded-xl p-5 text-gray-800 text-lg leading-relaxed overflow-y-auto shadow-inner">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-3 animate-pulse">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-blue-600 font-medium">Planning your {days}-day trip to {city}...</p>
            </div>
          ) : dayResponses.length > 0 ? (
            <div className="space-y-6">
              {dayResponses.map((dayContent, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-4 shadow-md border-l-4 border-blue-500"
                >
                  <div className="flex items-center gap-2 mb-2 text-blue-600 font-semibold text-lg">
                    <FaCalendarDay />
                    <span>Day {idx + 1}</span>
                  </div>
                  <div
                    className="text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: dayContent
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\*(.*?)\*/g, "<em>$1</em>")
                        .replace(/\n/g, "<br/>"),
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              Enter a city and number of days to generate your itinerary.
            </p>
          )}
        </div>

        {/* Hotels Button */}
        {city && !loading && (
          <div className="flex justify-center pt-4">
            <button
              onClick={() => navigate(`/hotels/${city}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all transform hover:scale-105"
            >
              🏨 View Hotels in {city}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelBot;
