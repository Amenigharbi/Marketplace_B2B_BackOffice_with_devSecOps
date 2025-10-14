import * as z from "zod";

export const FormSchema = z
  .object({
    roleId: z.string({ required_error: "Required" }),
    mRoleId: z.string({ required_error: "Required" }),
    lastName: z.string().min(1, { message: "Required" }),
    firstName: z.string().min(1, { message: "Required" }),
    username: z.string().min(4, { message: "Required, at least 4 characters" }),

    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })

  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });
