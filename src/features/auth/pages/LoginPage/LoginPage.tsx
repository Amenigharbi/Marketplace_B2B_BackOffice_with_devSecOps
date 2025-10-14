import Image from "next/image";
import LoginForm from "../../forms/LoginForm";

const LoginPage = () => {
  return (
    <div className="  flex min-h-screen flex-grow items-center justify-center bg-[url(/images/login-bg.png)] bg-cover px-3 py-10 md:px-5 md:py-16 lg:py-20 xl:py-28">
      <div className="box w-full max-w-[805px] items-center p-4">
        <div className="box bg-primary/5 dark:bg-bg3 lg:p-6 xl:p-8">
          <div className="flex flex-grow items-center justify-center ">
            <Image
              src={"/images/kamioun-logo.png"}
              alt="logo"
              width={260}
              height={280}
            />
          </div>
          <div className="bb-dashed mb-4 pb-4 text-sm md:mb-6 md:pb-6 md:text-base" />
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
