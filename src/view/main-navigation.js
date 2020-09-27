import AbstractView from './abstract.js';
import {FilterType} from '../util/const.js';

const createMainNavigationTemplate = (filters, currentFilter) => {
  const {watchlist, history, favorite} = filters;
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item ${currentFilter === FilterType.ALL_MOVIES ? `main-navigation__item--active` : ``}" data-filter-type="${FilterType.ALL_MOVIES}">All movies</a>
        <a href="#watchlist" class="main-navigation__item ${currentFilter === FilterType.WATCHLIST ? `main-navigation__item--active` : ``}" data-filter-type="${FilterType.WATCHLIST}">Watchlist <span class="main-navigation__item-count">${watchlist}</span></a>
        <a href="#history" class="main-navigation__item ${currentFilter === FilterType.HISTORY ? `main-navigation__item--active` : ``}" data-filter-type="${FilterType.HISTORY}">History <span class="main-navigation__item-count">${history}</span></a>
        <a href="#favorites" class="main-navigation__item ${currentFilter === FilterType.FAVORITES ? `main-navigation__item--active` : ``}" data-filter-type="${FilterType.FAVORITES}">Favorites <span class="main-navigation__item-count">${favorite}</span></a>
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class MainNavigation extends AbstractView {
  constructor(filterResult, currentFilter) {
    super();
    this._filterResult = filterResult;
    this._currentFilter = currentFilter;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
    this._openStatisticHandler = this._openStatisticHandler.bind(this);
    this._closeStatisticHandler = this._closeStatisticHandler.bind(this);
  }

  _getTemplate() {
    return createMainNavigationTemplate(this._filterResult, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.currentTarget.dataset.filterType);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    const filterElements = this.getElement().querySelectorAll(`.main-navigation__item`);
    filterElements.forEach((filter) => filter.addEventListener(`click`, this._filterTypeChangeHandler));
  }

  _openStatisticHandler(evt) {
    evt.preventDefault();
    this._callback.openStatisticHandler();
    this.getElement().querySelector(`.main-navigation__additional`).removeEventListener(`click`, this._openStatisticHandler);
    this.getElement().querySelector(`.main-navigation__items`).addEventListener(`click`, this._closeStatisticHandler);
  }

  setOpenStatisticHandler(callback) {
    this._callback.openStatisticHandler = callback;
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, this._openStatisticHandler);
  }

  _closeStatisticHandler(evt) {
    evt.preventDefault();
    this._callback.closeStatisticHandler();
    this.getElement().querySelector(`.main-navigation__items`).removeEventListener(`click`, this._closeStatisticHandler);
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, this._openStatisticHandler);
  }

  setCloseStatisticHandler(callback) {
    this._callback.closeStatisticHandler = callback;
    this.getElement().querySelector(`.main-navigation__items`).addEventListener(`click`, this._closeStatisticHandler);
  }
}
