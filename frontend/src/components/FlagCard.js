import { allCountries, getFlagUrl } from "../utils/countries";

export default function FlagCard({ countryCode }) {
  console.log("Country Code: " + countryCode);
  const country = allCountries.find((c) => c.code === countryCode);
  if (!country) return <p>Unknown country</p>;

  const flagUrl = getFlagUrl(country.code, 160); // optional size
  console.log("Flag URL:", flagUrl);

  return (
    <div className="flex flex-col items-center">
      <img src={flagUrl} alt={country.name} className="border rounded shadow-md" />
      <p className="mt-2 font-semibold">{country.name}</p>
    </div>
  );
}
