import * as z from "zod";

import { SubmitHandler, useForm } from "react-hook-form";

import { FormSchema } from "./formSchema";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useNavigation } from "@/features/shared/hooks/useNavigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = z.infer<typeof FormSchema>;

export const useLoginForm = () => {
  const { navigateToDashboard } = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  //Get Token to access supplier dashboard

  // const handleApiLogin = async (username: string, password: string) => {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ username, password }),
  //     });

  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       return { error: errorData.message || "Login failed" };
  //     }

  //     const result = await response.json();
  //     return {
  //       token: result.token,
  //       user: result.user,
  //       role: result.user?.role,
  //     };
  //   } catch (error) {
  //     return { error: "Network error. Please try again." };
  //   }
  // };

  //End supplier token access

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    const { username, password } = data;
    const res = await login(username, password);

    //Supplier Access //

    // const apiResponse = await handleApiLogin(username, password);

    // if (apiResponse.error) {
    //   throw new Error(apiResponse.error);
    // }

    // if (apiResponse.token) {
    //   localStorage.setItem("authToken", apiResponse.token);
    // }

    //End Supplier Access //
    setIsLoading(false);
    if (res?.error === "CredentialsSignin") {
      toast.error("Invalid username or password");
      return;
    }

    if (res?.error === "AccessDenied") {
      toast.error("Not Allowed to Login");
      return;
    }
    toast.success("Welcome To Kamioun OMS !", { duration: 3000 });
    navigateToDashboard();
  };

  return { handleSubmit: handleSubmit(onSubmit), register, errors, isLoading };
};
