import {createUserProfileTemplate} from './view/user-profile.js';
import {createMainNavigationTemplate} from './view/main-navigation.js';
import {createFilmsSortingTemplate} from './view/films-sorting.js';
import {createContentTemplate} from './view/content.js';
import {createFilmTemplate} from './view/film-card.js';
import {showMoreBtn} from './view/show-more-button.js';
// import {createFilmPopupTemplate} from './view/film-popup.js';

import {render} from './util/render.js';

const MAIN_FILMS = 5;
const EXTRA_FILMS = 2;

const siteBody = document.querySelector(`body`);
const siteHeaderElement = siteBody.querySelector(`.header`);
const siteMainElement = siteBody.querySelector(`.main`);

render(siteHeaderElement, createUserProfileTemplate());
render(siteMainElement, createMainNavigationTemplate());
render(siteMainElement, createFilmsSortingTemplate());
render(siteMainElement, createContentTemplate());

const content = siteMainElement.querySelector(`.films`);
const sortedFilms = content.querySelector(`.films-list`);
const sortedFilmsContainer = sortedFilms.querySelector(`.films-list__container`);
const extraFilmsCategories = content.querySelectorAll(`.films-list--extra`);

for (let i = 0; i < MAIN_FILMS; i++) {
  render(sortedFilmsContainer, createFilmTemplate());
}

render(sortedFilms, showMoreBtn());

for (let j = 0; j < extraFilmsCategories.length; j++) {
  for (let i = 0; i < EXTRA_FILMS; i++) {
    const extraFilmsList = extraFilmsCategories[j].querySelector(`.films-list__container`);
    render(extraFilmsList, createFilmTemplate());
  }
}
