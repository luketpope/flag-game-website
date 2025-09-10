import { countries } from "countries-list";

export const allCountries = Object.entries(countries).map(([code, info]) => ({
  code: code.toLowerCase(),       // ISO alpha-2
  name: info.name,
}));

export function getFlagUrl(code, width = 80) {
  // Flagcdn expects lowercase country codes
  return `https://flagcdn.com/w${width}/${code.toLowerCase()}.png`;
}