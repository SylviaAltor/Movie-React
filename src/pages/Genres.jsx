import { useState, useEffect } from "react";
import { getGenres, getMoviesByGenre } from "../services/api";
import MovieCard from "../components/MovieCard";
// import "../css/GenrePage.css"; // No css yet

function Genre() {
  const [genres, setGenres] = useState([]); 
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genreList = await getGenres();
        setGenres(genreList);
      } catch (err) {
        console.log(err);
        setError("Failed to load genres...");
      }
    };

    loadGenres();
  }, []);

  useEffect(() => {
    const loadMoviesByGenre = async () => {
      if (!selectedGenre) return;

      setLoading(true);
      try {
        const genreMovies = await getMoviesByGenre(selectedGenre);
        setMovies(genreMovies);
      } catch (err) {
        console.log(err);
        setError("Failed to load movies...");
      } finally {
        setLoading(false);
      }
    };

    loadMoviesByGenre();
  }, [selectedGenre]);

  const handleGenreSelect = (e) => {
    setSelectedGenre(e.target.value);
  };

  return (
    <div className="genre-page">
      <h1>Select a Genre</h1>

      {/* Select Genre */}
      <select onChange={handleGenreSelect} value={selectedGenre}>
        <option value="">-- Select Genre --</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      {/* Error */}
      {error && <div className="error-message">{error}</div>}

      {/*Loading */}
      {loading && <div className="loading">Loading movies...</div>}

      {/* Show the list */}
      {!loading && !error && selectedGenre && (
        <div className="movies-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Genre;