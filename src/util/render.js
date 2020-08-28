import {getRandomInteger} from './common.js';
import Abstract from "../view/abstract.js";

export const render = (container, child, place = `beforeend`) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (child instanceof Abstract) {
    child = child.getElement();
  }

  switch (place) {
    case `afterend`:
      container.after(child);
      break;
    case `beforeend`:
      container.append(child);
  }
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

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};