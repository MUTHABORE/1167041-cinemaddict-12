import {render} from '../util/render.js';
import {UpdateType, UserAction, KeyCodes} from '../util/const.js';
import FilmCommentsView from '../view/film-comments.js';
import CommentsContainerView from '../view/comments-container.js';
import {shakeEffect} from '../util/common.js';

export default class Comments {
  constructor(commentsModel, moviesModel, film, api) {
    this._commentsModel = commentsModel;
    this._moviesModel = moviesModel;
    this._film = film;
    this._api = api;

    this._comments = this._commentsModel.getComments();

    this._filmCommentsView = {};

    this._handleCommentDelete = this._handleCommentDelete.bind(this);
    this._handleAddComment = this._handleAddComment.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleSelectEmoji = this._handleSelectEmoji.bind(this);
    this._createNewComment = this._createNewComment.bind(this);
    this._getInputTextareaValue = this._getInputTextareaValue.bind(this);
    this._changeDeleteButtonStatus = this._changeDeleteButtonStatus.bind(this);
    this._changeAddPanelStatus = this._changeAddPanelStatus.bind(this);
  }

  init(container) {
    this._container = container;
    this._commentsContainer = new CommentsContainerView(this._comments);
    this._commentsListContainer = this._commentsContainer.getElement().querySelector(`.film-details__comments-list`);
    this._commentAddPanel = this._commentsContainer.getElement().querySelector(`.film-details__new-comment`);
    this._newCommentInput = this._commentAddPanel.querySelector(`.film-details__comment-input`);

    this._selectedCommentEmoji = null;

    render(this._container, this._commentsContainer);

    this._comments.forEach((comment) => {
      this._filmCommentsView[comment.id] = new FilmCommentsView(comment);
      render(this._commentsListContainer, this._filmCommentsView[comment.id]);
      this._filmCommentsView[comment.id].setDeleteClickHandler(() => {
        this._handleCommentDelete(this._filmCommentsView[comment.id]);
      });
    });
    this._newCommentInput.addEventListener(`keydown`, this._handleAddComment);
    this._commentsContainer.setSelectEmojiHandler(this._handleSelectEmoji);
  }

  _handleCommentDelete(comment) {
    this._changeDeleteButtonStatus(comment, `inactive`);
    this._handleViewAction(UserAction.DELETE_COMMENT, UpdateType.PATCH, comment.getComment());
  }

  _handleSelectEmoji(selectedEmoji) {
    if (selectedEmoji === this._currentEmoji) {
      return;
    }

    this._currentEmoji = selectedEmoji.replace(`emoji-`, ``);

    this._commentsContainer.getElement().querySelector(`.film-details__add-emoji-label`).innerHTML = `<img src="images/emoji/${this._currentEmoji}.png" width="55" height="55" alt="emoji-${this._currentEmoji}">`;
  }

  _getCommentTextInput(evt) {
    return evt.target.value;
  }

  _createNewComment(evt) {
    return {
      date: new Date(),
      emotion: this._currentEmoji,
      comment: this._getInputTextareaValue(evt),
    };
  }

  _getInputTextareaValue(evt) {
    return evt.target.value;
  }

  _handleAddComment(evt) {
    if (evt.ctrlKey && evt.keyCode === KeyCodes.KEY_ENTER) {
      if (this._currentEmoji === `` || this._getInputTextareaValue(evt) === ``) {
        shakeEffect(this._commentAddPanel);
        return;
      }
      this._changeAddPanelStatus(`inactive`);
      this._handleViewAction(UserAction.ADD_COMMENT, UpdateType.PATCH, this._createNewComment(evt));
    }
  }

  _changeDeleteButtonStatus(currentComment, status) {
    const commentDeleteButton = currentComment.getElement().querySelector(`.film-details__comment-delete`);

    if (status === `active`) {
      commentDeleteButton.removeAttribute(`disabled`);
      commentDeleteButton.textContent = `Delete`;
    }
    if (status === `inactive`) {
      commentDeleteButton.setAttribute(`disabled`, `disabled`);
      commentDeleteButton.textContent = `Deleting...`;
    }
  }

  _changeAddPanelStatus(status) {
    if (status === `active`) {
      this._newCommentInput.removeAttribute(`disabled`);
      this._commentsContainer.setSelectEmojiHandler(this._handleSelectEmoji);
    }
    if (status === `inactive`) {
      this._newCommentInput.setAttribute(`disabled`, `disabled`);
      this._commentsContainer.removeSelectEmojiHandler();
    }
  }

  _handleViewAction(userAction, updateType, update) {
    switch (userAction) {
      case UserAction.ADD_COMMENT:
        this._api.addComment(this._film, update)
          .then((response) => {
            this._moviesModel.updateMovie(updateType, response);
          })
          .catch(() => {
            this._changeAddPanelStatus(`active`);
            shakeEffect(this._commentAddPanel);
          })
        ;
        break;
      case UserAction.DELETE_COMMENT:
        this._api.deleteComment(update)
          .then(() => {
            const commentId = this._film.comments.findIndex((id) => id === update.id);
            this._film.comments.splice(commentId, 1);
            this._moviesModel.updateMovie(updateType, this._film);
          })
          .catch(() => {
            this._changeDeleteButtonStatus(this._filmCommentsView[update.id], `active`);
            shakeEffect(this._filmCommentsView[update.id].getElement());
          });
        break;
    }
  }
}
