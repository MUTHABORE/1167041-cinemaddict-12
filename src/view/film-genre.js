import {createElement} from '../util/utils.js';

const createGenresTemplate = (currentGenre) => {
  return `
  <span class="film-details__genre">${currentGenre}</span>
  `;
};

export default class Genre {
  constructor(currentGenre) {
    this._element = null;
    this._currentGenre = currentGenre;
  }

  getTemplate() {
    return createGenresTemplate(this._currentGenre);
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
