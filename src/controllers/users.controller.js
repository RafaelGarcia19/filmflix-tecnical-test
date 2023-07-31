import user from "../models/user.model";
import {
  dbAddLikedMovie,
  dbIsMovieLiked,
  dbRemoveLikedMovie,
} from "../models/user.model";
import {
  dbAddLikeToMovieById,
  dbRemoveLikeToMovieById,
} from "../models/movie.model";

export const getAllUsers = async (req, res) => {
  const docsSnapshot = await user.get();
  const users = docsSnapshot.docs.map((doc) => doc.data());
  res.status(200).json(users);
};

/**
 * Add liked movie to user and add like to movie
 * @param { Request } req
 * @param { Response } res
 * @returns { Promise<Response> }
 * @description Add liked movie to user and add like to movie
 */
export const addLikedMovie = async (req, res) => {
  const { idmovie } = req.body;
  const userId = req.user.id;
  if (!idmovie)
    return res.status(400).json({ message: "Movie id is required" });
  const isLiked = await dbIsMovieLiked(idmovie, userId);
  if (isLiked) return res.status(400).json({ message: "Movie already liked" });
  const movie = await dbAddLikeToMovieById(idmovie);
  if (!movie) return res.status(400).json({ message: "Movie not found" });
  const user = await dbAddLikedMovie(movie.movieRef, userId);
  if (!user) return res.status(400).json({ message: "User not found" });
  res.status(200).json(user);
};

/**
 * Remove liked movie from user and remove like from movie
 * @param { Request } req
 * @param { Response } res
 *  @returns { Promise<Response> }
 * @description Remove liked movie from user and remove like from movie
 */
export const removeLikedMovie = async (req, res) => {
  const { idmovie } = req.body;
  const userId = req.user.id;
  console.log(`idmovie: ${idmovie}, userId: ${userId}`);
  if (!idmovie)
    return res.status(400).json({ message: "Movie id is required" });
  const isLiked = await dbIsMovieLiked(idmovie, userId);
  if (!isLiked) return res.status(400).json({ message: "Movie not liked" });
  const movie = await dbRemoveLikedMovie(idmovie, userId);
  if (!movie) return res.status(400).json({ message: "Movie not found" });
  const user = await dbRemoveLikeToMovieById(idmovie);
  if (!user) return res.status(400).json({ message: "User not found" });
  res.status(200).json(user);
};
