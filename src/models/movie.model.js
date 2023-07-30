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
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        if (image.mimetype !== "image/jpeg" && image.mimetype !== "image/png")
          return null;
        const imageRef = storage.file(`movies/${docRef.id}/${Date.now()}`);
        await imageRef.save(image.buffer, { contentType: image.mimetype });
        const imageUrl = await imageRef.getSignedUrl({
          action: "read",
        });
        return imageUrl[0];
      })
    );
    imageUrls.filter((url) => url !== null);
    await docRef.update({ images: imageUrls });
    return { ...movieWithId, images: imageUrls };
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default usersRef;
