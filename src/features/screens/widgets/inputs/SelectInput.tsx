import { UseFormRegister, FieldError } from "react-hook-form";

interface SelectInputProps {
  name: string;
  options: readonly string[];
  register: any;
  errors: any;
  label: string;
}
export const SelectInput = ({
  name,
  options,
  register,
  errors,
  label,
}: SelectInputProps) => {
  return (
    <div>
      {label && <label className="mb-2 block">{label}</label>}
      <select {...register(name)} className="mb-4 w-full rounded-lg border p-2">
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errors && <p className="text-red-500">{errors.message}</p>}
    </div>
  );
};
