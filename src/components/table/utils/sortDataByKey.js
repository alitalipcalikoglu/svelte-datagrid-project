export const sortDataByKey = async (array, key, type, filter) => {
  return array.sort((a, b) => {
    let x = a[key].toLocaleString();
    let y = b[key].toLocaleString();
    let dataType = filter.find((f) => f.column === key).type;

    if (type === 'desc')
      return y.localeCompare(x, 'en-US', {
        numeric: dataType === 'number' ? 'true' : 'false',
      });
    if (type === 'asc')
      return x.localeCompare(y, 'en-US', {
        numeric: dataType === 'number' ? 'true' : 'false',
      });
  });
};
