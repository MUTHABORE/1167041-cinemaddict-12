import AbstractView from './abstract.js';

const SHORT_DESCRIPTION_LENGTH = 139;

const createFilmTemplate = (filmData) => {
  const {name, rating, releaseDate, runtime, genres, poster, comments, description} = filmData;
  const shortDescription = description.length > 140 ? description.slice(0, SHORT_DESCRIPTION_LENGTH) + `…` : description;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate.getFullYear()}</span>
        <span class="film-card__duration">${Math.floor(runtime / 60) + `h ` + Math.floor(runtime % 60) + `m`}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="${`./images/posters/` + poster}" alt="Постер фильма ${name}" class="film-card__poster">
      <p class="film-card__description">${shortDescription}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched  film-card__controls-item--active">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class FilmCard extends AbstractView {
  constructor(filmData) {
    super();
    this._filmData = filmData;
    this._openPopupHandler = this._openPopupHandler.bind(this);
  }

  _getTemplate() {
    return createFilmTemplate(this._filmData);
  }

  _openPopupHandler(evt) {
    evt.preventDefault();
    this._callback.openPopup();
  }

  setOpenPopupHandler(callback) {
    this._callback.openPopup = callback;
    this.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, this._openPopupHandler);
    this.getElement().querySelector(`.film-card__title`).addEventListener(`click`, this._openPopupHandler);
    this.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, this._openPopupHandler);
  }
}
