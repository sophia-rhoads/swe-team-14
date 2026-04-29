package theatreBooking;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SeatRepo extends JpaRepository<Seat, Long> {

    List<Seat> findByShowtimeId(Long showtimeId);

    Optional<Seat> findByShowtimeIdAndSeatNumber(Long showtimeId, String seatNumber);

    List<Seat> findByShowroomIdAndShowtimeIsNull(Long showroomId);
}