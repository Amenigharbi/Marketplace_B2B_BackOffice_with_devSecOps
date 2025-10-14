"use client";
import { useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

interface InputPasswordProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const InputPassword = ({
  placeholder,
  value,
  onChange,
}: InputPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        className="w-full rounded-lg border border-n30 bg-primary/5 px-4 py-2 pr-10 focus:outline-none dark:border-n500 dark:bg-bg3"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-n100 dark:text-n30"
      >
        {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
      </button>
    </div>
  );
};

export default InputPassword;
