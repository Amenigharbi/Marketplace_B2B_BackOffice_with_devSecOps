type AnyObject = { [key: string]: any };

export const removeObjectProperty = <T extends AnyObject, K extends keyof T>(
  obj: T,
  prop: K,
): Omit<T, K> => {
  const { [prop]: _, ...newObj } = obj;
  return newObj as Omit<T, K>;
};
