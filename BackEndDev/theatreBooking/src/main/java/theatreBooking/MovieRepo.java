package theatreBooking;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MovieRepo extends JpaRepository<Movie, Long> {
    List<Movie> findByTitleContainingIgnoreCase(String title);

    List<Movie> findByGenreIgnoreCase(String genre);

    List<Movie> findByStatus(MovieStatus status);
}