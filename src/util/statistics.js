export const getTotalFilmsDuration = (films) => {
  let totalDuration = 0;
  films.forEach((film) => {
    totalDuration += film.runtime;
  });
  return totalDuration;
};

export const getAllGenres = (films) => {
  const allGenres = [];
  films.map((film) => allGenres.push(film.genres));
  const countGenres = allGenres.flat().reduce((accumulator, currentGenre) => {
    accumulator[currentGenre] = accumulator[currentGenre] || 0;
    accumulator[currentGenre]++;

    return accumulator;
  }, {});

  return countGenres;
};

export const getTopGenre = (films) => {
  const genresCountObject = getAllGenres(films);

  if (Object.keys(genresCountObject).length === 0) {
    return ``;
  }

  const maxCount = Math.max(...Object.values(genresCountObject));

  const topGenre = Object.keys(genresCountObject)[Object.values(genresCountObject).indexOf(maxCount)];

  return topGenre;
};
