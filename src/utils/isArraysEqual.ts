export const isArraysEqual = (arr1: any[], arr2: any[]): boolean => {
  // Check if the arrays have the same length
  if (arr1.length !== arr2.length) {
    return false;
  }

  // Check if all elements are the same
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  // If all elements are the same, the arrays are equal
  return true;
};
