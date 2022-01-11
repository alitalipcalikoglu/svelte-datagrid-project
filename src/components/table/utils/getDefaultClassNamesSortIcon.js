export const getDefaultClassNamesSortIcon = (iconClassList, table) => {
  return iconClassList.filter((c) => !table.sorting.getIconListArray.includes(c));
};
