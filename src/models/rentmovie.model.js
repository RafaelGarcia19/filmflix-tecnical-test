import Movies from "./movie.model";
import Users from "./user.model";
import { db, timestamp } from "../database";

const rentMoviesRef = db.collection("rentMovies");

/**
 * Rent a movie by id and user id from firestore
 * @param {string} id
 * @param {string} userId
 * @returns {object} movie
 * @description This function return a movie from firestore by id and user id
 */
export const dbRentMovie = async (id, userId) => {
  try {
    const movieRef = await Movies.doc(id).get();
    if (!movieRef.exists) return null;
    const userRef = await Users.doc(userId).get();
    if (!userRef.exists) return null;
    const movie = movieRef.data();
    if (movie.availability) {
      const rentMovie = await rentMoviesRef.add({
        movie: movieRef.ref,
        userId: userRef.ref,
        rent_date: timestamp.now(),
        return_date: timestamp.fromDate(
          new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)
        ),
        active: true,
      });
      await Movies.doc(id).update({ stock: movie.stock - 1 });
      const newRentMovie = await rentMovie.get();
      // const newRentDate = newRentMovie.data().rent_date.toDate();
      const newRentData = {
        rent_date: newRentMovie.data().rent_date.toDate(),
        return_date: newRentMovie.data().return_date.toDate(),
      };
      return {
        id: rentMovie.id,
        ...newRentData,
        movie: movieRef.ref,
        userId: userRef.ref,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Return a movie by id and user id from firestore
 * @param {string} rentId
 * @returns {object} movie
 * @description This function return a movie from firestore by id and user id and return the movie
 */
export const dbReturnMovie = async (rentId) => {
  try {
    const rentMovieRef = await rentMoviesRef.doc(rentId).get();
    if (!rentMovieRef.exists) return null;
    const rentMovie = rentMovieRef.data();
    if (rentMovie.active) {
      await rentMovieRef.ref.update({ active: false });
      const movieRef = await rentMovie.movie.get();
      const movie = movieRef.data();
      await Movies.doc(movieRef.id).update({ stock: movie.stock + 1 });
      return { id: rentMovieRef.id, active: false, movie: movieRef.ref };
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Get all active rent movies from firestore
 * @returns {Promise<array>} rentMovies
 * @description This function return all rent movies from firestore
 */
export const dbGetAllActiveRentMovies = async () => {
  try {
    const rentMovies = [];
    const rentMoviesSnapshot = await rentMoviesRef
      .where("active", "==", true)
      .get();
    const response = await Promise.all(
      rentMoviesSnapshot.docs.map(async (doc) => {
        const movieRef = doc.data().movie;
        const userRef = doc.data().userId;

        const [movieSnapshot, userSnapshot] = await Promise.all([
          movieRef.get(),
          userRef.get(),
        ]);

        if (movieSnapshot.exists && userSnapshot.exists) {
          const movieData = movieSnapshot.data();
          const userData = userSnapshot.data();
          console.log(movieData);
          rentMovies.push({
            id: doc.id,
            movie: { id: movieSnapshot.id, name: movieData.title },
            user: { id: userSnapshot.id, name: userData.name },
            rent_date: doc.data().rent_date.toDate(),
            return_date: doc.data().return_date.toDate(),
          });
        }
      })
    );
    return rentMovies;
  } catch (error) {
    console.log(error);
    return [];
  }
};
