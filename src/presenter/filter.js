import {render, replace, remove} from "../util/render.js";
import MainNavigationView from '../view/main-navigation.js';
import {FilterType, UpdateType} from '../util/const.js';
import {filter} from '../util/filter.js';

export default class Filter {
  constructor(container, moviesModel, filterModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._filterModel = filterModel;

    this._countFilters = this._countFilters.bind(this);

    this._currentFilter = null;
    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();
    const prevFilterComponent = this._filterComponent;

    const filtersCount = this._countFilters();

    this._filterComponent = new MainNavigationView(filtersCount, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._container, this._filterComponent);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._currentFilter = filterType;
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _countFilters() {
    return {
      watchlist: filter[FilterType.WATCHLIST](this._moviesModel.getMovies()).length,
      history: filter[FilterType.HISTORY](this._moviesModel.getMovies()).length,
      favorite: filter[FilterType.FAVORITES](this._moviesModel.getMovies()).length
    };
  }
}
