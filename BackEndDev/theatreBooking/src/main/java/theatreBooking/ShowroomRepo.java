package theatreBooking;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ShowroomRepo extends JpaRepository<Showroom, Long> {



} 