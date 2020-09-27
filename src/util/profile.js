import {filter} from './filter.js';
import {FilterType, ProfileRanks} from './const.js';

export const getProfileRating = (films) => {
  const watchedFilmsCount = filter[FilterType.HISTORY](films).length;

  switch (true) {
    case (watchedFilmsCount >= ProfileRanks.NOVICE && watchedFilmsCount < ProfileRanks.FAN):
      return `novice`;
    case (watchedFilmsCount >= ProfileRanks.FAN && watchedFilmsCount < ProfileRanks.MOVIE_BUFF):
      return `fan`;
    case (watchedFilmsCount >= ProfileRanks.MOVIE_BUFF):
      return `movie buff`;
    default:
      return ``;
  }
};
