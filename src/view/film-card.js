import AbstractView from './abstract.js';
import moment from 'moment';

const SHORT_DESCRIPTION_LENGTH = 140;

const createFilmTemplate = (filmData) => {
  const {name, rating, releaseDate, runtime, genres, poster, comments, description, filterStatus} = filmData;
  const shortDescription = description.length > SHORT_DESCRIPTION_LENGTH ? description.slice(0, SHORT_DESCRIPTION_LENGTH) + `…` : description;
  return (
    `<article class="film-card">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${moment(releaseDate).format(`YYYY`)}</span>
        <span class="film-card__duration">${moment.utc(moment.duration(runtime, `minutes`).asMilliseconds()).format(`hh[h ]mm[m]`)}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="${poster}" alt="Постер фильма ${name}" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${filterStatus.watchList ? `film-card__controls-item--active` : ``}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${filterStatus.history ? `film-card__controls-item--active` : ``}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${filterStatus.favorites ? `film-card__controls-item--active` : ``}">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class FilmCard extends AbstractView {
  constructor(filmData) {
    super();
    this._filmData = filmData;
    this._openPopupHandler = this._openPopupHandler.bind(this);
    this._changeWatchlistHandler = this._changeWatchlistHandler.bind(this);
    this._changeHistoryHandler = this._changeHistoryHandler.bind(this);
    this._changeFavoriteHandler = this._changeFavoriteHandler.bind(this);
  }

  _getTemplate() {
    return createFilmTemplate(this._filmData);
  }

  _openPopupHandler(evt) {
    evt.preventDefault();
    this._callback.openPopup();
  }

  _changeWatchlistHandler(evt) {
    evt.preventDefault();
    this._callback.changeWatchlist();
  }

  _changeHistoryHandler(evt) {
    evt.preventDefault();
    this._callback.changeHistory();
  }

  _changeFavoriteHandler(evt) {
    evt.preventDefault();
    this._callback.changeFavorite();
  }

  setOpenPopupHandler(callback) {
    this._callback.openPopup = callback;
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, this._openPopupHandler);
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, this._openPopupHandler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, this._openPopupHandler);
  }

  setChangeWatchlistHandler(callback) {
    this._callback.changeWatchlist = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._changeWatchlistHandler);
  }

  setChangeHistoryHandler(callback) {
    this._callback.changeHistory = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._changeHistoryHandler);
  }

  setChangeFavoriteHandler(callback) {
    this._callback.changeFavorite = callback;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._changeFavoriteHandler);
  }
}
