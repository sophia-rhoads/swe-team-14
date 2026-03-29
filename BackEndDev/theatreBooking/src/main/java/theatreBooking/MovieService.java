package theatreBooking;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {

    private final MovieRepo movieRepo;

    public MovieService(MovieRepo movieRepo) {
        this.movieRepo = movieRepo;
    }

    public List<Movie> getAllMovies() {
        return movieRepo.findAll();
    }

    public Movie getMovieById(Long id) {
        return movieRepo.findById(id).orElseThrow(() -> new RuntimeException("Movie not found"));
    }

    public List<Movie> searchByTitle(String title) {
        return movieRepo.findByTitleContainingIgnoreCase(title);
    }

    public List<Movie> filterByGenre(String genre) {
        return movieRepo.findByGenreIgnoreCase(genre);
    }

    public List<Movie> getByStatus(String status) {
        return movieRepo.findByStatusIgnoreCase(status);
    }
}