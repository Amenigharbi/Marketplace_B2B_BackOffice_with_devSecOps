"use client";
import React, { ReactNode } from "react";
interface CheckboxCustomProps {
  label?: string;
  img?: ReactNode;
  checked?: boolean;
  onChange?: () => void;
}
const CheckboxCustom: React.FC<CheckboxCustomProps> = ({
  label,
  img,
  checked,
  onChange,
}) => {
  return (
    <div className="relative flex items-center">
      <input
        type="checkbox"
        id={label}
        name="A3-confirmation"
        value={label}
        onChange={onChange}
        defaultChecked={checked}
        className="absolute h-8 w-8 opacity-0"
      />
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-400 bg-n0 focus-within:border-primary dark:bg-bg4 ltr:mr-2 rtl:ml-2">
        <svg
          className="pointer-events-none hidden h-[10px] w-[10px] fill-current text-primary"
          version="1.1"
          viewBox="0 0 17 12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(-9 -11)" fill="#363AED" fillRule="nonzero">
              <path d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />
            </g>
          </g>
        </svg>
      </div>
      {label && (
        <label
          htmlFor={label}
          className="flex cursor-pointer select-none items-center gap-2 text-sm"
        >
          {img && <span>{img}</span>}
          {label}
        </label>
      )}
    </div>
  );
};

export default CheckboxCustom;
