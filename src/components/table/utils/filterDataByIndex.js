export const filterDataByIndex = async (tempData, start, end = undefined) => {
  if (end) return tempData.slice(start, end);
  return tempData.slice(start);
};
