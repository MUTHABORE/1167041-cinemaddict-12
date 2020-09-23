import AbstractView from './abstract.js';

const createCommentsContainerTemplate = (comments) => {
  return (
    `<section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list"></ul>

        <div class="film-details__new-comment">
            <div for="add-emoji" class="film-details__add-emoji-label"></div>

            <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
            </div>
        </div>
    </section>`
  );
};

export default class commentsConteiner extends AbstractView {
  constructor(comments) {
    super();
    this.comments = comments;

    this._selectEmojiHandler = this._selectEmojiHandler.bind(this);
  }

  _getTemplate() {
    return createCommentsContainerTemplate(this.comments);
  }

  _selectEmojiHandler(evt) {
    evt.preventDefault();
    this._callback.selectEmoji(evt.currentTarget.getAttribute(`for`));
  }

  setSelectEmojiHandler(callback) {
    this._callback.selectEmoji = callback;
    const emojiItems = this.getElement().querySelectorAll(`.film-details__emoji-label`);
    emojiItems.forEach((item) => item.addEventListener(`click`, this._selectEmojiHandler));
  }
}
