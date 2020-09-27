import UserProfileView from './view/user-profile.js';
import FilmsAmountView from './view/films-amount.js';
import MovieListPresenter from './presenter/movie-list.js';
import FilterPresenter from './presenter/filter.js';
import MoviesModel from './model/movies.js';
import FilterModel from './model/filter.js';

import Api from './api.js';
import {render} from './util/render.js';
import {UpdateType} from './util/const.js';

const AUTHORIZATION = `Basic lob555terPizz444`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

const siteBody = document.querySelector(`body`);
const siteHeaderElement = siteBody.querySelector(`.header`);
const siteMainElement = siteBody.querySelector(`.main`);
const siteFooterElement = siteBody.querySelector(`.footer`);
const footerStatisticsContainer = siteFooterElement.querySelector(`.footer__statistics`);

const api = new Api(END_POINT, AUTHORIZATION);
const moviesModel = new MoviesModel();
const filterModel = new FilterModel();
const userProfileComponent = new UserProfileView(moviesModel);
const filmsListPresenter = new MovieListPresenter(siteMainElement, moviesModel, filterModel, api, userProfileComponent);
const filterPresenter = new FilterPresenter(siteMainElement, moviesModel, filterModel, filmsListPresenter);

render(siteHeaderElement, userProfileComponent);
filterPresenter.init();
filmsListPresenter.init();

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(UpdateType.INIT, movies);
    userProfileComponent.updateElement();
    render(footerStatisticsContainer, new FilmsAmountView(moviesModel.getMovies().length));
  })
    .catch(() => {
      moviesModel.setMovies(UpdateType.INIT, []);
      render(footerStatisticsContainer, new FilmsAmountView(0));
    });
