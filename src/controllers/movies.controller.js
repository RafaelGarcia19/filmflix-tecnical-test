import Movie from "../models/movie.model";
import {
  dbMovies,
  dbCreateMovieWithImage,
  dbDeleteMovieById,
  dbEditMovieById,
  dbGetMovieByName,
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

export const getMovies = async (req, res) => {
  const movies = await dbMovies();
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
