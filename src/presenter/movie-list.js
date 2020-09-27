import FilmsSortingView from '../view/films-sorting.js';
import ContentView from '../view/content.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import NoMoviesInDatabaseView from '../view/no-movies-in-database.js';
import LoadingView from '../view/loading.js';

import MoviePresenter from './movie.js';

import {filter} from '../util/filter.js';
import {SortType, UpdateType} from '../util/const.js';
import {render, remove} from '../util/render.js';
import {sortFilmsDate, sortFilmsRating} from '../util/film.js';

const AMOUNT_FILMS_TO_SHOW = 5;

export default class MovieList {
  constructor(siteMain, moviesModel, filterModel, api, profileView) {
    this._moviesPresenters = {};
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._profileView = profileView;
    this._api = api;

    this._currentSortType = SortType.DEFAULT;
    this._amountFilmsToRender = AMOUNT_FILMS_TO_SHOW;
    this._siteMain = siteMain;

    this._isLoading = true;
    this._sortComponent = null;

    this._loadingComponent = new LoadingView();
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
    this._renderFilms = this._renderFilms.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._renderLoading = this._renderLoading.bind(this);
    this.clearFilmsList = this.clearFilmsList.bind(this);

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

  _renderLoading() {
    render(this._siteMain, this._loadingComponent);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._currentSortType = sortType;
    this.clearFilmsList({resetAmountFilmsToRender: true});
    this._renderBoard();
  }

  _renderSort() {
    this._sortComponent = new FilmsSortingView();
    render(this._siteMain, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  clearFilmsList({resetAmountFilmsToRender = false, resetSortType = false} = {}) {
    const moviesCount = this._getMovies().length;

    Object
      .values(this._moviesPresenters)
      .forEach((presenter) => presenter.destroy());
    this._moviesPresenters = {};

    remove(this._loadingComponent);
    remove(this._noMoviesInDatabaseView);
    remove(this._filmsListView);
    remove(this._showMoreButtonView);

    if (resetAmountFilmsToRender) {
      this._amountFilmsToRender = AMOUNT_FILMS_TO_SHOW;
    } else {
      this._amountFilmsToRender = Math.min(moviesCount, this._amountFilmsToRender);
    }

    if (resetSortType) {
      remove(this._sortComponent);
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderBoard({renderSort = false} = {}) {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    if (renderSort) {
      this._renderSort();
    }

    if (this._getMovies().length === 0) {
      render(this._siteMain, this._noMoviesInDatabaseView);
      return;
    }

    render(this._siteMain, this._filmsListView);


    this._filmsListContainer = this._filmsListView.getElement().querySelector(`.films-list__container`);

    const films = this._getMovies();
    const filmsCount = films.length;
    this._renderFilms(films.slice(0, this._amountFilmsToRender));

    if (this._amountFilmsToRender < filmsCount) {
      this._createShowMoreButton();
    }
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
      const moviePresenter = new MoviePresenter(this._handleViewAction, this._moviesModel, this._api);
      this._moviesPresenters[film.id] = moviePresenter;
      moviePresenter.init(this._filmsListContainer, film, this._destroyFilmDetails);
    });

    if (this._amountFilmsToRender >= this._getMovies().length) {
      this._showMoreButtonView.getElement().remove();
      this._showMoreButtonView.removeElement();
    }
  }

  _createShowMoreButton() {
    render(this._filmsListView.getElement().querySelector(`.films-list`), this._showMoreButtonView);

    this._showMoreButtonView.setClickHandler(() => {
      this._renderFilmCards(this._getMovies());
    });
  }

  _handleViewAction(updateType, update) {
    this._api.updateMovie(update).then((response) => {
      this._moviesModel.updateMovie(updateType, response);
    });
  }

  _handleModelEvent(updateType, films) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._destroyFilmDetails();
        this._moviesPresenters[films.id].init(this._filmsListContainer, films, this._destroyFilmDetails);
        break;
      case UpdateType.MINOR:
        this._profileView.updateElement();
        const openPopupStatus = this._moviesPresenters[films.id].popupOpenStatus;
        this.clearFilmsList();
        this._renderBoard();
        if (openPopupStatus) {
          this._moviesPresenters[films.id].openFilmPopup();
        }
        break;
      case UpdateType.MAJOR:
        this.clearFilmsList({resetAmountFilmsToRender: true, resetSortType: true});
        this._renderBoard({renderSort: true});
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        break;
    }
  }

  _destroyFilmDetails() {
    Object.values(this._moviesPresenters).forEach((elem) => {
      elem.destroyDetails();
    });
  }
}
