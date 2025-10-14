const TextInput = ({
  placeholder,
  isError,
  errorMessage,
  label,

  register,
}: any) => {
  return (
    <div className="mb-4">
      <label htmlFor="username" className="ml-4 block font-medium md:text-lg">
        {label}
      </label>
      <input
        placeholder={placeholder}
        {...register}
        className="w-full rounded-3xl border border-n30 bg-n0 px-3 py-2 text-sm focus:outline-none dark:border-n500 dark:bg-bg4 md:px-6 md:py-3"
      />
      {isError && <p className="pl-4 pt-1 text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default TextInput;
