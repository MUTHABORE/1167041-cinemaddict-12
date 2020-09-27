import {FilterType} from './const.js';

export const filter = {
  [FilterType.ALL_MOVIES]: (movies) => movies,
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.filterStatus.watchList),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.filterStatus.history),
  [FilterType.FAVORITES]: (movies) => movies.filter((movie) => movie.filterStatus.favorites),
};
