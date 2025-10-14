const TextInput = ({
  placeholder,
  isError,
  errorMessage,
  label,

  register,
}: any) => {
  return (
    <div className="mb-2 w-full">
      <label htmlFor="username" className=" block font-medium md:text-lg">
        {label}
      </label>
      <input
        placeholder={placeholder}
        {...register}
        className="mb-2 w-full rounded-lg border p-2"
      />
      {isError && <p className="pl-4 pt-1 text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default TextInput;
