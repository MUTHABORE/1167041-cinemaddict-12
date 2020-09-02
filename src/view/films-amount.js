import AbstractView from './abstract.js';

const createFilmsAmount = (allFilmsAmount) => {
  return (
    `<p>${allFilmsAmount} movies inside</p>`
  );
};

export default class FilmsAmount extends AbstractView {
  constructor(allFilmsAmount) {
    super();
    this._allFilmsAmount = allFilmsAmount;
  }

  _getTemplate() {
    return createFilmsAmount(this._allFilmsAmount);
  }
}
