import Observer from '../util/observer.js';
import {FilterType} from '../util/const.js';

export default class FilterModel extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterType.ALL_MOVIES;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
