import {similarFilms} from '../mock/films.js';
import {createElement} from '../util/utils.js';

const createFilmsAmount = () => {
  return `
  <p>${similarFilms.length} movies inside</p>
  `;
};

export default class FilmsAmount {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsAmount();
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
