"use client";

import React from "react";

type Option = {
  label: string;
  value: string;
};

type RadioProps = {
  name: string;
  options: Option[];
  selectedValue: string;
  onChange: (value: string) => void;
};

export const Radio: React.FC<RadioProps> = ({ name, options, selectedValue, onChange }) => {
  return (
    <div className="flex justify-around items-center w-full" >
      {
        options.map((option) => (
          <label key={option.value} className="flex items-center gap-3 cursor-pointer" >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
              className="peer hidden"
            />
            <div className="w-5 h-5 rounded-full border-2 border-gray-400 peer-checked:border-green-500 flex items-center justify-center" >
              {selectedValue === option.value && (<div className={`w-2.5 h-2.5 rounded-full bg-green-500 peer-checked:scale-100 scale-1 transition-transform`} />)}
            </div>
            < span className="text-sm text-gray-700" > {option.label} </span>
          </label>
        ))}
    </div>
  );
};
