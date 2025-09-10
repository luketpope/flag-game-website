import { allCountries, getFlagUrl } from "../utils/countries";

export default function FlagCard({ countryCode, blurLevel = 0 }) {
  const country = allCountries.find((c) => c.code === countryCode);
  if (!country) return <p>Unknown country</p>;

  const flagUrl = getFlagUrl(country.code, 160); // optional size

  return (
    <div className="flex flex-col items-center m-10">
      <img src={flagUrl} alt={"Guess the flag"} style={{ filter: `blur(${blurLevel}px)`}} className="border rounded shadow-md" />
    </div>
  );
}
