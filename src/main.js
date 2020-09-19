import UserProfileView from './view/user-profile.js';
import MainNavigationView from './view/main-navigation.js';
import MovieListPresenter from './presenter/movie-list.js';
import FilmsAmountView from './view/films-amount.js';

import {render} from './util/render.js';
import {similarFilms, filterResult} from './mock/films.js';

const siteBody = document.querySelector(`body`);
const siteHeaderElement = siteBody.querySelector(`.header`);
const siteMainElement = siteBody.querySelector(`.main`);
const siteFooterElement = siteBody.querySelector(`.footer`);
const footerStatisticsContainer = siteFooterElement.querySelector(`.footer__statistics`);

render(siteHeaderElement, new UserProfileView());
render(siteMainElement, new MainNavigationView(filterResult));

const filmsListPresenter = new MovieListPresenter(siteMainElement);
filmsListPresenter.init();

render(footerStatisticsContainer, new FilmsAmountView(similarFilms.length));
