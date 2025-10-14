import bcrypt from "bcryptjs";
import { hashPassword } from "./index";

jest.mock("bcryptjs");

describe("hashPassword", () => {
  const password = "password123";
  const salt = "randomsalt";
  const hashedPassword = "hashedpassword";

  beforeEach(() => {
    (bcrypt.genSalt as jest.Mock).mockClear();
    (bcrypt.hash as jest.Mock).mockClear();
  });

  it("should generate a salt and hash the password", async () => {
    (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
    (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

    const result = await hashPassword(password);

    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
    expect(result).toBe(hashedPassword);
  });

  it("should handle errors thrown by bcrypt.genSalt", async () => {
    const error = new Error("genSalt error");
    (bcrypt.genSalt as jest.Mock).mockRejectedValue(error);

    await expect(hashPassword(password)).rejects.toThrow("genSalt error");
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  it("should handle errors thrown by bcrypt.hash", async () => {
    const error = new Error("hash error");
    (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
    (bcrypt.hash as jest.Mock).mockRejectedValue(error);

    await expect(hashPassword(password)).rejects.toThrow("hash error");
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith(password, salt);
  });
});
