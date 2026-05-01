package theatreBooking;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ShowtimeService {

    private static final int SHOWROOM_LOCK_HOURS = 4;

    private final ShowtimeRepo showtimeRepo;
    private final MovieRepo movieRepo;
    private final ShowroomRepo showroomRepo;
    private final SeatRepo seatRepo;

    public ShowtimeService(ShowtimeRepo showtimeRepo,
            MovieRepo movieRepo,
            ShowroomRepo showroomRepo,
            SeatRepo seatRepo) {
        this.showtimeRepo = showtimeRepo;
        this.movieRepo = movieRepo;
        this.showroomRepo = showroomRepo;
        this.seatRepo = seatRepo;
    }

    @Transactional
    public ShowtimeResponse createShowtime(ShowtimeRequest request) {

        if (request.getMovieId() == null || request.getRoomId() == null) {
            throw new RuntimeException("Movie and showroom are required");
        }
        if (request.getShowDate() == null || request.getShowDate().isBlank()) {
            throw new RuntimeException("Show date is required");
        }
        if (request.getShowTime() == null || request.getShowTime().isBlank()) {
            throw new RuntimeException("Show time is required");
        }

        Movie movie = movieRepo.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        if (!movie.isActive()) {
            throw new RuntimeException("Cannot schedule a removed movie");
        }

        Showroom room = showroomRepo.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Showroom not found"));

        LocalDate showDate = LocalDate.parse(request.getShowDate());
        LocalTime showTime = LocalTime.parse(request.getShowTime());

        // --- Conflict check 1: exact duplicate ---
        if (showtimeRepo.existsByShowroomRefAndShowDateAndShowTime(room, showDate, showTime)) {
            throw new RuntimeException(
                    "Scheduling conflict: " + room.getName() +
                            " already has a show on " + showDate + " at " + showTime);
        }

        // --- Conflict check 2: 4-hour buffer window ---
        // For each existing showtime in the same showroom on the same date we
        // check:|proposed - existing| < 4 hours → reject
        List<Showtime> sameDayShows = showtimeRepo.findByShowroomRefAndShowDate(room, showDate);
        for (Showtime existing : sameDayShows) {
            long diffMinutes = Math.abs(
                    showTime.toSecondOfDay() - existing.getShowTime().toSecondOfDay()) / 60L;
            if (diffMinutes < SHOWROOM_LOCK_HOURS * 60L) {
                throw new RuntimeException(
                        "Scheduling conflict: " + room.getName() +
                                " already has a show at " + existing.getShowTime().toString().substring(0, 5) +
                                " on " + showDate +
                                ". A minimum gap of " + SHOWROOM_LOCK_HOURS +
                                " hours is required between shows in the same showroom.");
            }
        }

        Showtime showtime = new Showtime();
        showtime.setMovie(movie);
        showtime.setShowroom(room); // setShowroom() → sets showroomRef internally
        showtime.setShowDate(showDate);
        showtime.setShowTime(showTime);

        // Clone template seats (showtime_id IS NULL) for this showroom
        List<Seat> templateSeats = seatRepo.findByShowroomIdAndShowtimeIsNull(room.getId());

        if (templateSeats.isEmpty()) {
            throw new RuntimeException(
                    "No seat templates found for showroom '" + room.getName() +
                            "'. Ensure the application started correctly so DataSeeder ran.");
        }

        List<Seat> seats = new ArrayList<>();
        for (Seat template : templateSeats) {
            Seat seat = new Seat();
            seat.setSeatNumber(template.getSeatNumber());
            seat.setBooked(false);
            seat.setShowroom(room);
            seat.setShowtime(showtime);
            seats.add(seat);
        }

        showtime.setSeats(seats);
        showtime.setTotalSeats(seats.size());

        Showtime saved = showtimeRepo.save(showtime);

        // Re-fetch with full JOIN FETCH so ShowtimeResponse never hits a proxy
        Showtime reloaded = showtimeRepo.findByIdWithAll(saved.getId())
                .orElseThrow(() -> new RuntimeException("Showtime not found after save"));

        return new ShowtimeResponse(reloaded);
    }

    @Transactional(readOnly = true)
    public List<ShowtimeResponse> getAllShowtimes() {
        return showtimeRepo.findAllWithSeats()
                .stream()
                .filter(showtime -> showtime.getMovie().isActive())
                .map(ShowtimeResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ShowtimeResponse> getShowtimesByMovie(Long movieId) {
        return showtimeRepo.findByMovieIdWithSeats(movieId)
                .stream()
                .filter(showtime -> showtime.getMovie().isActive())
                .map(ShowtimeResponse::new)
                .toList();
    }

    @Transactional(readOnly = true)
    public ShowtimeResponse getShowtimeById(Long showtimeId) {
        Showtime showtime = showtimeRepo.findByIdWithAll(showtimeId)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));
        if (!showtime.getMovie().isActive()) {
            throw new RuntimeException("Showtime not found");
        }
        return new ShowtimeResponse(showtime);
    }

    @Transactional
    public void deleteShowtime(Long showtimeId) {
        if (!showtimeRepo.existsById(showtimeId)) {
            throw new RuntimeException("Showtime not found");
        }
        showtimeRepo.deleteById(showtimeId);
    }

    public List<Showroom> getAllShowrooms() {
        return showroomRepo.findAll();
    }
}