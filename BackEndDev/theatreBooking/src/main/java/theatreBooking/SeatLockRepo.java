package theatreBooking;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SeatLockRepo extends JpaRepository<SeatLock, Long> {
    Optional<SeatLock> findByShowtimeIdAndSeatNumber(Long showtimeId, String seatNumber);

    List<SeatLock> findBySessionToken(String sessionToken);

    List<SeatLock> findByUserIdAndShowtimeId(Long userId, Long showtimeId);

    List<SeatLock> findAllByExpiresAtBefore(LocalDateTime cutoff);

    List<SeatLock> findByShowtimeId(Long showtimeId);

    void deleteByShowtimeId(Long showtimeId);
}