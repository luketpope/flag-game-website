import "../styles/globals.css";
import { useState, useEffect } from "react";
import { getDailyFlag, getTodayResult, submitResult } from "@/utils/api";
import FlagCard from "@/components/FlagCard";
import { useRouter } from "next/router";
import { allCountries } from "@/utils/countries";

export default function Game() {
  const [flag, setFlag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState(null);
  const [token, setToken] = useState(null);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const router = useRouter();

  const maxAttempts = 6;
  const blurLevels = [20, 15, 10, 6, 3, 0];

  const today = new Date().toISOString().slice(0, 10);

  // Load token on mount
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) {
      // router.push("/login");
    } else {
      setToken(t);
    }
  }, [router]);

  // Fetch daily flag
  useEffect(() => {
    async function fetchFlag() {
      try {
        const data = await getDailyFlag();
        setFlag(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFlag();
  }, []);

  // Fetch today's result if token exists
  useEffect(() => {
    if (!token) return;

    async function fetchResult() {
      try {
        const r = await getTodayResult(token);
        setResult(r);
      } catch (err) {
        if (err.message === "Unauthorized") {
          // logout when token is invalid
          localStorage.removeItem("token");
          setToken(null);
          router.push("/login");
        } else {
          console.error(err);
        }
      }
    }

    fetchResult();
  }, [token, router]);

  // function getLocalResults() {
  //   return JSON.parse(localStorage.getItem("flag-game-results") || "{}");
  // }

  // function setLocalResult(date, result) {
  //   const results = getLocalResults();
  //   results[date] = result;
  //   // Optionally, clean up old entries (keep only last 7 days)
  //   const dates = Object.keys(results).sort().reverse();
  //   dates.slice(7).forEach(d => delete results[d]);
  //   localStorage.setItem("flag-game-results", JSON.stringify(results));
  // }

  // // Fetch today's result for logged-out users
  // useEffect(() => {
  //   if (token) return; // Only for logged-out users
  //   const localResults = getLocalResults();
  //   const played = localResults[today];
  //   if (played) setResult(played);
  // }, [token]);

  const handleGuess = async (e) => {
    e.preventDefault();
    setAttempts((prev) => Math.min(prev + 1, maxAttempts - 1));
    if (guess.toLowerCase() === flag.country_name.toLowerCase()) {
      alert("Correct!");
      if (token) {
        try {
          const backendResult = await submitResult(true, attempts + 1, token);
          setResult(backendResult);
        } catch (err) {
          setError(err.message);
        }
      } 
      // else {
      //   setLocalResult(today, { success: true, attempts: attempts + 1 });
      // }
    } else if (attempts + 1 >= maxAttempts) {
      alert(`Out of attempts! The correct answer was ${flag.country_name}.`);
      if (token){
        try {
          const backendResult = await submitResult(false, attempts + 1, token);
          setResult(backendResult);
        } catch (err) {
          setError(err.message);
        }
      } 
      // else {
      //   setLocalResult(today, { success: false, attempts: attempts + 1 });
      // }
    };
  }

  // Update suggestions as the user types
  const handleInputChange = (e) => {
    const value = e.target.value;
    setGuess(value);

    if (value.length > 0) {
      const filtered = allCountries.filter((country) =>
        country.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 10)); // limit to 10 suggestions
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (country) => {
    setGuess(country.name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setResult(null);
    router.push("/login");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  console.log("Token:", token);
  console.log("Played:", result)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {token && (
        <button
          onClick={handleLogout}
          className="mb-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      )}

      {/* {token ? ( */}
        {result ? (
          <p>
            You've played today. Success: {result.success ? "Yes" : "No"}, Attempts: {result.attempts}
          </p>
        ) : (
        <>
          <h1 className="text-3xl font-bold mb-4">Today's Flag</h1>
          <FlagCard countryCode={flag.country_code} blurLevel={blurLevels[attempts]} />
          <form onSubmit={handleGuess} className="flex flex-col items-center space-y-4 mt-4">
            <input
              type="text"
              value={guess}
              onChange={handleInputChange}
              className="border p-2 rounded"
              placeholder="Enter country name"
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="border bg-white w-full max-w-xs absolute z-10">
                {suggestions.map((country) => (
                  <li
                    key={country.code}
                    className="p-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(country)}
                  >
                    {country.name}
                  </li>
                ))}
              </ul>
            )}
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Guess
            </button>
          </form>
        </>
        )}
      {/* // ) : (
      //   <p>Not Logged in</p>
      // )} */}
    </div>
  );
}
