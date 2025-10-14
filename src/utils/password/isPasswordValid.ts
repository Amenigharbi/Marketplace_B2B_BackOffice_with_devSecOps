import bcrypt from "bcryptjs";

export const isPasswordValid = async (
  password: string,
  storedHashedPassword: string,
): Promise<boolean> => {
  const isValid = await bcrypt.compare(password, storedHashedPassword);
  return isValid;
};
