import ShortUniqueId from "short-unique-id";

export const uuid = (length: number) => {
  const uid = new ShortUniqueId({ length });
  return uid();
};
