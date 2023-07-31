import Movie from "../models/movie.model";
import {
  dbCreateMovieWithImage,
  dbDeleteMovieById,
  dbEditMovieById,
  dbGetMovieByName,
  dbGetMovies,
  dbGetMoviesAdmin
} from "../models/movie.model";

export const createMovie = async (req, res) => {
  const newMovie = {
    title: req.body.title,
    decription: req.body.decription,
    stock: Number(req.body.stock),
    rental_price: Number(req.body.rental_price),
    sale_price: Number(req.body.sale_price),
    availability: !!req.body.availability,
    likes: 0,
  };
  const images = req.files;
  const movie = await dbCreateMovieWithImage(newMovie, images);
  if (!movie) return res.status(500).json({ message: "Something went wrong" });
  return res.status(201).json(movie);
};

/**
 * Get all movies with pagination and order for users
 * @param {number} page
 * @param {number} limit
 * @param {string} orderBy
 * @returns {array} movies
 * @description This function return an array of movies with pagination and order
 */
export const getMovies = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const orderBy = req.query.orderBy || "title";
  const movies = await dbGetMovies(page, limit, orderBy);
  if (!movies) return res.status(500).json({ message: "Something went wrong" });
  res.json(movies);
};

/**
 * Get all movies with pagination and order for admin
 * @param {number} page
 * @param {number} limit
 * @param {string} orderBy
 * @param {boolean} availability
 * @returns {array} movies
 * @description This function return an array of movies with pagination and order
 * and filter by availability
 * if availability is true return only available movies
 * if availability is false return only unavailable movies
 * if availability is null return all movies
 */
export const getMoviesAdmin = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const orderBy = req.query.orderBy || "title";
  console.log(req.query.availability);
  if (req.query.availability === "true") {
    var availability = true;
  } else if (req.query.availability === "false") {
    var availability = false;
  } else {
    var availability = null;
  }
  const movies = await dbGetMoviesAdmin(page, limit, orderBy, availability);
  if (!movies) return res.status(500).json({ message: "Something went wrong" });
  res.json(movies);
};

export const getMovieById = async (req, res) => {
  const id = req.params.movieId;
  const docsSnapshot = await Movie.doc(id).get();
  const movie = docsSnapshot.data();
  res.json(movie);
};

/**
 * Get movie by name if the movie is not found return null
 * @param {string} name
 * @returns {Object | null} movie
 * @description This function return a movie object with availability true
 */
export const getMovieByName = async (req, res) => {
  const name = req.params.movieName;
  const movie = await dbGetMovieByName(name);
  if (!movie) return res.status(404).json({ message: "Movie not found" });
  res.json(movie);
};

export const updateMovieById = async (req, res) => {
  const id = req.params.movieId;
  const movie = {
    title: req.body.title,
    decription: req.body.decription,
    stock: Number(req.body.stock),
    rental_price: Number(req.body.rental_price),
    sale_price: Number(req.body.sale_price),
    availability: !!req.body.availability,
    likes: Number(req.body.likes),
  };
  const images = req.files;
  const response = await dbEditMovieById(id, movie, images);
  if (!response) return res.status(404).json({ message: "Movie not found" });
  res.json(response);
};

export const deleteMovieById = async (req, res) => {
  const id = req.params.movieId;
  const response = await dbDeleteMovieById(id);
  if (!response) return res.status(404).json({ message: "Movie not found" });
  res.json({ message: "Movie deleted successfully" });
};
