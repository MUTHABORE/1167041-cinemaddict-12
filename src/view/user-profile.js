import AbstractView from './abstract.js';
import {getProfileRating} from '../util/profile.js';

const createUserProfileTemplate = (films) => {
  const profileRating = getProfileRating(films);
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${profileRating}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class UserProfile extends AbstractView {
  constructor(moviesModel) {
    super();
    this._moviesModel = moviesModel;
  }
  _getTemplate() {
    return createUserProfileTemplate(this._moviesModel.getMovies());
  }
}
