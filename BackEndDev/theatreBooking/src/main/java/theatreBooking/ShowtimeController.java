package theatreBooking;

import java.time.LocalDateTime;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/showtimes")
@CrossOrigin(origins = "http://localhost:4200") // optional (for Angular)
public class ShowtimeController {

    private final ShowtimeService showtimeService;

    public ShowtimeController(ShowtimeService showtimeService) {
        this.showtimeService = showtimeService;
    }

    @PostMapping
    public String createShowtime(@RequestBody ShowtimeRequest request) {

       // System.out.println("***********createShowtime CALLED");

        showtimeService.createShowtime(
            request.getMovieId(),
            request.getRoomId(),
            LocalDateTime.parse(request.getTime())
        );

        return "Showtime created";
    }
}