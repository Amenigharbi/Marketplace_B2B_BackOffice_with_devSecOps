import { useEffect, useState } from "react";

const Checkbox = ({ checkboxRef, isChecked = false, onClick }: any) => {
  const [checked, setChecked] = useState(isChecked);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);
  return (
    <div
      ref={checkboxRef}
      className="flex h-5 w-5 items-center justify-center rounded-full   hover:bg-n70"
      onClick={(event: any) => {
        //  event.stopPropagation();
        onClick(!checked);
      }}
    >
      <input
        type="checkbox"
        // defaultChecked={checked}
        onChange={() => {
          setChecked((e: boolean) => !e);
        }}
        className="absolute   flex  h-3 w-3 cursor-pointer items-center justify-center bg-blue-500 opacity-0"
        checked={checked}
      />
      <div className=" flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-gray-400 bg-n0 focus-within:border-primary dark:bg-bg4 ">
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
    </div>
  );
};

export default Checkbox;
