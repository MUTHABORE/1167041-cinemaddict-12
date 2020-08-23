import {getRandomInteger, getRandomSet, getRandomNumber, getRandomBoolean} from '../util/utils.js';
import {generateComments} from './comments.js';

const FILM_NAMES = [`Neon Genesis Evangelion`, `2001: A Space Odyssey`, `Arrival`, `Pink Floyd The Wall`, `Interstellar`];
const POSTER_NAMES = [`made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`, `santa-claus-conquers-the-martians.jpg`, `the-dance-of-life.jpg`, `the-great-flamarion.jpg`, `the-man-with-the-golden-arm.jpg`];
const DESCRIPTION = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit`,
  `Cras aliquet varius magna, non porta ligula feugiat eget`,
  `Fusce tristique felis at fermentum pharetra`,
  `Aliquam id orci ut lectus varius viverra`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui`,
  `Sed sed nisi sed augue convallis suscipit in sed felis`,
  `Aliquam erat volutpat`,
  `Nunc fermentum tortor ac porta dapibus`,
  `In rutrum ac purus sit amet tempus`,
];
const MIN_RELEASE_YEAR = 1990;
const MAX_RELEASE_YEAR = 2020;
const MAX_FILMS_AMOUNT = 20;
const FILM_PRODUCERS = [`Anthony Mann`, `Stanley Kubrick`, `Hideaki Anno`, `Christopher Nolan`, `Denis Villeneuve`, `Nikita Storozhenko`];
const FILM_WRITERS = [`Anne Wigton`, `Heinz Herald`, `Richard Weil`];
const FILM_ACTORS = [`Erich von Stroheim`, `Mary Beth Hughes`, `Dan Duryea`];
const GENRES = [`Drama`, `Film-Noir`, `Mystery`];
const COUNTRIES = [`USA`, `USR`, `JPN`];
export const MONTHS = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`];
export const MONTH_DAYS_MAX = 31;
const AGE_RATING = [`0+`, `3+`, `6+`, `7+`, `9+`, `12+`, `16+`, `17+`, `18+`, `20+`, `21+`];

const generateFilmsDatabase = () => {
  const films = [];

  for (let i = 0; i < MAX_FILMS_AMOUNT; i++) {
    films[i] = {};

    films[i].poster = POSTER_NAMES[getRandomInteger(0, POSTER_NAMES.length - 1)];
    films[i].name = FILM_NAMES[getRandomInteger(0, FILM_NAMES.length - 1)];
    films[i].originalName = films[i].name;
    films[i].rating = getRandomNumber();
    films[i].description = getRandomSet(DESCRIPTION, 3).join(`. `);
    films[i].releaseDate = new Date(getRandomInteger(MIN_RELEASE_YEAR, MAX_RELEASE_YEAR), getRandomInteger(0, MONTHS.length - 1), getRandomInteger(1, MONTH_DAYS_MAX));
    films[i].director = FILM_PRODUCERS[getRandomInteger(0, FILM_PRODUCERS.length - 1)];
    films[i].writers = getRandomSet(FILM_WRITERS, 1);
    films[i].actors = getRandomSet(FILM_ACTORS, 1);
    films[i].genres = getRandomSet(GENRES, 1);
    films[i].runtime = getRandomInteger(70, 210);
    films[i].countries = getRandomSet(COUNTRIES, 1);
    films[i].ageRating = AGE_RATING[getRandomInteger(0, AGE_RATING.length - 1)];
    films[i].comments = generateComments();
    films[i].filterStatus = {
      watchList: getRandomBoolean(),
      history: getRandomBoolean(),
      favorites: getRandomBoolean(),
    };
  }
  return films;
};

export const similarFilms = generateFilmsDatabase();

export const createFilter = () => {
  const filter = {
    watchList: 0,
    history: 0,
    favorites: 0,
  };

  for (const currentFilterStatus of similarFilms) {
    if (currentFilterStatus.filterStatus.watchList) {
      filter.watchList += 1;
    }

    if (currentFilterStatus.filterStatus.history) {
      filter.history += 1;
    }

    if (currentFilterStatus.filterStatus.favorites) {
      filter.favorites += 1;
    }
  }
  return filter;
};

export const filterResult = createFilter();
