// import UserProfileView from './view/user-profile.js';
// import MainNavigationView from './view/main-navigation.js';
// import FilmsSortingView from './view/films-sorting.js';
// import ContentView from './view/content.js';
// import FilmCardView from './view/film-card.js';
// import FilmDetailsView from './view/film-details.js';
// import FilmsAmountView from './view/films-amount.js';
// import ShowMoreButtonView from './view/show-more-button.js';
// import FilmCommentsView from './view/film-comments.js';

// import {render} from './util/render.js';
// import {similarFilms, filterResult} from './mock/films.js';

// const EXTRA_FILMS = 2;
// const KEY_ESC = 27;
// const AMOUNT_FILMS_TO_SHOW = 5;

// let amountFilmsToRender = 0;

const siteBody = document.querySelector(`body`);
const siteHeaderElement = siteBody.querySelector(`.header`);
const siteMainElement = siteBody.querySelector(`.main`);
const siteFooterElement = siteBody.querySelector(`.footer`);
const footerStatisticsContainer = siteFooterElement.querySelector(`.footer__statistics`);

render(siteHeaderElement, new UserProfileView());
render(siteMainElement, new MainNavigationView(filterResult));
render(siteMainElement, new FilmsSortingView());
render(siteMainElement, new ContentView());

const content = siteMainElement.querySelector(`.films`);
const sortedFilms = content.querySelector(`.films-list`);
// const sortedFilmsContainer = sortedFilms.querySelector(`.films-list__container`);
const extraFilmsCategories = content.querySelectorAll(`.films-list--extra`);

// const closePopup = () => {
//   const filmPopup = document.querySelector(`.film-details`);
//   const popupCloseBtn = document.querySelector(`.film-details__close-btn`);
//     if (filmPopup) {
//     filmPopup.remove();
//     popupCloseBtn.removeEventListener(`click`, closePopup);
//     document.removeEventListener(`keydown`, closePopup);
//   }
// };

// const closePopupByEscHandler = () => {
//   document.addEventListener(`keydown`, (evt) => {
//     if (evt.keyCode === KEY_ESC) {
//       closePopup();
//     }
//   });
// };

// const renderComments = (currentIndex) => {
//   const commentsContainer = document.querySelector(`.film-details__comments-list`);
//   for (let comment of similarFilms[currentIndex].comments) {
//     render(commentsContainer, new FilmCommentsView(comment));
//   }
// };

// const openFilmPopup = (currentIndex) => {
//   const filmDetails = new FilmDetailsView(similarFilms[currentIndex]);
//   closePopup();
//   render(siteBody, filmDetails, `afterend`);
//   renderComments(currentIndex);
//   filmDetails.setClosePopupHandler(() => {
//     closePopup();
//   });
//   closePopupByEscHandler();
// };


// const showMoreButton = new ShowMoreButtonView();

// const renderFilmCards = () => {
//   const countShowFilms = amountFilmsToRender;
//   amountFilmsToRender += AMOUNT_FILMS_TO_SHOW;

//   for (let i = countShowFilms; i < amountFilmsToRender; i++) {
//     const filmCard = new FilmCardView(similarFilms[i]);
//     render(sortedFilmsContainer, filmCard);
//     filmCard.setOpenPopupHandler(() => {
//       openFilmPopup(i);
//     });
//     closePopupByEscHandler();
//   }

//   if (amountFilmsToRender >= similarFilms.length) {
//     showMoreButton.getElement().remove();
//     showMoreButton.removeElement();
//   }
// };

// renderFilmCards();

// for (let j = 0; j < extraFilmsCategories.length; j++) {
//   for (let i = 0; i < EXTRA_FILMS; i++) {
//     const extraFilmsList = extraFilmsCategories[j].querySelector(`.films-list__container`);
//     render(extraFilmsList, new FilmCardView(similarFilms[i]));
//   }
// }

// render(sortedFilms, showMoreButton);

// showMoreButton.setClickHandler(() => {
//   renderFilmCards();
// });

render(footerStatisticsContainer, new FilmsAmountView(similarFilms.length));
