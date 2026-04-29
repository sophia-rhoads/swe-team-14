package theatreBooking;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class ShowtimeController {

    private final ShowtimeService showtimeService;

    public ShowtimeController(ShowtimeService showtimeService) {
        this.showtimeService = showtimeService;
    }

    @GetMapping("/api/showrooms")
    public ResponseEntity<List<Showroom>> getShowrooms() {
        return ResponseEntity.ok(showtimeService.getAllShowrooms());
    }

    @GetMapping("/api/showtimes")
    public ResponseEntity<List<ShowtimeResponse>> getAllShowtimes() {
        return ResponseEntity.ok(showtimeService.getAllShowtimes());
    }

    @PostMapping("/api/showtimes")
    public ResponseEntity<?> createShowtime(@RequestBody ShowtimeRequest request) {
        try {
            ShowtimeResponse created = showtimeService.createShowtime(request);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/api/showtimes/movie/{movieId}")
    public ResponseEntity<List<ShowtimeResponse>> getByMovie(@PathVariable Long movieId) {
        return ResponseEntity.ok(showtimeService.getShowtimesByMovie(movieId));
    }

    @GetMapping("/api/showtimes/{showtimeId}")
    public ResponseEntity<?> getById(@PathVariable Long showtimeId) {
        try {
            return ResponseEntity.ok(showtimeService.getShowtimeById(showtimeId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // Admin: remove a showtime (and its associated per-showtime seats via cascade)
    @DeleteMapping("/api/showtimes/{showtimeId}")
    public ResponseEntity<?> deleteShowtime(@PathVariable Long showtimeId) {
        try {
            showtimeService.deleteShowtime(showtimeId);
            return ResponseEntity.ok("Showtime removed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}