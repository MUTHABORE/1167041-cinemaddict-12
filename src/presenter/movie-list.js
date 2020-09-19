import FilmsSortingView from '../view/films-sorting.js';
import ContentView from '../view/content.js';
import ShowMoreButtonView from '../view/show-more-button.js';
// import FilmCommentsView from '../view/film-comments.js';
import NoMoviesInDatabaseView from '../view/no-movies-in-database.js';

import MoviePresenter from './movie.js';

import {SortType} from '../util/const.js';
import {render} from '../util/render.js';
import {sortFilmsDate, sortFilmsRating} from '../util/film.js';
import {updateItem} from '../util/common.js';
import {similarFilms} from '../mock/films.js';


const AMOUNT_FILMS_TO_SHOW = 5;
let amountFilmsToRender = 0;

export default class MovieList {
  constructor(movieListContainer) {
    this._moviesPresenters = {};

    this._amountFilmsForShow = AMOUNT_FILMS_TO_SHOW;
    this._currentSortType = SortType.DEFAULT;

    this._movieListContainer = movieListContainer;
    this._amountFilmsToRender = amountFilmsToRender;
    this._content = new ContentView();
    this._sortComponent = new FilmsSortingView();
    this._showMoreButton = new ShowMoreButtonView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._sortFilms = this._sortFilms.bind(this);
    this._renderSort = this._renderSort.bind(this);
    // this._renderComments = this._renderComments.bind(this);
    this._renderFilmCards = this._renderFilmCards.bind(this);
    this._renderFilms = this._renderFilms.bind(this);
    this._destroyFilmDetails = this._destroyFilmDetails.bind(this);
    this._handleCardChange = this._handleCardChange.bind(this);

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

  // _renderComments(currentIndex) {
  //   const commentsContainer = document.querySelector(`.film-details__comments-list`);
  //   for (let comment of this._allFilms[currentIndex].comments) {
  //     render(commentsContainer, new FilmCommentsView(comment));
  //   }
  // }

  _renderFilmCards(sorterdFilms) {
    const countShowFilms = this._amountFilmsToRender;
    this._amountFilmsToRender += AMOUNT_FILMS_TO_SHOW;

    if (this._amountFilmsToRender >= sorterdFilms.length) {
      this._amountFilmsToRender = sorterdFilms.length;
    }

    for (let i = countShowFilms; i < this._amountFilmsToRender; i++) {

      const moviePresenter = new MoviePresenter(this._handleCardChange);
      this._moviesPresenters[sorterdFilms[i].id] = moviePresenter;
      moviePresenter.init(this._sortedFilmsContainer, sorterdFilms[i], this._destroyFilmDetails);
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

  _handleCardChange(updatedFilmData) {
    this._allFilms = updateItem(this._allFilms, updatedFilmData);
    this._sourceAllFilms = updateItem(this._sourceAllFilms, updatedFilmData);
    this._destroyFilmDetails();
    this._moviesPresenters[updatedFilmData.id].init(this._sortedFilmsContainer, updatedFilmData, this._destroyFilmDetails);
  }

  _destroyFilmDetails() {
    Object.values(this._moviesPresenters).forEach((elem) => elem.destroy());
  }
}
