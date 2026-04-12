package theatreBooking;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

@Service
public class ShowtimeService {

    private final ShowtimeRepo showtimeRepo;
    private final MovieRepo movieRepo;
    private final ShowroomRepo showroomRepo;

    public ShowtimeService(ShowtimeRepo showtimeRepo,
                           MovieRepo movieRepo,
                           ShowroomRepo showroomRepo) {
        this.showtimeRepo = showtimeRepo;
        this.movieRepo = movieRepo;
        this.showroomRepo = showroomRepo;
    }

    public void createShowtime(Long movieId, Long roomId, LocalDateTime time) {

        Movie movie = movieRepo.findById(movieId)
            .orElseThrow(() -> new RuntimeException("Movie not found"));

        Showroom room = showroomRepo.findById(roomId)
            .orElseThrow(() -> new RuntimeException("Room not found"));

        Showtime showtime = new Showtime();
        showtime.setMovie(movie);
        showtime.setShowRoom(room);
        showtime.setTime(time);
        showtime.setTotalSeats(room.setTotalSeats()); 

        showtimeRepo.save(showtime);
    }
}
