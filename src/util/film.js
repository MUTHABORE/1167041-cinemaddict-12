export const sortFilmsDate = (filmA, filmB) => {
  return filmB.releaseDate.getTime() - filmA.releaseDate.getTime();
};

export const sortFilmsRating = (filmA, filmB) => {
  return filmB.rating - filmA.rating;
};
