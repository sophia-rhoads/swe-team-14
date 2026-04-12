package theatreBooking;

import java.time.LocalDateTime;

import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/showtimes")
public class ShowtimeController {

    private final ShowtimeService showtimeService;

    public ShowtimeController(ShowtimeService showtimeService) {
        this.showtimeService = showtimeService;
    }

    @PostMapping
    public String createShowtime(
        @RequestParam Long movieId,
        @RequestParam Long roomId,
        @RequestParam String time
    ) {
        showtimeService.createShowtime(
            movieId,
            roomId,
            LocalDateTime.parse(time)
        );

        return "Showtime created";
    }



}