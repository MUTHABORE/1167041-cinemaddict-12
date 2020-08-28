import AbstractView from './abstract.js';

const showMoreBtn = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class ShowMoreButton extends AbstractView {
  constructor() {
    super();
    this._clickHandler = this._clickHandler.bind(this);
  }

  _getTemplate() {
    return showMoreBtn();
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.clickShowMore();
  }

  setClickHandler(callback) {
    callback();
    this._callback.clickShowMore = callback;
    this.getElement().addEventListener(`click`, this._clickHandler);
  }
}
