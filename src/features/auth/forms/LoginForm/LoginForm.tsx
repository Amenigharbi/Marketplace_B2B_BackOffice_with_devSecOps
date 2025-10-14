import Loading from "@/features/shared/elements/Loading";
import PasswordInput from "@/features/shared/inputs/PasswordInput";
import TextInput from "@/features/shared/inputs/TextInput";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";

const LoginForm = () => {
  const { handleSubmit, register, errors, isLoading } = useLoginForm();

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="Username"
        placeholder="Enter your username"
        register={register("username")}
        isError={errors.username}
        errorMessage={errors.username?.message}
      />

      <PasswordInput
        placeholder="Enter your password"
        register={register("password")}
        label="Password"
        isError={errors.password}
        errorMessage={errors.password?.message}
      />

      <div className="mt-8 flex items-center justify-center gap-6 p-8">
        {isLoading && <Loading />}

        {!isLoading && (
          <button
            type="submit"
            className="btn h-12 w-64 items-center justify-center px-5"
          >
            {isLoading ? <Loading /> : "Login"}
          </button>
        )}
      </div>
    </form>
  );
};

export default LoginForm;
