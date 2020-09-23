import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import CommentsPresenter from '../presenter/comments.js';
import CommentsModel from '../model/comments.js';
import {render, remove, replace} from '../util/render.js';
import {UpdateType, KeyCodes} from '../util/const.js';
// import {UserAction, UpdateType} from "../util/const.js";

const siteFooterElement = document.querySelector(`.footer`);

export default class Movie {
  constructor(changeData, moviesModel) {
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._commentsModel = new CommentsModel();

    this.popupOpenStatus = false;

    this._changeData = changeData;
    this._moviesModel = moviesModel;

    this._siteFooterElement = siteFooterElement;

    this.openFilmPopup = this.openFilmPopup.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._closePopupHandler = this._closePopupHandler.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  init(container, film, destroyFilmDetails) {
    const prevFilmCardComponent = this._filmCardComponent;

    this._film = film;
    this._container = container;

    this._commentsModel.setComments(this._film.comments);
    this._commentsPresenter = new CommentsPresenter(this._commentsModel, this._moviesModel, this._film);

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
      this.openFilmPopup();
    });

    if (this.popupOpenStatus) {
      this.openFilmPopup();
    }
  }

  _handleWatchlistClick() {
    this._film.filterStatus.watchList = !this._film.filterStatus.watchList;
    this._changeData(UpdateType.MINOR, this._film);
  }
  _handleHistoryClick() {
    this._film.filterStatus.history = !this._film.filterStatus.history;
    this._changeData(UpdateType.MINOR, this._film);
  }
  _handleFavoriteClick() {
    this._film.filterStatus.favorites = !this._film.filterStatus.favorites;
    this._changeData(UpdateType.MINOR, this._film);
  }

  _closePopupHandler() {
    this._filmDetailsComponent.setClosePopupHandler(() => {
      remove(this._filmDetailsComponent);
      document.removeEventListener(`keydown`, closePopupKeydown);
      this.popupOpenStatus = false;
    });

    const closePopupKeydown = ((evt) => {
      if (evt.keyCode === KeyCodes.KEY_ESC) {
        remove(this._filmDetailsComponent);
        document.removeEventListener(`keydown`, closePopupKeydown);
        this.popupOpenStatus = false;
      }
    });

    document.addEventListener(`keydown`, closePopupKeydown);
  }

  openFilmPopup() {
    this.popupOpenStatus = true;

    render(this._siteFooterElement, this._filmDetailsComponent, `afterend`);

    this._filmDetailsComponent.setChangeWatchlistHandler(this._handleWatchlistClick);
    this._filmDetailsComponent.setChangeHistoryHandler(this._handleHistoryClick);
    this._filmDetailsComponent.setChangeFavoriteHandler(this._handleFavoriteClick);

    this._commentsContainer = this._filmDetailsComponent.getElement().querySelector(`.form-details__bottom-container`);

    this._commentsPresenter.init(this._commentsContainer);

    this._closePopupHandler();
  }

  destroyDetails() {
    remove(this._filmDetailsComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmDetailsComponent);
  }
}
