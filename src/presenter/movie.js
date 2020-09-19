import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import {render, remove, replace} from '../util/render.js';

const KEY_ESC = 27;
const siteFooterElement = document.querySelector(`.footer`);

export default class Movie {
  constructor(changeData) {
    this._keyEsc = KEY_ESC;

    this._filmCardComponent = null;
    this._filmDetailsComponent = null;
    this._popupOpenStatus = false;

    this._changeData = changeData;

    this._siteFooterElement = siteFooterElement;

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._closePopupHandler = this._closePopupHandler.bind(this);
    this._openFilmPopup = this._openFilmPopup.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  init(container, film, destroyFilmDetails) {
    const prevFilmCardComponent = this._filmCardComponent;

    this._film = film;
    this._container = container;

    this._filmCardComponent = new FilmCardView(this._film);
    this._filmDetailsComponent = new FilmDetailsView(this._film);


    if (prevFilmCardComponent === null) {
      render(this._container, this._filmCardComponent);
    } else {
      replace(this._filmCardComponent, prevFilmCardComponent);
    }

    this._filmCardComponent.setChangeWatchlistHandler(this._handleWatchlistClick);
    this._filmCardComponent.setChangeHistoryHandler(this._handleHistoryClick);
    this._filmCardComponent.setChangeFavoriteHandler(this._handleFavoriteClick);

    this._filmCardComponent.setOpenPopupHandler(() => {
      destroyFilmDetails();
      this._openFilmPopup();
    });

    if (this._popupOpenStatus) {
      this._openFilmPopup();
    }
  }

  _handleWatchlistClick() {
    this._film.filterStatus.watchList = !this._film.filterStatus.watchList;
    this._changeData(this._film);
  }
  _handleHistoryClick() {
    this._film.filterStatus.history = !this._film.filterStatus.history;
    this._changeData(this._film);
  }
  _handleFavoriteClick() {
    this._film.filterStatus.favorites = !this._film.filterStatus.favorites;
    this._changeData(this._film);
  }

  _closePopupHandler() {
    this._filmDetailsComponent.setClosePopupHandler(() => {
      remove(this._filmDetailsComponent);
      document.removeEventListener(`keydown`, closePopupKeydown);
      this._popupOpenStatus = false;
    });

    const closePopupKeydown = ((evt) => {
      if (evt.keyCode === KEY_ESC) {
        remove(this._filmDetailsComponent);
        document.removeEventListener(`keydown`, closePopupKeydown);
        this._popupOpenStatus = false;
      }
    });

    document.addEventListener(`keydown`, closePopupKeydown);
  }

  _openFilmPopup() {
    this._popupOpenStatus = true;
    render(this._siteFooterElement, this._filmDetailsComponent, `afterend`);
    this._filmDetailsComponent.setChangeWatchlistHandler(this._handleWatchlistClick);
    this._filmDetailsComponent.setChangeHistoryHandler(this._handleHistoryClick);
    this._filmDetailsComponent.setChangeFavoriteHandler(this._handleFavoriteClick);
    this._closePopupHandler();
  }

  destroy() {
    remove(this._filmDetailsComponent);
  }
}
