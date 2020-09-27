import AbstractView from './abstract.js';
import he from 'he';
import {setFormatCommentDate} from '../util/common.js';

const createCommentTemplate = (currentComment) => {
  const {emotion, comment, author, date} = currentComment;
  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${`./images/emoji/` + emotion}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(comment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${setFormatCommentDate(date)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

export default class FilmComments extends AbstractView {
  constructor(currentComment) {
    super();
    this._currentComment = currentComment;

    this._deleteCommentHandler = this._deleteCommentHandler.bind(this);
  }

  _getTemplate() {
    return createCommentTemplate(this._currentComment);
  }

  _deleteCommentHandler(evt) {
    evt.preventDefault();
    this._callback.deleteComment();
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteComment = callback;
    this.getElement().querySelector(`.film-details__comment-delete`).addEventListener(`click`, this._deleteCommentHandler);
  }

  getComment() {
    return this._currentComment;
  }
}
