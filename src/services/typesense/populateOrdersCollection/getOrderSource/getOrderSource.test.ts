import { getOrderSource } from "./index"; // Adjust the path as needed

describe("getOrderSource", () => {
  test('returns "CUSTOMER" when isFromMobile is true and isVerified is true', () => {
    expect(getOrderSource(true, true)).toBe("CUSTOMER");
  });

  test('returns "MAGENTO" when isFromMobile is false and isVerified is true', () => {
    expect(getOrderSource(false, true)).toBe("MAGENTO");
  });

  test('returns "AGENT" when isFromMobile is true and isVerified is false', () => {
    expect(getOrderSource(true, false)).toBe("AGENT");
  });

  test('returns "UNKNOWN" when isFromMobile is false and isVerified is false', () => {
    expect(getOrderSource(false, false)).toBe("UNKNOWN");
  });
});
