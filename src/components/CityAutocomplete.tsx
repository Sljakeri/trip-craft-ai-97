import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

const cities = [
  "Paris, France", "New York, USA", "Tokyo, Japan",
  "London, UK", "Rome, Italy", "Barcelona, Spain",
  "Dubai, UAE", "Sydney, Australia", "Bali, Indonesia",
  "Bangkok, Thailand", "Berlin, Germany", "Amsterdam, Netherlands",
  "Belgrade, Serbia", "Toronto, Canada", "Chicago, USA",
  "Manchester, UK", "San Francisco, USA", "Shanghai, China"
];

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  id: string;
}

const CityAutocomplete = ({ value, onChange, placeholder, id }: CityAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.length > 0) {
      const filtered = cities.filter(city =>
        city.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (city: string) => {
    onChange(city);
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        id={id}
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full px-3 py-3 border-2 border-border rounded-lg text-base focus:border-secondary focus:ring-2 focus:ring-secondary/40"
      />
      {isOpen && suggestions.length > 0 && (
        <ul className="autocomplete-items">
          {suggestions.map((city, index) => (
            <li
              key={index}
              onClick={() => handleSelect(city)}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CityAutocomplete;
