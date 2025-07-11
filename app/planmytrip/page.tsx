"use client";

import { useState, useTransition } from "react";
import {
  Calendar,
  Clock,
  IndianRupee,
  Sun,
  Plane,
  Target,
  MapPin,
  Timer,
  Coins,
  Star,
  Lightbulb,
  Camera,
  Sparkles,
  AlertCircle,
  Loader2,
  Users,
  Globe,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// TypeScript interfaces
interface FormData {
  travelDates: string;
  duration: string;
  budget: string;
  climatePreference: string;
  travelStyle: string;
  interests: string[];
  travelersCount: string;
  destinationCountry: string;
}

interface TravelRecommendation {
  destination?: string;
  duration?: string;
  bestTime?: string;
  bestTimeToVisit?: string;
  budget?: string | Record<string, string>;
  reason?: string;
  highlights?: string;
  keyAttractions?: string[];
  activities?: string[];
}

interface ApiResponse {
  message?: string;
  recommendations?: TravelRecommendation[];
}

const PlanMyTrip = () => {
  const [formData, setFormData] = useState<FormData>({
    travelDates: "",
    duration: "",
    budget: "",
    climatePreference: "",
    travelStyle: "",
    interests: [],
    travelersCount: "1",
    destinationCountry: "",
  });

  const [isPending, startTransition] = useTransition();
  const [recommendations, setRecommendations] = useState<TravelRecommendation[] | ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      const { checked } = checkbox;

      setFormData((prev) => ({
        ...prev,
        interests: checked
          ? [...prev.interests, value]
          : prev.interests.filter((interest) => interest !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Format budget display with proper typing
  const formatBudget = (
    budget: string | Record<string, string> | undefined
  ): string => {
    if (!budget) return "Budget not specified";

    try {
      // If it's already a string that looks like JSON, parse it
      let budgetObj: Record<string, string> | string =
        typeof budget === "string" && budget.trim().startsWith("{")
          ? JSON.parse(budget)
          : budget;

      // If it's an object, format it nicely
      if (typeof budgetObj === "object" && budgetObj !== null) {
        return Object.entries(budgetObj)
          .map(([key, value]) => {
            const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
            return `• ${formattedKey}: ${value}`;
          })
          .join("\n");
      }

      // If it's a string but not JSON, return as is
      return budget as string;
    } catch (e) {
      console.error("Error formatting budget:", e);
      return budget as string; // Return original if there's an error
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        console.log("Form submitted with data:", formData);

        // Test if user is authenticated
        const user = auth.currentUser;
        console.log("Current user:", user);
        console.log("Calling getTravelRecommendations...");

        const response = await fetch("/api/gettravelrecommendation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formData }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }

        const data = await response.json();
        const recs = data.parsedResponse;
        console.log("Received recommendations:", recs);

        if (!recs) {
          throw new Error("No recommendations received");
        }

        setRecommendations(recs);
        console.log("Recommendations set successfully");
      } catch (error) {
        console.error("Error in handleSubmit:", {
          error: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
          formData,
        });
        setError(
          error instanceof Error
            ? error.message
            : "Failed to generate recommendations. Please try again."
        );
      }
    });
  };

  const interests = [
    "History & Museums",
    "Food & Cuisine",
    "Nature & Wildlife",
    "Adventure Sports",
    "Beach & Water Activities",
    "Art & Culture",
    "Nightlife",
    "Shopping",
    "Photography",
    "Local Experiences",
  ] as const;

  const countries = [
    "India",
    "Thailand",
    "Japan",
    "Italy",
    "France",
    "Spain",
    "USA",
    "Canada",
    "Australia",
    "New Zealand",
    "Switzerland",
    "Germany",
    "Greece",
    "Portugal",
    "Vietnam",
    "Indonesia",
    "Malaysia",
    "Singapore",
    "Dubai",
    "South Africa",
    "Maldives",
    "Sri Lanka",
    "Nepal",
    "Bhutan",
    "Myanmar",
    "Cambodia",
    "United Kingdom",
    "Ireland",
    "Norway",
    "Sweden",
    "Finland",
    "Iceland",
    "Brazil",
    "Argentina",
    "Chile",
    "Peru",
    "Mexico",
    "Costa Rica",
    "Egypt",
    "Morocco",
    "Turkey",
    "Any Country",
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col relative overflow-hidden">
      {/* Background glow effects - same as career page */}
      <div className="absolute top-0 left-0 w-[500px] h-[300px] bg-gradient-to-br from-[#00ffb4]/40 to-transparent rotate-12 blur-[120px] rounded-[30%] pointer-events-none z-0" />
      <div className="absolute right-0 w-[550px] h-[300px] md:bg-gradient-to-tr from-yellow-400/30 to-transparent rotate-180 blur-[120px] rounded-[20%] pointer-events-none z-0 top-[1.5%]" />
      <div className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none z-0" />

      <div className="relative z-10">
        <Navbar />

        {/* Header Section */}
        <div className="py-16 px-6 md:px-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-yellow-400 bg-clip-text text-transparent whitespace-nowrap">
            Plan Your Trip
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Tell us your preferences and we'll create personalized travel recommendations just for you
          </p>
        </div>

        <div className="flex-grow py-12 px-4 md:px-8 lg:px-12">
          <div className="max-w-[1400px] mx-auto">
            {/* Form Section - Full width for better desktop layout */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-8 border border-gray-800/50 transform transition-all duration-300 hover:translate-y-[-4px] hover:bg-gray-900/90 hover:border-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/10 mb-12">
              <h2 className="text-2xl font-bold mb-6 text-teal-400 flex items-center gap-3">
                <Target className="w-6 h-6" />
                Trip Details
              </h2>

              {error && (
                <div className="bg-red-900/50 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center backdrop-blur-sm">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Responsive grid for form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Travel Dates */}
                  <div className="form-group">
                    <label
                      htmlFor="travelDates"
                      className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4 text-teal-400" />
                      Travel Dates
                    </label>
                    <input
                      type="date"
                      id="travelDates"
                      name="travelDates"
                      value={formData.travelDates}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 bg-gray-800/80 border border-gray-700/50 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 text-white placeholder-gray-400 hover:bg-gray-800/90 hover:border-teal-500/50"
                    />
                  </div>

                  {/* Duration */}
                  <div className="form-group">
                    <label
                      htmlFor="duration"
                      className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4 text-teal-400" />
                      Trip Duration
                    </label>
                    <select
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 bg-gray-800/80 border border-gray-700/50 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 text-white hover:bg-gray-800/90 hover:border-teal-500/50"
                    >
                      <option value="">Select duration</option>
                      <option value="1-3 days">1-3 days</option>
                      <option value="4-7 days">4-7 days</option>
                      <option value="1-2 weeks">1-2 weeks</option>
                      <option value="2+ weeks">2+ weeks</option>
                    </select>
                  </div>

                  {/* Budget */}
                  <div className="form-group">
                    <label
                      htmlFor="budget"
                      className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2"
                    >
                      <IndianRupee className="w-4 h-4 text-teal-400" />
                      Budget Range
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 bg-gray-800/80 border border-gray-700/50 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 text-white hover:bg-gray-800/90 hover:border-teal-500/50"
                    >
                      <option value="">Select budget</option>
                      <option value="budget">Budget (Under ₹80,000)</option>
                      <option value="mid-range">
                        Mid-range (₹80,000 – ₹2,50,000)
                      </option>
                      <option value="luxury">Luxury (Above ₹2,50,000)</option>
                    </select>
                  </div>

                  {/* Climate Preference */}
                  <div className="form-group">
                    <label
                      htmlFor="climatePreference"
                      className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2"
                    >
                      <Sun className="w-4 h-4 text-teal-400" />
                      Climate Preference
                    </label>
                    <select
                      id="climatePreference"
                      name="climatePreference"
                      value={formData.climatePreference}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 bg-gray-800/80 border border-gray-700/50 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 text-white hover:bg-gray-800/90 hover:border-teal-500/50"
                    >
                      <option value="">Select climate</option>
                      <option value="tropical">Tropical</option>
                      <option value="temperate">Temperate</option>
                      <option value="cold">Cold</option>
                      <option value="desert">Desert</option>
                      <option value="any">No preference</option>
                    </select>
                  </div>

                  {/* Travel Style */}
                  <div className="form-group">
                    <label
                      htmlFor="travelStyle"
                      className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2"
                    >
                      <Plane className="w-4 h-4 text-teal-400" />
                      Travel Style
                    </label>
                    <select
                      id="travelStyle"
                      name="travelStyle"
                      value={formData.travelStyle}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 bg-gray-800/80 border border-gray-700/50 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 text-white hover:bg-gray-800/90 hover:border-teal-500/50"
                    >
                      <option value="">Select style</option>
                      <option value="adventure">Adventure</option>
                      <option value="relaxation">Relaxation</option>
                      <option value="cultural">Cultural</option>
                      <option value="business">Business</option>
                      <option value="family">Family</option>
                      <option value="romantic">Romantic</option>
                    </select>
                  </div>

                  {/* Number of Travelers */}
                  <div className="form-group">
                    <label
                      htmlFor="travelersCount"
                      className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2"
                    >
                      <Users className="w-4 h-4 text-teal-400" />
                      Number of Travelers
                    </label>
                    <select
                      id="travelersCount"
                      name="travelersCount"
                      value={formData.travelersCount}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 bg-gray-800/80 border border-gray-700/50 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 text-white hover:bg-gray-800/90 hover:border-teal-500/50"
                    >
                      <option value="1">1 traveler</option>
                      <option value="2">2 travelers</option>
                      <option value="3-5">3-5 travelers</option>
                      <option value="6-10">6-10 travelers</option>
                      <option value="10+">10+ travelers</option>
                    </select>
                  </div>

                  {/* Destination Country */}
                  <div className="form-group">
                    <label
                      htmlFor="destinationCountry"
                      className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2"
                    >
                      <Globe className="w-4 h-4 text-teal-400" />
                      Destination Country
                    </label>
                    <select
                      id="destinationCountry"
                      name="destinationCountry"
                      value={formData.destinationCountry}
                      onChange={handleChange}
                      className="w-full px-4 py-4 bg-gray-800/80 border border-gray-700/50 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300 text-white hover:bg-gray-800/90 hover:border-teal-500/50"
                    >
                      <option value="">Any Country (We'll suggest)</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Interests - Full width section */}
                <div className="form-group">
                  <label className="block text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
                    <Target className="w-4 h-4 text-teal-400" />
                    Interests (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {interests.map((interest) => (
                      <div key={interest} className="flex items-center group">
                        <input
                          type="checkbox"
                          id={interest}
                          value={interest}
                          checked={formData.interests.includes(interest)}
                          onChange={handleChange}
                          className="w-4 h-4 text-teal-500 bg-gray-800 border-gray-600 rounded focus:ring-teal-500 focus:ring-2 transition-all duration-300"
                        />
                        <label
                          htmlFor={interest}
                          className="ml-3 text-sm text-gray-300 cursor-pointer transition-colors duration-300 group-hover:text-white"
                        >
                          {interest}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button - Centered */}
                <div className="flex justify-center px-4">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full sm:w-auto bg-teal-500 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-teal-500/25 flex items-center justify-center gap-2"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating Recommendations...
                      </>
                    ) : (
                      <>
                        Get My Travel Recommendations
                        <Sparkles className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Recommendations Section - Horizontal Layout */}
            {recommendations && (
              <div className="mb-12">
                <div className="flex items-center mb-8">
                  <h3 className="text-3xl font-bold text-teal-400 flex items-center gap-3">
                    <Target className="w-8 h-8" />
                    Your Personalized Recommendations
                  </h3>
                </div>

                {Array.isArray(recommendations) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 hover:bg-gray-900/90 hover:border-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 group transform hover:translate-y-[-4px]"
                      >
                        <div className="flex items-start justify-between mb-6">
                          <h4 className="text-xl font-bold text-white flex items-center gap-2 group-hover:text-teal-400 transition-colors duration-300">
                            <MapPin className="w-5 h-5" />
                            {rec.destination || "Amazing Destination"}
                          </h4>
                          <span className="bg-teal-500/20 text-teal-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-teal-500/30 flex-shrink-0">
                            #{index + 1}
                          </span>
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/30 hover:border-teal-500/30 transition-all duration-300">
                              <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                                <Timer className="w-3 h-3" />
                                Duration
                              </div>
                              <div className="font-semibold lg:text-lg text-gray-200 text-sm">
                                {rec.duration ||
                                  formData.duration ||
                                  "Flexible"}
                              </div>
                            </div>
                            <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/30 hover:border-teal-500/30 transition-all duration-300">
                              <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                Best Time
                              </div>
                              <div className="font-semibold lg:text-lg text-gray-200 text-sm">
                                {rec.bestTime ||
                                  rec.bestTimeToVisit ||
                                  "Year-round"}
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/30 hover:border-teal-500/30 transition-all duration-300">
                            <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                              <Coins className="w-3 h-3" />
                              Budget
                            </div>
                            <div className="font-semibold lg:text-lg text-gray-200 text-sm whitespace-pre-line">
                              {formatBudget(rec.budget) ||
                                (formData.budget
                                  ? `${formData.budget} range`
                                  : "Varies")}
                            </div>
                          </div>

                          {rec.reason && (
                            <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/30 hover:border-teal-500/30 transition-all duration-300">
                              <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                                <Lightbulb className="w-3 h-3" />
                                Why This Destination
                              </div>
                              <div className="text-gray-300 lg:text-lg text-sm leading-relaxed">
                                {rec.reason}
                              </div>
                            </div>
                          )}

                          <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/30 hover:border-teal-500/30 transition-all duration-300">
                            <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                              <Camera className="w-3 h-3" />
                              Highlights
                            </div>
                            <div className="text-gray-300 lg:text-lg text-sm leading-relaxed">
                              {rec.highlights ||
                                rec.keyAttractions?.join(", ") ||
                                "Amazing experiences await"}
                            </div>
                          </div>

                          {rec.activities && rec.activities.length > 0 && (
                            <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/30 hover:border-teal-500/30 transition-all duration-300">
                              <div className="text-sm text-gray-400 mb-2 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                Activities
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {rec.activities
                                  .slice(0, 4)
                                  .map((activity, idx) => (
                                    <span
                                      key={idx}
                                      className="bg-teal-500/20 lg:text-lg text-teal-300 text-xs font-medium px-2 py-1 rounded-full border border-teal-500/30"
                                    >
                                      {activity}
                                    </span>
                                  ))}
                                {rec.activities.length > 4 && (
                                  <span className="bg-gray-700/50 text-gray-400 text-xs font-medium px-2 py-1 rounded-full border border-gray-600/30">
                                    +{rec.activities.length - 4} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-yellow-900/20 rounded-xl p-6 border border-yellow-500/30">
                    <p className="text-yellow-300">
                      {recommendations.message ||
                        "Custom recommendation generated successfully!"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {!recommendations && !isPending && (
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-12 border border-gray-800/50 text-center transform transition-all duration-300 hover:translate-y-[-4px] hover:bg-gray-900/90 hover:border-teal-500/30 hover:shadow-2xl hover:shadow-teal-500/10">
                <div className="mb-6">
                  <Plane className="w-20 h-20 mx-auto text-teal-400" />
                </div>
                <h3 className="text-2xl font-semibold text-teal-400 mb-3">
                  Ready for Your Next Adventure?
                </h3>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Fill out the form above to get personalized travel
                  recommendations tailored just for you!
                </p>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default PlanMyTrip;