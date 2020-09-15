const KEY_ESC = 27;

import FilmDetailsView from '../view/film-details.js';
import {render, remove, replace} from '../util/render.js';

const siteFooterElement = document.querySelector(`.footer`);

export default class FilmPopupPresenter {
  constructor() {
    this._keyEsc = KEY_ESC;

    this._filmComponent = null;

    this._siteFooterElement = siteFooterElement;

    this._closePopup = this._closePopup.bind(this);
    this._closePopupByEscHandler = this._closePopupByEscHandler.bind(this);
    this._openFilmPopup = this._openFilmPopup.bind(this);
  }

  init(i, filmData) {
    this._index = i;
    this._filmsData = filmData;
    this._filmData = this._filmsData[this._index];


    this._prevFilmComponent = this._filmComponent;
    this._filmComponent = new FilmDetailsView(this._filmData);
    // console.log(this._filmComponent.getElement());
    // console.log(this._prevFilmComponent.getElement());

    this._openFilmPopup();
    this._closePopupByEscHandler();
  }

  _closePopup() {
    const filmPopup = document.querySelector(`.film-details`);
    const popupCloseBtn = document.querySelector(`.film-details__close-btn`);
    if (filmPopup) {
      filmPopup.remove();
      popupCloseBtn.removeEventListener(`click`, this._closePopup);
      document.removeEventListener(`keydown`, this._closePopup);
    }
  }

  _closePopupByEscHandler() {
    document.addEventListener(`keydown`, (evt) => {
      if (evt.keyCode === KEY_ESC) {
        this._closePopup();
      }
    });
  }

  _openFilmPopup() {
    this._closePopup();

    // if (this._prevFilmComponent === null && siteFooterElement.parentElement.contains(this._prevFilmComponent.getElement()) === false) {
    if (this._prevFilmComponent === null) {
    render(siteFooterElement, this._filmComponent, `afterend`);
    } else {
      replace(this._filmComponent, this._prevFilmComponent);
    }

    // this._renderComments(currentIndex);
    this._filmComponent.setClosePopupHandler(() => {
      this._closePopup();
    });
    this._closePopupByEscHandler();
  }
}
