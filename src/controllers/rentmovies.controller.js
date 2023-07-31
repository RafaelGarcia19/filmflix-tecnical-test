import { dbRentMovie,dbReturnMovie } from '../models/rentmovie.model'

/**
 * Rent a movie by id and user id from firestore
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<Object>}
 * @description This function return a movie from firestore by id and user id
 */
export const rentMovie = async (req, res) => {
    const { id } = req.body;
    const userId = req.user.id;
    const movie = await dbRentMovie(id, userId);
    if (!movie) {
        return res.status(400).json({ message: "Movie not found" });
    }
    return res.status(200).json(movie);
};

/**
 * Return a movie by id and user id from firestore
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<Object>}
 * @description This function return a movie from firestore by id and user id and return the movie
 */
export const returnMovie = async (req, res) => {
    const { id } = req.body;
    const userId = req.user.id;
    const movie = await dbReturnMovie(id, userId);
    if (!movie) {
        return res.status(400).json({ message: "Rent Movie not found" });
    }
    return res.status(200).json(movie);
}