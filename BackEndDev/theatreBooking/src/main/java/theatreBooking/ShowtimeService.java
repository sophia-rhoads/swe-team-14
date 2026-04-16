package theatreBooking;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ShowtimeService {

    private final ShowtimeRepo showtimeRepo;
    private final MovieRepo movieRepo;

    public ShowtimeService(ShowtimeRepo showtimeRepo, MovieRepo movieRepo) {
        this.showtimeRepo = showtimeRepo;
        this.movieRepo = movieRepo;
    }

    public List<Showtime> getAllShowtimes() {
        return showtimeRepo.findAllByOrderByShowDateAscShowTimeAsc();
    }

    public Showtime addShowtime(Showtime showtime) {
        if (showtime.getMovie() == null || showtime.getMovie().getId() == null) {
            throw new RuntimeException("Movie is required");
        }

        Movie movie = movieRepo.findById(showtime.getMovie().getId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        boolean conflict = showtimeRepo.existsByShowDateAndShowTimeAndShowroom(
                showtime.getShowDate(),
                showtime.getShowTime(),
                showtime.getShowroom());

        if (conflict) {
            throw new RuntimeException("Showtime conflict: same showroom and same time already exist");
        }

        showtime.setMovie(movie);
        return showtimeRepo.save(showtime);
    }
}