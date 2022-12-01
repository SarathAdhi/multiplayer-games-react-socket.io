export const getDummyPicture = (
  keyword: string,
  category: string = "miniavs"
) => {
  return `https://avatars.dicebear.com/api/${category}/${encodeURI(
    keyword
  )}.svg`;
};
