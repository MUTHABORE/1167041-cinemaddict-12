import {createUserProfileTemplate} from './view/user-profile.js';
import {createMainNavigationTemplate} from './view/main-navigation.js';
import {createFilmsSortingTemplate} from './view/films-sorting.js';
import {createContentTemplate} from './view/content.js';
import {createFilmTemplate} from './view/film-card.js';
import {createFilmPopupTemplate} from './view/film-popup.js';
import {createFilmsAmount} from './view/footer-statistics.js';
import {showMoreBtn} from './view/show-more-button.js';
import {createGenresTemplate} from './view/film-genre.js';
import {createCommentTemplate} from './view/film-comments.js';

import {render} from './util/utils.js';
import {similarFilms} from './mock/films.js';

const EXTRA_FILMS = 2;

const siteBody = document.querySelector(`body`);
const siteHeaderElement = siteBody.querySelector(`.header`);
const siteMainElement = siteBody.querySelector(`.main`);
const siteFooterElement = siteBody.querySelector(`.footer`);
const footerStatisticsContainer = siteFooterElement.querySelector(`.footer__statistics`);

render(siteHeaderElement, createUserProfileTemplate());
render(siteMainElement, createMainNavigationTemplate());
render(siteMainElement, createFilmsSortingTemplate());
render(siteMainElement, createContentTemplate());

const content = siteMainElement.querySelector(`.films`);
const sortedFilms = content.querySelector(`.films-list`);
const sortedFilmsContainer = sortedFilms.querySelector(`.films-list__container`);
const extraFilmsCategories = content.querySelectorAll(`.films-list--extra`);

const closePopup = () => {
  const filmPopup = document.querySelector(`.film-details`);
  const popupCloseBtn = document.querySelector(`.film-details__close-btn`);
  if (filmPopup) {
    filmPopup.remove();
    popupCloseBtn.removeEventListener(`click`, closePopup);
    document.removeEventListener(`keydown`, closePopup);
  }
};

const onClosePopup = () => {
  const KEY_ESC = 27;
  const popupCloseBtn = document.querySelector(`.film-details__close-btn`);
  popupCloseBtn.addEventListener(`click`, () => {
    closePopup();
  });

  document.addEventListener(`keydown`, (evt) => {
    if (evt.keyCode === KEY_ESC) {
      closePopup();
    }
  });
};

const renderGenres = (currentIndex) => {
  const genresContainer = document.querySelector(`.film-details__cell--genres`);
  similarFilms[currentIndex].genres.forEach((elem) => {
    render(genresContainer, createGenresTemplate(elem));
  });
};

const renderComments = (currentIndex) => {
  const commentsContainer = document.querySelector(`.film-details__comments-list`);
  for (let comment of similarFilms[currentIndex].comments) {
    render(commentsContainer, createCommentTemplate(comment));
  }
};

const openFilmPopup = (currentIndex) => {
  closePopup();
  render(siteBody, createFilmPopupTemplate(similarFilms[currentIndex]));
  renderGenres(currentIndex);
  renderComments(currentIndex);
  onClosePopup();
};

const onOpenPopup = (target, currentIndex) => {
  target.addEventListener(`click`, () => {
    openFilmPopup(currentIndex);
  });
};

let amountFilmsToRender = 0;
const AMOUNT_FILMS_TO_SHOW = 5;

const renderFilmCards = () => {
  const countShowFilms = amountFilmsToRender;
  amountFilmsToRender += AMOUNT_FILMS_TO_SHOW;

  for (let i = countShowFilms; i < amountFilmsToRender; i++) {
    render(sortedFilmsContainer, createFilmTemplate(similarFilms[i]));
  }

  const filmPosters = document.querySelectorAll(`.film-card__poster`);
  const filmTitles = document.querySelectorAll(`.film-card__title`);
  const filmComments = document.querySelectorAll(`.film-card__comments`);

  for (let i = countShowFilms; i < amountFilmsToRender; i++) {
    onOpenPopup(filmPosters[i], i);
    onOpenPopup(filmTitles[i], i);
    onOpenPopup(filmComments[i], i);
  }

  if (amountFilmsToRender >= similarFilms.length) {
    showMoreButton.remove();
  }
};

renderFilmCards();

for (let j = 0; j < extraFilmsCategories.length; j++) {
  for (let i = 0; i < EXTRA_FILMS; i++) {
    const extraFilmsList = extraFilmsCategories[j].querySelector(`.films-list__container`);
    render(extraFilmsList, createFilmTemplate(similarFilms[i]));
  }
}

render(sortedFilms, showMoreBtn());

const showMoreButton = document.querySelector(`.films-list__show-more`);

showMoreButton.addEventListener(`click`, () => {
  renderFilmCards();
});

render(footerStatisticsContainer, createFilmsAmount());
