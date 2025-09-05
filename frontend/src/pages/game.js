import "../styles/globals.css";
import { useState, useEffect } from "react";
import { getDailyFlag } from "../utils/api";
import FlagCard from "@/components/FlagCard";

export default function Dashboard() {
  const [flag, setFlag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchFlag() {
      try {
        const data = await getDailyFlag(); // call your helper
        console.log(data);
        setFlag(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFlag();
  }, []);

  useEffect(() => {
    console.log("Flag data:", flag);
  }, [flag]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Today's Flag</h1>
      <FlagCard countryCode={flag.country_code} />
    </div>
  );
}
