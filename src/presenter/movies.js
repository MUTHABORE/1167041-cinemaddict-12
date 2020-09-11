import FilmsSortingView from '../view/films-sorting.js';
import ContentView from '../view/content.js';
import FilmCardView from '../view/film-card.js';
import FilmDetailsView from '../view/film-details.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmCommentsView from '../view/film-comments.js';
import NoMoviesInDatabaseView from '../view/no-movies-in-database.js';

import {SortType} from '../util/const.js';
import {render} from '../util/render.js';
import {sortFilmsDate, sortFilmsRating} from '../util/film.js';
import {similarFilms} from '../mock/films.js';

const KEY_ESC = 27;
const AMOUNT_FILMS_TO_SHOW = 5;
let amountFilmsToRender = 0;

const siteFooterElement = document.querySelector(`.footer`);

export default class MovieList {
  constructor(movieListContainer) {
    this._amountFilmsForShow = AMOUNT_FILMS_TO_SHOW;
    this._keyEsc = KEY_ESC;
    this._currentSortType = SortType.DEFAULT;

    this._movieListContainer = movieListContainer;
    this._amountFilmsToRender = amountFilmsToRender;
    this._content = new ContentView();
    this._sortComponent = new FilmsSortingView();
    this._showMoreButton = new ShowMoreButtonView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._sortFilms = this._sortFilms.bind(this);
    this._renderSort = this._renderSort.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._renderComments = this._renderComments.bind(this);
    this._closePopupByEscHandler = this._closePopupByEscHandler.bind(this);
    this._openFilmPopup = this._openFilmPopup.bind(this);
    this._renderFilmCards = this._renderFilmCards.bind(this);
    this._clearFilmsList = this._clearFilmsList.bind(this);
    this._renderFilms = this._renderFilms.bind(this);

    this._sortedFilms = this._content.getElement().querySelector(`.films-list`);
    this._sortedFilmsContainer = this._sortedFilms.querySelector(`.films-list__container`);
  }

  init() {
    this._allFilms = similarFilms.slice();
    this._sourceAllFilms = similarFilms.slice();

    this._renderSort();
    this._renderFilms();
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.DATE:
        this._allFilms.sort(sortFilmsDate);
        break;
      case SortType.RATING:
        this._allFilms.sort(sortFilmsRating);
        break;
      default:
        this._allFilms = this._sourceAllFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortFilms(sortType);
    this._renderFilms();
  }

  _clearFilmsList() {
    this._amountFilmsToRender = 0;
    this._sortedFilmsContainer.innerHTML = ``;
  }

  _renderSort() {
    render(this._movieListContainer, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilms() {
    this._clearFilmsList();
    if (this._allFilms.length === 0) {
      if (this._movieListContainer.querySelector(`.films`) === null) {
        render(this._movieListContainer, new NoMoviesInDatabaseView());
      }
    } else {
      render(this._movieListContainer, this._content);

      this._renderFilmCards(this._allFilms);
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
    for (let comment of this._allFilms[currentIndex].comments) {
      render(commentsContainer, new FilmCommentsView(comment));
    }
  }

  _openFilmPopup(currentIndex) {
    const filmDetails = new FilmDetailsView(this._allFilms[currentIndex]);
    this._closePopup();
    render(siteFooterElement, filmDetails, `afterend`);
    this._renderComments(currentIndex);
    filmDetails.setClosePopupHandler(() => {
      this._closePopup();
    });
    this._closePopupByEscHandler();
  }

  _renderFilmCards(sorterdFilms) {
    const countShowFilms = this._amountFilmsToRender;
    this._amountFilmsToRender += AMOUNT_FILMS_TO_SHOW;

    if (this._amountFilmsToRender >= sorterdFilms.length) {
      this._amountFilmsToRender = sorterdFilms.length;
    }

    for (let i = countShowFilms; i < this._amountFilmsToRender; i++) {
      const filmCard = new FilmCardView(sorterdFilms[i]);
      render(this._sortedFilmsContainer, filmCard);
      filmCard.setOpenPopupHandler(() => {
        this._openFilmPopup(i);
      });
    }

    if (this._amountFilmsToRender >= sorterdFilms.length) {
      this._showMoreButton.getElement().remove();
      this._showMoreButton.removeElement();
    }
  }

  _createShowMoreButton() {
    render(this._sortedFilms, this._showMoreButton);

    this._showMoreButton.setClickHandler(() => {
      this._renderFilmCards(this._allFilms);
    });
  }
}
