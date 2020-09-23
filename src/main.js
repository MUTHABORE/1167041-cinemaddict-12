import UserProfileView from './view/user-profile.js';
import FilmsAmountView from './view/films-amount.js';
import MovieListPresenter from './presenter/movie-list.js';
import FilterPresenter from './presenter/filter.js';
import MoviesModel from './model/movies.js';
import FilterModel from './model/filter.js';

import {render} from './util/render.js';
import {similarFilms} from './mock/films.js';

const siteBody = document.querySelector(`body`);
const siteHeaderElement = siteBody.querySelector(`.header`);
const siteMainElement = siteBody.querySelector(`.main`);
const siteFooterElement = siteBody.querySelector(`.footer`);
const footerStatisticsContainer = siteFooterElement.querySelector(`.footer__statistics`);

const moviesModel = new MoviesModel();
moviesModel.setMovies(similarFilms);

const filterModel = new FilterModel();

render(siteHeaderElement, new UserProfileView());

const filterPresenter = new FilterPresenter(siteMainElement, moviesModel, filterModel);
const filmsListPresenter = new MovieListPresenter(siteMainElement, moviesModel, filterModel);

filterPresenter.init();
filmsListPresenter.init();
render(footerStatisticsContainer, new FilmsAmountView(similarFilms.length));
