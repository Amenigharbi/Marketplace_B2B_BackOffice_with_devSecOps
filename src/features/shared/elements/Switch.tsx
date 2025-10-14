"use client";
import { useState, useEffect } from "react";

interface SwitchProps {
  isChecked?: boolean;
  label: string;
  onChange?: (checked: boolean) => void;
}

const Switch = ({ isChecked = false, label, onChange }: SwitchProps) => {
  const [checked, setChecked] = useState(isChecked);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  const handleChange = () => {
    const newValue = !checked;
    setChecked(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <label htmlFor={label} className="flex cursor-pointer items-center">
        <div className="relative">
          <input
            type="checkbox"
            id={label}
            onChange={handleChange}
            checked={checked}
            className="sr-only"
          />
          <div
            className={`block ${
              checked ? "bg-primary" : "bg-primary/20"
            } h-8 w-14 rounded-full`}
          ></div>
          <div
            className={`dot absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${
              checked && "translate-x-full"
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default Switch;
