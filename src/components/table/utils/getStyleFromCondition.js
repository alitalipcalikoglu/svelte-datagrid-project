export const getStyleFromCondition = (styleCondition, value) => {
  let returnedStyle = '';
  if (!styleCondition) return returnedStyle;
  styleCondition.forEach((sc) => {
    if (sc.values.includes(value.trim())) return (returnedStyle = sc.style);
  });
  return returnedStyle;
};
