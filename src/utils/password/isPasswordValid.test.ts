import bcrypt from "bcryptjs";
import { isPasswordValid } from "./index";

jest.mock("bcryptjs");

describe("isPasswordValid", () => {
  const password = "password123";
  const storedHashedPassword =
    "$2a$10$E9h7K8g5gLQ0nElTjzO.ueU8w1ENfR/btzh5XzT9LP/9aIkdFkWmy"; // Example hashed password

  beforeEach(() => {
    (bcrypt.compare as jest.Mock).mockClear();
  });

  it("should return true for a valid password", async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await isPasswordValid(password, storedHashedPassword);

    expect(result).toBe(true);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, storedHashedPassword);
  });

  it("should return false for an invalid password", async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const result = await isPasswordValid(password, storedHashedPassword);

    expect(result).toBe(false);
    expect(bcrypt.compare).toHaveBeenCalledWith(password, storedHashedPassword);
  });

  it("should handle errors thrown by bcrypt.compare", async () => {
    const error = new Error("bcrypt error");
    (bcrypt.compare as jest.Mock).mockRejectedValue(error);

    await expect(
      isPasswordValid(password, storedHashedPassword),
    ).rejects.toThrow("bcrypt error");
    expect(bcrypt.compare).toHaveBeenCalledWith(password, storedHashedPassword);
  });
});
