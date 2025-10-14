import React from "react";
import {
  UseFormRegister,
  FieldError,
  useFieldArray,
  Control,
} from "react-hook-form";

type DynamicSelectInputProps = {
  name: string;
  options: readonly string[];
  register: UseFormRegister<any>;
  errors?: FieldError | (FieldError | undefined)[];
  label?: string;
  control: Control<any>;
};

export const DynamicSelectInput = ({
  name,
  options,
  register,
  errors,
  label,
  control,
}: DynamicSelectInputProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name,
  });

  return (
    <div>
      {label && <label className="mb-2 block">{label}</label>}

      <button
        type="button"
        onClick={() => append("")}
        className="mb-4 flex items-center text-blue-500 hover:text-blue-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Option
      </button>

      {fields.map((field, index) => (
        <div key={field.id} className="relative mb-4">
          <div className="flex w-full items-center">
            <select
              {...register(`${name}.${index}`)}
              className="w-full rounded-lg border p-2"
            >
              <option value="">Select an option</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute right-4 top-2 text-red-500 hover:text-red-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
          {Array.isArray(errors) && errors[index] && (
            <p className="text-red-500">{errors[index]?.message}</p>
          )}
        </div>
      ))}

      {!Array.isArray(errors) && errors && (
        <p className="text-red-500">{errors.message}</p>
      )}
    </div>
  );
};
