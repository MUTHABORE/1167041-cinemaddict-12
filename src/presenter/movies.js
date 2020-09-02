import FilmsSortingView from '../view/films-sorting.js';
import ContentView from '../view/content.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmCommentsView from '../view/film-comments.js';
import NoMoviesInDatabaseView from '../view/no-movies-in-database.js';

import {render} from '../util/render.js';
import {similarFilms} from '../mock/films.js';

const KEY_ESC = 27;
const AMOUNT_FILMS_TO_SHOW = 5;
let amountFilmsToRender = 0;

const siteFooterElement = document.querySelector(`.footer`);

export default class MovieList {
  constructor(movieListContainer) {
    this._movieListContainer = movieListContainer;
    this._amountFilmsForShow = AMOUNT_FILMS_TO_SHOW;
    this._amountFilmsToRender = amountFilmsToRender;
    this._content = new ContentView();

    this._keyEsc = KEY_ESC;
    this._showMoreButton = new ShowMoreButtonView();
  }

  init() {
    render(this._movieListContainer, new FilmsSortingView());
    this._sortedFilms = this._content.getElement().querySelector(`.films-list`);
    this._sortedFilmsContainer = this._sortedFilms.querySelector(`.films-list__container`);

    if (similarFilms.length === 0) {
      render(this._movieListContainer, new NoMoviesInDatabaseView());
    } else {
      render(this._movieListContainer, this._content);

      this._renderFilmCards();
      this._createShowMoreButton();
    }
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

  _renderComments(currentIndex) {
    const commentsContainer = document.querySelector(`.film-details__comments-list`);
    for (let comment of similarFilms[currentIndex].comments) {
      render(commentsContainer, new FilmCommentsView(comment));
    }
  }

  _openFilmPopup(currentIndex) {
    const filmDetails = new FilmDetailsView(similarFilms[currentIndex]);
    this._closePopup();
    render(siteFooterElement, filmDetails, `afterend`);
    this._renderComments(currentIndex);
    filmDetails.setClosePopupHandler(() => {
      this._closePopup();
    });
    this._closePopupByEscHandler();
  }

  _renderFilmCards() {
    const countShowFilms = amountFilmsToRender;
    amountFilmsToRender += AMOUNT_FILMS_TO_SHOW;

    for (let i = countShowFilms; i < amountFilmsToRender; i++) {
      const filmCard = new FilmCardView(similarFilms[i]);
      render(this._sortedFilmsContainer, filmCard);
      filmCard.setOpenPopupHandler(() => {
        this._openFilmPopup(i);
      });
    }

    if (amountFilmsToRender >= similarFilms.length) {
      this._showMoreButton.getElement().remove();
      this._showMoreButton.removeElement();
    }
  }

  _createShowMoreButton() {
    render(this._sortedFilms, this._showMoreButton);

    this._showMoreButton.setClickHandler(() => {
      this._renderFilmCards();
    });
  }
}
