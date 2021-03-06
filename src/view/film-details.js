import AbstractView from './abstract.js';
import moment from 'moment';

const createFilmPopupTemplate = (filmData) => {
  const {name, rating, poster, ageRating, director, writers, actors, releaseDate, runtime, countries, description, genres, filterStatus} = filmData;

  const createGenres = () => {
    let filmsGenres = ``;
    for (let i = 0; i < genres.length; i++) {
      filmsGenres += `<span class="film-details__genre">${genres[i]}</span>`;
    }
    return filmsGenres;
  };

  const genreTitle = genres.length > 1 ? `Genres` : `Genre`;

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="${name}">

              <p class="film-details__age">${ageRating}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${name}</h3>
                  <p class="film-details__title-original">Original: ${name}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tbody><tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors.join(`, `)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${moment(releaseDate).format(`DD MMMM YYYY`)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${moment.utc(moment.duration(runtime, `minutes`).asMilliseconds()).format(`h[h ]mm[m]`)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${countries}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genreTitle}</td>
                  <td class="film-details__cell--genres">${createGenres()}</td>
                </tr>
              </tbody></table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${filterStatus.watchList ? `checked` : ``}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${filterStatus.history ? `checked` : ``}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${filterStatus.favorites ? `checked` : ``}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="form-details__bottom-container">
        </div>
      </form>
    </section>`
  );
};

export default class FilmDetails extends AbstractView {
  constructor(filmData) {
    super();
    this._filmData = filmData;

    this._closePopupHandler = this._closePopupHandler.bind(this);
    this._changeWatchlistHandler = this._changeWatchlistHandler.bind(this);
    this._changeHistoryHandler = this._changeHistoryHandler.bind(this);
    this._changeFavoriteHandler = this._changeFavoriteHandler.bind(this);
  }

  _getTemplate() {
    return createFilmPopupTemplate(this._filmData);
  }

  _closePopupHandler(evt) {
    evt.preventDefault();
    this._callback.closePopup();
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

  setClosePopupHandler(callback) {
    this._callback.closePopup = callback;
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closePopupHandler);
  }

  setChangeWatchlistHandler(callback) {
    this._callback.changeWatchlist = callback;
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._changeWatchlistHandler);
  }

  setChangeHistoryHandler(callback) {
    this._callback.changeHistory = callback;
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._changeHistoryHandler);
  }

  setChangeFavoriteHandler(callback) {
    this._callback.changeFavorite = callback;
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._changeFavoriteHandler);
  }
}
