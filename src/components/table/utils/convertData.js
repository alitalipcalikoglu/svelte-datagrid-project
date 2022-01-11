export const convertData = (data, type) => {
  if (type === 'string') {
    return data || '';
  } else if (type === 'datetime') {
    return new Date(data).toLocaleString() || '-';
  } else if (type === 'date') {
    return new Date(data).toLocaleDateString() || '-';
  } else if (type === 'time') {
    return new Date(data).toLocaleTimeString() || '-';
  } else if (type === 'number') {
    return new Intl.NumberFormat().format(data) || '-';
  } else if (type === 'boolean') {
    return data ? true : false;
  } else {
    return data || '';
  }
};

export const returnFilterObjectFromColumnName = (column, data) => {
  let filterItem = {
    column,
    name: column,
    type: 'string',
    style: {},
  };

  if (['date', 'tarih'].includes(column.toLocaleLowerCase())) {
    filterItem.type = 'date';
  } else if (['saat', 'zaman'].includes(column.toLocaleLowerCase())) {
    filterItem.type = 'time';
  } else if (typeof data === 'number') {
    filterItem.type = 'number';
  } else if (typeof data === 'boolean') {
    filterItem.type = 'boolean';
  }

  return filterItem;
};
