import {getRandomInteger} from '../util/common.js';

const COMMENTS_MAX_AMOUNT = 4;
const COMMENTS_MAX_HOURS = 24;
const COMMENTS_MAX_MINUTS = 60;

const MONTHS = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `November`, `December`];
const MONTH_DAYS_MAX = 31;
const MIN_COMMENT_YEAR = 2007;
const MAX_COMMENT_YEAR = 2020;

const EMOJIS = [`angry.png`, `puke.png`, `sleeping.png`, `smile.png`];
const COMMENT_TEXT = [`Interesting setting and a good cast`, `Booooooooooring`, `Very very old. Meh`, `Almost two hours? Seriously?`];
const COMMENT_AUTHORS = [`Tim Macoveev`, `John Doe`, `Jason Statham`];

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

export const generateComments = () => {
  const comments = [];
  const commentsAmount = getRandomInteger(0, COMMENTS_MAX_AMOUNT);
  for (let i = 0; i < commentsAmount; i++) {
    comments[i] = {};
    comments[i].id = generateId();
    comments[i].id = generateId();
    comments[i].text = COMMENT_TEXT[getRandomInteger(0, COMMENT_TEXT.length - 1)];
    comments[i].emoji = EMOJIS[getRandomInteger(0, EMOJIS.length - 1)];
    comments[i].author = COMMENT_AUTHORS[getRandomInteger(0, COMMENT_AUTHORS.length - 1)];
    comments[i].date = new Date(getRandomInteger(MIN_COMMENT_YEAR, MAX_COMMENT_YEAR), getRandomInteger(0, MONTHS.length), getRandomInteger(0, MONTH_DAYS_MAX), getRandomInteger(0, COMMENTS_MAX_HOURS), getRandomInteger(0, COMMENTS_MAX_MINUTS));
  }
  return comments;
};

export const similarComments = generateComments();
