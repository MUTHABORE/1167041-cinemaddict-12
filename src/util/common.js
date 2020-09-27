import moment from 'moment';

const SHAKE_ANIMATION_TIMEOUT = 600;

export const setFormatCommentDate = (date) => {
  return moment(Date.parse(date)).fromNow();
};

export const shakeEffect = (element) => {
  element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
  setTimeout(() => {
    element.style.animation = ``;
  }, SHAKE_ANIMATION_TIMEOUT);
};
