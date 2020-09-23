import FilmsSortingView from '../view/films-sorting.js';
import ContentView from '../view/content.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import NoMoviesInDatabaseView from '../view/no-movies-in-database.js';
import {filter} from "../util/filter.js";

import MoviePresenter from './movie.js';

import {SortType, UpdateType} from '../util/const.js';
import {render, remove} from '../util/render.js';
import {sortFilmsDate, sortFilmsRating} from '../util/film.js';

const AMOUNT_FILMS_TO_SHOW = 5;

export default class MovieList {
  constructor(siteMain, moviesModel, filterModel) {
    this._moviesPresenters = {};
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;

    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = null;
    this._loadMoreButtonComponent = null;

    this._siteMain = siteMain;
    this._amountFilmsToRender = AMOUNT_FILMS_TO_SHOW;
    this._filmsListView = new ContentView();
    this._noMoviesInDatabaseView = new NoMoviesInDatabaseView();
    this._showMoreButtonView = new ShowMoreButtonView();

    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._renderSort = this._renderSort.bind(this);
    this._getMovies = this._getMovies.bind(this);
    this._renderFilmCards = this._renderFilmCards.bind(this);
    this._renderBoard = this._renderBoard.bind(this);
    this._destroyFilmDetails = this._destroyFilmDetails.bind(this);
    this._createShowMoreButton = this._createShowMoreButton.bind(this);
    this._clearFilmsList = this._clearFilmsList.bind(this);
    this._renderFilms = this._renderFilms.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderSort();
    this._renderBoard();
  }

  _getMovies() {
    const filterType = this._filterModel.getFilter();
    const movies = this._moviesModel.getMovies().slice();
    const filtredMovies = filter[filterType](movies);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredMovies.slice().sort(sortFilmsDate);
      case SortType.RATING:
        return filtredMovies.slice().sort(sortFilmsRating);
    }
    return filtredMovies;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this._clearFilmsList();
    this._renderBoard();
  }

  _clearFilmsList({resetAmountFilmsToRender = false, resetSortType = false} = {}) {
    const moviesCount = this._getMovies().length;

    Object
      .values(this._moviesPresenters)
      .forEach((presenter) => presenter.destroy());
    this._moviesPresenters = {};

    remove(this._noMoviesInDatabaseView);
    remove(this._filmsListView);
    remove(this._showMoreButtonView);

    if (resetAmountFilmsToRender) {
      this._amountFilmsToRender = AMOUNT_FILMS_TO_SHOW;
    } else {
      // На случай, если перерисовка доски вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
      this._amountFilmsToRender = Math.min(moviesCount, this._amountFilmsToRender);
    }

    if (resetSortType) {
      remove(this._sortComponent);
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderSort() {
    this._sortComponent = new FilmsSortingView();
    render(this._siteMain, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderBoard({renderSort = false} = {}) {
    if (renderSort) {
      this._renderSort();
    }

    if (this._getMovies().length === 0) {
      render(this._siteMain, this._noMoviesInDatabaseView);
      return;
    }

    render(this._siteMain, this._filmsListView);

    this._filmsList = this._filmsListView.getElement().querySelector(`.films-list`);
    this._filmsListContainer = this._filmsList.querySelector(`.films-list__container`);

    this._createShowMoreButton();
    const films = this._getMovies().slice(0, this._amountFilmsToRender);
    this._renderFilms(films);
  }

  _renderFilmCards(sorterdFilms) {
    this._countShowFilms = this._amountFilmsToRender;
    this._amountFilmsToRender += AMOUNT_FILMS_TO_SHOW;

    if (this._amountFilmsToRender >= sorterdFilms.length) {
      this._amountFilmsToRender = sorterdFilms.length;
    }

    const films = this._getMovies().slice(this._countShowFilms, this._amountFilmsToRender);

    this._renderFilms(films);
  }

  _renderFilms(films) {
    films.forEach((film) => {
      const moviePresenter = new MoviePresenter(this._handleViewAction, this._moviesModel);
      this._moviesPresenters[film.id] = moviePresenter;
      moviePresenter.init(this._filmsListContainer, film, this._destroyFilmDetails);
    });

    if (this._amountFilmsToRender >= this._getMovies().length) {
      this._showMoreButtonView.getElement().remove();
      this._showMoreButtonView.removeElement();
    }
  }

  _createShowMoreButton() {
    render(this._filmsList, this._showMoreButtonView);

    this._showMoreButtonView.setClickHandler(() => {
      this._renderFilmCards(this._getMovies());
    });
  }

  _handleViewAction(updateType, update) {
    this._moviesModel.updateMovie(updateType, update);
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._destroyFilmDetails();
        this._moviesPresenters[data.id].init(this._filmsListContainer, data, this._destroyFilmDetails);
        break;
      case UpdateType.MINOR:
        const openPopupStatus = this._moviesPresenters[data.id].popupOpenStatus;
        this._clearFilmsList();
        this._renderBoard();
        if (openPopupStatus) {
          this._moviesPresenters[data.id].openFilmPopup();
        }
        break;
      case UpdateType.MAJOR:
        this._clearFilmsList({resetAmountFilmsToRender: true, resetSortType: true});
        this._renderBoard({renderSort: true});
        break;
    }
  }

  _destroyFilmDetails() {
    Object.values(this._moviesPresenters).forEach((elem) => {
      elem.destroyDetails();
    });
  }
}
