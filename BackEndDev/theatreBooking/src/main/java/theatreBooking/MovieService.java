package theatreBooking;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class MovieService {

    private final MovieRepo movieRepo;
    private final ShowtimeRepo showtimeRepo;

    public MovieService(MovieRepo movieRepo, ShowtimeRepo showtimeRepo) {
        this.movieRepo = movieRepo;
        this.showtimeRepo = showtimeRepo;
    }

    public List<Movie> getAllMovies() {
        return movieRepo.findAll().stream()
                .filter(Movie::isActive)
                .toList();
    }

    public Movie getMovieById(Long id) {
        return movieRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
    }

    public List<Movie> searchByTitle(String title) {
        return movieRepo.findByTitleContainingIgnoreCase(title).stream()
                .filter(Movie::isActive)
                .toList();
    }

    public List<Movie> filterByGenre(String genre) {
        return movieRepo.findByGenreIgnoreCase(genre).stream()
                .filter(Movie::isActive)
                .toList();
    }

    public List<Movie> getByStatus(String status) {
        return movieRepo.findByStatus(MovieStatus.valueOf(status.toUpperCase())).stream()
                .filter(Movie::isActive)
                .toList();
    }

    public List<Movie> searchByShowDate(String showDate) {
        LocalDate date = LocalDate.parse(showDate);
        return showtimeRepo.findByShowDateWithMovie(date).stream()
                .map(Showtime::getMovie)
                .filter(Movie::isActive)
                .distinct()
                .toList();
    }

    public Movie addMovie(Movie movie) {
        if (movie.getTitle() == null || movie.getTitle().isBlank()) {
            throw new RuntimeException("Movie title is required");
        }
        if (movie.getStatus() == null) {
            throw new RuntimeException("Movie status is required");
        }
        return movieRepo.save(movie);
    }

    public Movie updateMovie(Long id, Movie request) {
        Movie movie = getMovieById(id);
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            throw new RuntimeException("Movie title is required");
        }
        if (request.getStatus() == null) {
            throw new RuntimeException("Movie status is required");
        }

        movie.setTitle(request.getTitle());
        movie.setGenre(request.getGenre());
        movie.setMpaaRating(request.getMpaaRating());
        movie.setImdbRating(request.getImdbRating());
        movie.setDirector(request.getDirector());
        movie.setProducer(request.getProducer());
        movie.setDescription(request.getDescription());
        movie.setTrailerUrl(request.getTrailerUrl());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setStatus(request.getStatus());
        return movieRepo.save(movie);
    }

    public void deleteMovie(Long id) {
        Movie movie = movieRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        movie.setActive(false);
        movieRepo.save(movie);
    }
}
