import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { CalendarIcon } from "@radix-ui/react-icons";

interface DateInputProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const dateValue = value ? new Date(value) : undefined;

  const handleDayClick = (date: Date | undefined) => {
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      onChange(formattedDate);
    }
    setIsCalendarOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center rounded-md border p-2">
        <input
          type="text"
          readOnly
          value={value || ""}
          placeholder={placeholder || "Select a date"}
          className="flex-1 outline-none"
        />
        <button
          type="button"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          <CalendarIcon className="h-5 w-5" />
        </button>
      </div>

      {isCalendarOpen && (
        <div className="absolute -top-2 z-10 rounded-md border bg-white shadow-lg">
          <DayPicker
            mode="single"
            selected={dateValue}
            onSelect={handleDayClick}
          />
        </div>
      )}
    </div>
  );
};

export default DateInput;
