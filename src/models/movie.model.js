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
    console.log(error);
    return null;
  }
};

export default usersRef;
