import { db, storage } from "../database";

const usersRef = db.collection("movies");

export const dbMovies = async () => {
  const docsSnapshot = await usersRef.get();
  const movies = docsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return movies;
};

export const dbCreateMovieWithImage = async (movie, images) => {
  try {
    const docRef = await usersRef.add(movie);
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

export const dbDeleteMovieById = async (id) => {
  try {
    const docRef = usersRef.doc(id);
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
    const docsSnapshot = await usersRef
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
    const docRef = usersRef.doc(id);
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

export default usersRef;
