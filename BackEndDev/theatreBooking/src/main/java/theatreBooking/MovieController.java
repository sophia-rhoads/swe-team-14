package theatreBooking;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:4200")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }

    @GetMapping("/{id}")
    public Movie getMovieById(@PathVariable Long id) {
        return movieService.getMovieById(id);
    }

    @GetMapping("/search")
    public List<Movie> searchMovies(@RequestParam String title) {
        return movieService.searchByTitle(title);
    }

    @GetMapping("/filter")
    public List<Movie> filterMovies(@RequestParam String genre) {
        return movieService.filterByGenre(genre);
    }

    @GetMapping("/status")
    public List<Movie> getByStatus(@RequestParam String status) {
        return movieService.getByStatus(status);
    }

    //newly added post method for controller
    @PostMapping("/post")
    public Movie postMethodName(@RequestBody Movie newMovie) {
        // Movie newMovie = movieService.addMovie(null)
        return movieService.addMovie(newMovie);
    }
    
}