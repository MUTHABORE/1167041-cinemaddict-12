import {createElement} from '../util/utils.js';

const createFilmsAmount = (allFilmsAmount) => {
  return (
    `<p>${allFilmsAmount} movies inside</p>`
  );
};

export default class FilmsAmount {
  constructor(allFilmsAmount) {
    this._element = null;
    this._allFilmsAmount = allFilmsAmount;
  }

  getTemplate() {
    return createFilmsAmount(this._allFilmsAmount);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
