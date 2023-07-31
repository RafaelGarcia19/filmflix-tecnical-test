import { db, storage } from "../database";

const moviesRef = db.collection("movies");

/**
 * Get all movies with pagination and order for users from firestore
 * @param {number} page
 * @param {number} pageSize
 * @param {string} orderBy
 * @returns {array} movies
 * @description This function return an array of movies with pagination and order from firestore
 */ 
export const dbGetMovies = async (page, pageSize, orderBy) => {
  try {
    const movieCollectionInfo = await moviesRef.get();
    let moviesRefQuery = moviesRef
      .limit(pageSize)
      .offset((page - 1) * pageSize);
    moviesRefQuery = moviesRefQuery.where("availability", "==", true);
    if ((orderBy = "likes")) {
      moviesRefQuery = moviesRefQuery.orderBy("likes", "desc");
    } else {
      moviesRefQuery = moviesRefQuery.orderBy("title", "asc");
    }
    const docsSnapshot = await moviesRefQuery.get();
    const movies = docsSnapshot.docs.map((doc) => {
      const movie = doc.data();
      return { id: doc.id, ...movie };
    });
    return {
      movies,
      page,
      pageSize,
      total: movies.length,
      totalPages: Math.ceil(movieCollectionInfo.size / pageSize),
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Get all movies with pagination and order for admin from firestore and filter by availability
 * @param {number} page
 * @param {number} pageSize
 * @param {string} orderBy
 * @param {boolean} availability
 * @returns {array} movies
 * @description This function return an array of movies with pagination and order from firestore and filter by availability
 */
export const dbGetMoviesAdmin = async (
  page,
  pageSize,
  orderBy,
  availability
) => {
  try {
    let moviesRefQuery = moviesRef;
    if (typeof availability === "boolean") {
      moviesRefQuery = moviesRefQuery.where("availability", "==", availability);
    }
    if (orderBy === "likes") {
      moviesRefQuery = moviesRefQuery.orderBy("likes", "desc");
    } else {
      moviesRefQuery = moviesRefQuery.orderBy("title", "asc");
    }
    const filteredDocsSnapshot = await moviesRefQuery.get();
    const totalFilteredMovies = filteredDocsSnapshot.size;
    const pageStartIndex = (page - 1) * pageSize;
    const pageEndIndex = pageStartIndex + pageSize;
    const docsSnapshot = await moviesRefQuery.limit(pageEndIndex).get();
    const movies = docsSnapshot.docs.map((doc) => {
      const movie = doc.data();
      return { id: doc.id, ...movie };
    });
    return {
      movies,
      page,
      pageSize,
      total: movies.length,
      totalItems: totalFilteredMovies,
      totalPages: Math.ceil(totalFilteredMovies / pageSize),
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Create a movie in firestore with images in storage and return the movie with id
 * @param {Object} movie
 * @param {array} images
 * @returns {Object | null} movie
 * @description This function return a movie object with id and images url from firestore and storage
 */
export const dbCreateMovieWithImage = async (movie, images) => {
  try {
    const docRef = await moviesRef.add(movie);
    const movieWithId = { id: docRef.id, ...movie };
    const imageStorageRefs = [];
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        if (image.mimetype !== "image/jpeg" && image.mimetype !== "image/png")
          return null;
        const imageStorageName = `movies/${docRef.id}/${Date.now()}`;
        const imageRef = storage.file(imageStorageName);
        await imageRef.save(image.buffer, { contentType: image.mimetype });
        const imageUrl = await imageRef.getSignedUrl({
          action: "read",
          expires: "03-09-2491",
        });
        imageStorageRefs.push(imageStorageName);
        return imageUrl[0];
      })
    );
    imageUrls.filter((url) => url !== null);
    await docRef.update({ images: imageUrls, imageStorageRefs });
    return { ...movieWithId, images: imageUrls, imageStorageRefs };
  } catch (error) {
    return null;
  }
};

/**
 * Delete movie by id from firestore and storage if the movie is not found return null
 * @param {string} id
 * @returns {boolean | null} true
 * @description This function return true if the movie is deleted
 */
export const dbDeleteMovieById = async (id) => {
  try {
    const docRef = moviesRef.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return null;
    const movie = doc.data();
    const imageStorageRefs = movie.imageStorageRefs;
    await Promise.all(
      imageStorageRefs.map(async (imageStorageRef) => {
        const imageRef = storage.file(imageStorageRef);
        await imageRef.delete();
      })
    );
    await docRef.delete();
    return true;
  } catch (error) {
    return null;
  }
};

/**
 * Get availability movie by name if the movie is not found return null
 * @param {string} name
 * @returns {Object | null} movie
 * @description This function return a movie object with availability true
 */
export const dbGetMovieByName = async (name) => {
  try {
    const docsSnapshot = await moviesRef
      .where("title", "==", name)
      .where("availability", "==", true)
      .get();
    if (docsSnapshot.empty) return null;
    const movie = docsSnapshot.docs[0].data();
    return { id: docsSnapshot.docs[0].id, ...movie };
  } catch (error) {
    return null;
  }
};

/**
 * Edit movie by id with new movie data or add new images
 * @param {string} id
 * @param {object} movie
 * @param {array} images
 * @returns {object | null } movie
 */
export const dbEditMovieById = async (id, movie, images) => {
  try {
    const docRef = moviesRef.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return null;
    const movieData = doc.data();
    const imageStorageRefs = movieData.imageStorageRefs;
    const imageUrls = movieData.images;
    if (images) {
      const newImageUrls = await Promise.all(
        images.map(async (image) => {
          if (image.mimetype !== "image/jpeg" && image.mimetype !== "image/png")
            return null;
          const imageStorageName = `movies/${id}/${Date.now()}`;
          const imageRef = storage.file(imageStorageName);
          await imageRef.save(image.buffer, { contentType: image.mimetype });
          const imageUrl = await imageRef.getSignedUrl({
            action: "read",
            expires: "03-09-2491",
          });
          imageStorageRefs.push(imageStorageName);
          return imageUrl[0];
        })
      );
      imageUrls.push(...newImageUrls);
    }
    await docRef.update({
      ...movie,
      images: imageUrls,
      imageStorageRefs,
    });
    return { id, ...movie, images: imageUrls, imageStorageRefs };
  } catch (error) {
    return null;
  }
};

/**
 * Add a like to a movie
 * @param {string} id
 * @returns {object | null} movie
 * @description This function return a movie object with availability true and add a like to the movie if the movie is not found return null
 */
export const dbAddLikeToMovieById = async (id) => {
  try {
    const docRef = moviesRef.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return null;
    const movie = doc.data();
    await docRef.update({ likes: movie.likes + 1 });
    return { id: doc.id, ...movie, likes: movie.likes + 1, movieRef: doc.ref };
  } catch (error) {
    return null;
  }
};

/**
 * Remove a like to a movie
 * @param {string} id
 * @returns {object | null} movie
 * @description This function return a movie object with availability true and remove a like to the movie if the movie is not found return null
 */
export const dbRemoveLikeToMovieById = async (id) => {
  try {
    const docRef = moviesRef.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return null;
    const movie = doc.data();
    await docRef.update({ likes: movie.likes - 1 });
    return { id: doc.id, ...movie, likes: movie.likes - 1 };
  } catch (error) {
    return null;
  }
};



export default moviesRef;
