export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const render = (container, element, place = `beforeend`) => {
  switch (place) {
    case `afterend`:
      container.after(element.getElement());
      break;
    case `beforeend`:
      container.append(element.getElement());
  }
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

export const getRandomBoolean = () => {
  return Math.random() >= 0.5;
};
