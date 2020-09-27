import Observer from '../util/observer.js';

export default class MoviesModel extends Observer {
  constructor() {
    super();
    this._movies = [];
  }

  setMovies(updateType, movies) {
    this._movies = movies.slice();
    this._notify(updateType, movies);
  }

  getMovies() {
    return this._movies;
  }

  updateMovie(updateType, update) {
    const index = this._movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting movie`);
    }

    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(movie) {
    const adaptedMovie = Object.assign(
        {},
        movie,
        {
          actors: movie.film_info.actors,
          ageRating: movie.film_info.age_rating,
          originalName: movie.film_info.alternative_title,
          description: movie.film_info.description,
          director: movie.film_info.director,
          genres: movie.film_info.genre,
          poster: movie.film_info.poster,
          releaseDate: new Date(movie.film_info.release.date),
          countries: movie.film_info.release.release_country,
          runtime: movie.film_info.runtime,
          name: movie.film_info.title,
          rating: movie.film_info.total_rating,
          writers: movie.film_info.writers,

          filterStatus: {
            watchingDate: movie.user_details.watching_date,
            watchList: movie.user_details.watchlist,
            history: movie.user_details.already_watched,
            favorites: movie.user_details.favorite,
          }
        }
    );

    delete adaptedMovie.film_info;
    delete adaptedMovie.user_details;

    return adaptedMovie;
  }

  static adaptToServer(movie) {
    const adaptedMovie = Object.assign(
        {},
        movie,
        {
          'film_info': {
            'title': movie.name,
            'age_rating': 6,
            'alternative_title': movie.originalName,
            'description': movie.description,
            'director': movie.director,
            'genre': movie.genres,
            'poster': movie.poster,
            'release': {
              'date': movie.releaseDate,
              'release_country': movie.countries,
            },
            'runtime': movie.runtime,
            'total_rating': movie.rating,
            'writers': movie.writers,
            'actors': movie.actors,
          },
          'user_details': {
            'already_watched': movie.filterStatus.history,
            'favorite': movie.filterStatus.favorites,
            'watching_date': movie.filterStatus.watchingDate,
            'watchlist': movie.filterStatus.watchList,
          }
        }
    );

    delete adaptedMovie.actors;
    delete adaptedMovie.ageRating;
    delete adaptedMovie.originalName;
    delete adaptedMovie.description;
    delete adaptedMovie.director;
    delete adaptedMovie.genres;
    delete adaptedMovie.poster;
    delete adaptedMovie.releaseDate;
    delete adaptedMovie.countries;
    delete adaptedMovie.runtime;
    delete adaptedMovie.name;
    delete adaptedMovie.rating;
    delete adaptedMovie.writers;
    delete adaptedMovie.filterStatus;

    return adaptedMovie;
  }
}
