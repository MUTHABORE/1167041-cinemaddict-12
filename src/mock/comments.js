import {getRandomInteger} from '../util/utils.js';

const COMMENTS_MAX_AMOUNT = 5;
export const MONTH_DAYS_MAX = 31;
const COMMENTS_MAX_HOURS = 24;
const COMMENTS_MAX_MINUTS = 60;

const MONTHS_NUMBERS = [`01`, `02`, `03`, `04`, `05`, `06`, `07`, `08`, `09`, `10`, `11`, `12`];
const MIN_COMMENT_YEAR = 2007;
const MAX_COMMENT_YEAR = 2020;

const EMOJIS = [`angry.png`, `puke.png`, `sleeping.png`, `smile.png`];
const COMMENT_TEXT = [`Interesting setting and a good cast`, `Booooooooooring`, `Very very old. Meh`, `Almost two hours? Seriously?`];
const COMMENT_AUTHORS = [`Tim Macoveev`, `John Doe`, `Jason Statham`];

export const generateComments = () => {
  const сomments = [];
  for (let i = 0; i < getRandomInteger(0, COMMENTS_MAX_AMOUNT); i++) {
    сomments[i] = {};
    сomments[i].text = COMMENT_TEXT[getRandomInteger(0, COMMENT_TEXT.length - 1)];
    сomments[i].emoji = `./images/emoji/` + EMOJIS[getRandomInteger(0, EMOJIS.length - 1)];
    сomments[i].author = COMMENT_AUTHORS[getRandomInteger(0, COMMENT_AUTHORS.length - 1)];
    сomments[i].commentDate = getRandomInteger(MIN_COMMENT_YEAR, MAX_COMMENT_YEAR) + `/` + MONTHS_NUMBERS[getRandomInteger(0, MONTHS_NUMBERS.length - 1)] + `/` + getRandomInteger(1, MONTH_DAYS_MAX);
    сomments[i].commentTime = ` ` + getRandomInteger(0, COMMENTS_MAX_HOURS) + `:` + getRandomInteger(10, COMMENTS_MAX_MINUTS);
  }
  return сomments;
};

export const similarComments = generateComments();
