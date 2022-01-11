export const returnStyleFromObject = (obj) => {
  if (!obj) return;
  let returnedStyleString = '';
  let keys = Object.keys(obj);
  let values = Object.values(obj);

  keys.forEach((k, i) => {
    returnedStyleString += `${k} : ${values[i]}; `;
  });

  return returnedStyleString.trim();
};

export const returnClassFromObject = (obj) => {
  if (!obj) return;
  let returnedClassString = '';
  let values = [];
  let keys = [];

  Object.values(obj).forEach((val, i) => {
    if (val !== undefined && val !== '' && val !== null) {
      values.push(val);
      keys.push(Object.keys(obj)[i]);
    }
  });

  keys.forEach((k, i) => {
    if (typeof values[i] === 'string') values[i] = values[i].trim();
    if (!values[i]) {
      returnedClassString += `${k} `;
    } else {
      returnedClassString += `${k}-${values[i]} `;
    }
  });

  return returnedClassString.trim();
};

export const stripHtml = (text) => text.replace(/(<([^>]+)>)/gi, '');

export const convertTurkishCharacter = (string) => {
  return string
    .replace(/Ö/g, 'o')
    .replace(/ö/g, 'o')
    .replace(/Ç/g, 'c')
    .replace(/ç/g, 'c')
    .replace(/Ş/g, 's')
    .replace(/ş/g, 's')
    .replace(/Ğ/g, 'g')
    .replace(/ğ/g, 'g')
    .replace(/Ü/g, 'u')
    .replace(/ü/g, 'u')
    .replace(/İ/g, 'i')
    .replace(/ı/g, 'i');
};

export const clearQuote = (string) => {
  string = string.replace(/[']/g, "\\'");
  string = string.replace(/["]/g, '\\"');
  return string;
};

export const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
