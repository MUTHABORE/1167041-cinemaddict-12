// import UserProfileView from './view/user-profile.js';
// import MainNavigationView from './view/main-navigation.js';
// import FilmsSortingView from './view/films-sorting.js';
// import ContentView from './view/content.js';
// import FilmCardView from './view/film-card.js';
// import FilmDetailsView from './view/film-details.js';
// import FilmsAmountView from './view/films-amount.js';
// import ShowMoreButtonView from './view/show-more-button.js';
// import FilmCommentsView from './view/film-comments.js';

import {render} from './util/render.js';
import {similarFilms} from './mock/films.js';

// const EXTRA_FILMS = 2;
const KEY_ESC = 27;
const AMOUNT_FILMS_TO_SHOW = 5;

// const sortedFilmsContainer = sortedFilms.querySelector(`.films-list__container`); на этот элемент вызывать класс

export default class MovieList {
  constructor(movieListContainer) {
    this._movieListContainer = movieListContainer;
    this._amountFilmsForShow = AMOUNT_FILMS_TO_SHOW;
    this._keyEsc = KEY_ESC;
    this.showMoreButton = new ShowMoreButtonView();
  }

  init() {
    this.renderFilmCards();
  }

  _closePopup() {
    const filmPopup = document.querySelector(`.film-details`);
    const popupCloseBtn = document.querySelector(`.film-details__close-btn`);
      if (filmPopup) {
      filmPopup.remove();
      popupCloseBtn.removeEventListener(`click`, this_.closePopup);
      document.removeEventListener(`keydown`, this_.closePopup);
    }
  }

  _closePopupByEscHandler() {
    document.addEventListener(`keydown`, (evt) => {
      if (evt.keyCode === this._keyEsc) {
        this_.closePopup();
      }
    });
  }

  _openFilmPopup(currentIndex) {
    const filmDetails = new FilmDetailsView(similarFilms[currentIndex]);
    this_.closePopup();
    render(siteBody, filmDetails, `afterend`);
    renderComments(currentIndex);
    filmDetails.setClosePopupHandler(() => {
      this_.closePopup();
    });
    closePopupByEscHandler();
  }

  renderFilmCards() {
    let amountFilmsToRender = 0;
    const countShowFilms = amountFilmsToRender;
    amountFilmsToRender += this._amountFilmsForShow;
  
    for (let i = countShowFilms; i < amountFilmsToRender; i++) {
      const filmCard = new FilmCardView(similarFilms[i]);
      render(sortedFilmsContainer, filmCard);
      filmCard.setOpenPopupHandler(() => {
        openFilmPopup(i);
      });
      closePopupByEscHandler();
    }
  
    if (amountFilmsToRender >= similarFilms.length) {
      showMoreButton.getElement().remove();
      showMoreButton.removeElement();
    }
  }

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
}
