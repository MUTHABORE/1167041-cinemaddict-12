import {filter} from './filter.js';
import {FilterType, ProfileRank} from './const.js';

export const getProfileRating = (films) => {
  const watchedFilmsCount = filter[FilterType.HISTORY](films).length;

  switch (true) {
    case (watchedFilmsCount >= ProfileRank.NOVICE && watchedFilmsCount < ProfileRank.FAN):
      return `novice`;
    case (watchedFilmsCount >= ProfileRank.FAN && watchedFilmsCount < ProfileRank.MOVIE_BUFF):
      return `fan`;
    case (watchedFilmsCount >= ProfileRank.MOVIE_BUFF):
      return `movie buff`;
    default:
      return ``;
  }
};
