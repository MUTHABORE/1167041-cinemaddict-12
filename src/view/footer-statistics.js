import {similarFilms} from '../mock/films.js';

export const createFilmsAmount = () => {
  return `
  <p>${similarFilms.length} movies inside</p>
  `;
};
