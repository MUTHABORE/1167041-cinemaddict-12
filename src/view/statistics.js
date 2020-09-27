import AbstractView from './abstract.js';
import {StatisticsPeriod} from '../util/const.js';
import {remove, render} from '../util/render.js';
import {getTotalFilmsDuration, getTopGenre, getAllGenres} from '../util/statistics.js';
import {getProfileRating} from '../util/profile.js';
import moment from 'moment';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const renderGenresChart = (statisticCtx, films) => {
  const BAR_HEIGHT = 50;
  const genres = Object.keys(getAllGenres(films));
  const genresCounts = Object.values(getAllGenres(films));

  statisticCtx.height = BAR_HEIGHT * genres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres,
      datasets: [{
        data: genresCounts,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatisticTemplate = (data, films) => {
  const totalDuration = getTotalFilmsDuration(data.watchedFilms);
  const profileRating = getProfileRating(films);

  const totalDurationHours = Math.floor(totalDuration / 60);
  const totalDurationMinutes = totalDuration % 60;
  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${profileRating}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${data.currentPeriod === StatisticsPeriod.ALL_TIME ? `checked` : ``}>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${data.currentPeriod === StatisticsPeriod.TODAY ? `checked` : ``}>
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${data.currentPeriod === StatisticsPeriod.WEEK ? `checked` : ``}>
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${data.currentPeriod === StatisticsPeriod.MONTH ? `checked` : ``}>
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${data.currentPeriod === StatisticsPeriod.YEAR ? `checked` : ``}>
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${data.watchedFilms.length} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text"> ${totalDurationHours} <span class="statistic__item-description">h</span> ${totalDurationMinutes} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${getTopGenre(data.watchedFilms)}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
    </section>`
  );
};

export default class Statistic extends AbstractView {
  constructor(films, container) {
    super();

    this._films = films;
    this._container = container;

    this._data = {
      watchedFilms: this._films.filter((filter) => filter.filterStatus.watchList),
      currentPeriod: StatisticsPeriod.ALL_TIME,
    };

    this._genresChart = null;

    this._periodChangeHandler = this._periodChangeHandler.bind(this);
    this._setChart = this._setChart.bind(this);
    this._removeElement = this._removeElement.bind(this);
    this._replaceStatistics = this._replaceStatistics.bind(this);
    this._restoreHandlers = this._restoreHandlers.bind(this);

    this._setPeriodChangeHandler();
    this._setChart();
  }

  _getTemplate() {
    return createStatisticTemplate(this._data, this._films);
  }

  _removeElement() {
    remove(this);
    super.removeElement();

    if (this._genresChart !== null) {
      this._genresChart = null;
    }
  }

  _periodChangeHandler(evt) {
    if (evt.target.classList.contains(`statistic__filters-input`)) {
      evt.preventDefault();

      const dateAWeekAgo = moment().subtract(1, `weeks`);
      const dateAMonthAgo = moment().subtract(1, `month`);
      const dateAYearAgo = moment().subtract(1, `years`);

      let update;
      switch (evt.target.value) {
        case StatisticsPeriod.ALL_TIME:
          update = {
            watchedFilms: this._films.filter((film) => film.filterStatus.watchList),
            currentPeriod: StatisticsPeriod.ALL_TIME
          };
          break;
        case StatisticsPeriod.TODAY:
          update = {
            watchedFilms: this._films.filter((film) => film.filterStatus.watchList && moment(film.filterStatus.watchingDate).isSame(new Date(), `day`)),
            currentPeriod: StatisticsPeriod.TODAY
          };
          break;
        case StatisticsPeriod.WEEK:
          update = {
            watchedFilms: this._films.filter((film) => film.filterStatus.watchList && moment(film.filterStatus.watchingDate).isBetween(dateAWeekAgo, new Date())),
            currentPeriod: StatisticsPeriod.WEEK
          };
          break;
        case StatisticsPeriod.MONTH:
          update = {
            watchedFilms: this._films.filter((film) => film.filterStatus.watchList && moment(film.filterStatus.watchingDate).isBetween(dateAMonthAgo, new Date())),
            currentPeriod: StatisticsPeriod.MONTH
          };
          break;
        case StatisticsPeriod.YEAR:
          update = {
            watchedFilms: this._films.filter((film) => film.filterStatus.watchList && moment(film.filterStatus.watchingDate).isBetween(dateAYearAgo, new Date())),
            currentPeriod: StatisticsPeriod.YEAR
          };
          break;
      }

      this._data = update;

      this._replaceStatistics();

      this._setChart();
    }
  }

  _setPeriodChangeHandler() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, this._periodChangeHandler);
  }

  _setChart() {
    if (this._genresChart !== null) {
      this._genresChart = null;
    }

    const statisticCtx = this.getElement().querySelector(`.statistic__chart`);

    this._genresChart = renderGenresChart(statisticCtx, this._data.watchedFilms);
  }

  _restoreHandlers() {
    this._setPeriodChangeHandler();
    this._setChart();
  }

  _replaceStatistics() {
    this._removeElement();
    render(this._container, this);
    this._restoreHandlers();
  }
}
