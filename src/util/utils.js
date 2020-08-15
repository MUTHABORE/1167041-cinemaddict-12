export const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomSet = (arr, min = 0) => {
  const newSet = [];

  for (let i = 0; i < getRandomInteger(min, arr.length); i++) {
    newSet[i] = arr[getRandomInteger(0, arr.length - 1)];
  }

  return newSet;
};

export const getRandomNumber = (digits = 1) => {
  return (Math.random() * 10).toFixed(digits);
};
