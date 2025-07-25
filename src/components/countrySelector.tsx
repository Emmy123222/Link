// import React, { useState, useEffect } from "react";
// import { Country } from "@/types/countryCode";

// type Props = {
//   countries: Country[];
//   value: string;
//   onChange: (value: string) => void;
// };

// const CountrySelector: React.FC<Props> = ({ countries, value, onChange }) => {
//   const [search, setSearch] = useState("");
//   const [filteredCountries, setFilteredCountries] = useState<Country[]>(countries);

//   useEffect(() => {
//     const term = search.toLowerCase();
//     setFilteredCountries(
//       countries.filter(
//         (c) =>
//           c.countryName.toLowerCase().includes(term) ||
//           c.phone_code.phone_code.includes(term)
//       )
//     );
//   }, [search, countries]);

//   return (
//     <div className="border rounded p-2 w-full max-w-sm">
//       <input
//         type="text"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         placeholder="Search country..."
//         className="w-full px-2 py-1 mb-2 border rounded"
//       />
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full px-2 py-1"
//         size={5}
//       >
//         {filteredCountries.map((country) => (
//           <option key={country.ID} value={country.countryCode}>
//             {`${country.icon} ${country.countryName} (+${country.phone_code.phone_code})`}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default CountrySelector;
