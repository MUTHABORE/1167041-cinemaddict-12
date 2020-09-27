import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import CommentsPresenter from '../presenter/comments.js';
import CommentsModel from '../model/comments.js';
import {render, remove, replace} from '../util/render.js';
import {UpdateType, KeyCode} from '../util/const.js';

export default class Movie {
  constructor(changeData, moviesModel, api) {
    this._filmCardComponent = null;
    this._filmDetailsComponent = null;

    this._commentsModel = new CommentsModel();

    this.popupOpenStatus = false;

    this._changeData = changeData;
    this._moviesModel = moviesModel;
    this._api = api;

    this.openFilmPopup = this.openFilmPopup.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._closePopupHandler = this._closePopupHandler.bind(this);
    this._closePopupMovie = this._closePopupMovie.bind(this);
    this._closePopupKeydownHandler = this._closePopupKeydownHandler.bind(this);
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

  _closePopupMovie() {
    remove(this._filmDetailsComponent);
    document.removeEventListener(`keydown`, this._closePopupKeydownHandler);
    this.popupOpenStatus = false;
  }

  _closePopupKeydownHandler(evt) {
    if (evt.keyCode === KeyCode.KEY_ESC) {
      this._closePopupMovie();
    }
  }

  _closePopupHandler() {
    this._filmDetailsComponent.setClosePopupHandler(() => {
      this._closePopupMovie();
    });

    document.addEventListener(`keydown`, this._closePopupKeydownHandler);
  }

  openFilmPopup() {
    const siteFooterElement = document.querySelector(`.footer`);
    this.popupOpenStatus = true;

    render(siteFooterElement, this._filmDetailsComponent, `afterend`);

    this._filmDetailsComponent.setChangeWatchlistHandler(this._handleWatchlistClick);
    this._filmDetailsComponent.setChangeHistoryHandler(this._handleHistoryClick);
    this._filmDetailsComponent.setChangeFavoriteHandler(this._handleFavoriteClick);

    this._commentsContainer = this._filmDetailsComponent.getElement().querySelector(`.form-details__bottom-container`);

    this._api.getComments(this._film)
    .then((comments) => {
      this._commentsModel.setComments(comments);
      this._commentsPresenter = new CommentsPresenter(this._commentsModel, this._moviesModel, this._film, this._api);
      this._commentsPresenter.init(this._commentsContainer);
    });

    this._closePopupHandler();
  }

  destroyDetails() {
    document.removeEventListener(`keydown`, this._closePopupKeydownHandler);
    remove(this._filmDetailsComponent);
  }

  destroy() {
    document.removeEventListener(`keydown`, this._closePopupKeydownHandler);
    remove(this._filmCardComponent);
    remove(this._filmDetailsComponent);
  }
}
