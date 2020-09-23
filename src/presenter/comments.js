import {render} from '../util/render.js';
import {UpdateType, UserAction, KeyCodes} from '../util/const.js';
import FilmCommentsView from '../view/film-comments.js';
import CommentsContainerView from '../view/comments-container.js';

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

export default class Comments {
  constructor(commentsModel, moviesModel, film) {
    this._commentsModel = commentsModel;
    this._moviesModel = moviesModel;
    this._film = film;

    this._comments = this._commentsModel.getComments();

    this._filmCommentsView = {};

    this._handleCommentDelete = this._handleCommentDelete.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleSelectEmoji = this._handleSelectEmoji.bind(this);
    this._createNewComment = this._createNewComment.bind(this);
  }

  init(container) {
    this._container = container;
    this._commentsContainer = new CommentsContainerView(this._comments);
    this._commentsListContainer = this._commentsContainer.getElement().querySelector(`.film-details__comments-list`);

    this._currentEmoji = null;
    this._commentUserText = null;

    render(this._container, this._commentsContainer);

    this._comments.forEach((comment) => {
      this._filmCommentsView[comment.id] = new FilmCommentsView(comment);
      render(this._commentsListContainer, this._filmCommentsView[comment.id]);
      this._filmCommentsView[comment.id].setDeleteClickHandler(() => {
        this._handleCommentDelete(this._filmCommentsView[comment.id]);
      });
    });
    this._commentsContainer.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, this._handleAddComment);
    this._commentsContainer.setSelectEmojiHandler(this._handleSelectEmoji);
  }

  _handleCommentDelete(comment) {
    this._handleViewAction(UserAction.DELETE_COMMENT, UpdateType.PATCH, comment.getComment());
  }

  _handleSelectEmoji(selectedEmoji) {
    if (selectedEmoji === this._currentEmoji) {
      return;
    }

    this._currentEmoji = selectedEmoji;

    this._commentsContainer.getElement().querySelector(`.film-details__add-emoji-label`).innerHTML = `<img src="images/emoji/${this._currentEmoji.replace(`emoji-`, ``)}.png" width="55" height="55" alt="${this._currentEmoji}">`;
  }

  _createNewComment(evt) {
    return {
      id: generateId(),
      author: `userName`,
      date: new Date(),
      emoji: this._currentEmoji.replace(`emoji-`, ``) + `.png`,
      text: this._getInputTextareaValue(evt),
    };
  }

  _getInputTextareaValue(evt) {
    return evt.target.value;
  }

  _handleAddComment(evt) {
    if (evt.ctrlKey && evt.keyCode === KeyCodes.KEY_ENTER) {
      if (this._currentEmoji === null || this._getInputTextareaValue(evt) === null) {
        return;
      }
      this._handleViewAction(UserAction.ADD_COMMENT, UpdateType.PATCH, this._createNewComment(evt));
    }
  }

  _handleViewAction(userAction, updateType, data) {
    switch (userAction) {
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, data);
        this._film.comments = this._commentsModel.getComments();
        this._moviesModel.updateMovie(updateType, this._film);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, data);
        this._film.comments = this._commentsModel.getComments();
        this._moviesModel.updateMovie(updateType, this._film);
        break;
    }
  }
}
