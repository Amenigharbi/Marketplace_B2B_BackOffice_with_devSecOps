export const getOrderSource = (
  isFromMobile: boolean,
  isVerified: boolean,
): string => {
  if (isFromMobile && isVerified) {
    return "CUSTOMER";
  }
  if (!isFromMobile && isVerified) {
    return "MAGENTO";
  }
  if (isFromMobile && !isVerified) {
    return "AGENT";
  }

  return "UNKNOWN";
};
