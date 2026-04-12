package theatreBooking;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ShowtimeRepo extends JpaRepository<Showtime, Long> {



}