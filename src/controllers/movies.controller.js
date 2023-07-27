export const createMovie = (req, res) => {
  res.json("creating movie");
};

export const getMovies = (req, res) => {
  res.json("getting movies");
};

export const getMovieById = (req, res) => {
  id = req.params.movieId;
  res.json(`getting movie ${id}`);
};

export const updateMovieById = (req, res) => {
  id = req.params.movieId;
  res.json(`updating movie ${id}`);
};

export const deleteMovieById = (req, res) => {
  id = req.params.movieId;
  res.json(`deleting movie ${id}`);
};
