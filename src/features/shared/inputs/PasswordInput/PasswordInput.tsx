import { IconEye, IconEyeOff } from "@tabler/icons-react";

import { useState } from "react";

const PasswordInput = ({
  placeholder,
  isError,
  errorMessage,
  label,
  register,
}: any) => {
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="mb-4">
      <label htmlFor="password" className="ml-4 block font-medium md:text-lg">
        {label}
      </label>
      <div className="relative rounded-3xl border border-n30 bg-n0 px-3 py-2 dark:border-n500 dark:bg-bg4 md:px-6 md:py-3">
        <input
          placeholder={placeholder}
          type={showPass ? "text" : "password"}
          id="password"
          className="w-11/12 bg-transparent text-sm focus:outline-none"
          {...register}
        />
        <span
          onClick={() => setShowPass(!showPass)}
          className="absolute top-1/2 -translate-y-1/2 cursor-pointer ltr:right-5 rtl:left-5"
        >
          {showPass ? <IconEye /> : <IconEyeOff />}
        </span>
      </div>
      {isError && <p className="pl-4 pt-1 text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default PasswordInput;
