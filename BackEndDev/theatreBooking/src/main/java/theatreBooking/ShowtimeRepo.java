package theatreBooking;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ShowtimeRepo extends JpaRepository<Showtime, Long> {
    boolean existsByShowDateAndShowTimeAndShowroom(LocalDate showDate, LocalTime showTime, String showroom);
    List<Showtime> findAllByOrderByShowDateAscShowTimeAsc();
}