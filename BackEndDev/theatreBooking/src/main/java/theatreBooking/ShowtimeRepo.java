package theatreBooking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface ShowtimeRepo extends JpaRepository<Showtime, Long> {

        boolean existsByShowroomRefAndShowDateAndShowTime(
                        Showroom showroomRef, LocalDate showDate, LocalTime showTime);

        // 4-hour window conflict check (same showroom, same date, time within ±4 hours)
        List<Showtime> findByShowroomRefAndShowDate(Showroom showroomRef, LocalDate showDate);

        @Query("SELECT DISTINCT s FROM Showtime s " +
                        "JOIN FETCH s.movie " +
                        "WHERE s.showDate = :showDate " +
                        "ORDER BY s.showTime ASC")
        List<Showtime> findByShowDateWithMovie(LocalDate showDate);

        // All showtimes for a specific movie
        @Query("SELECT DISTINCT s FROM Showtime s " +
                        "JOIN FETCH s.movie " +
                        "JOIN FETCH s.showroomRef " +
                        "LEFT JOIN FETCH s.seats " +
                        "WHERE s.movie.id = :movieId " +
                        "ORDER BY s.showDate ASC, s.showTime ASC")
        List<Showtime> findByMovieIdWithSeats(Long movieId);

        // All showtimes for admin list view — same eager strategy
        @Query("SELECT DISTINCT s FROM Showtime s " +
                        "JOIN FETCH s.movie " +
                        "JOIN FETCH s.showroomRef " +
                        "LEFT JOIN FETCH s.seats " +
                        "ORDER BY s.showDate ASC, s.showTime ASC")
        List<Showtime> findAllWithSeats();

        // Single showtime with all associations — used by booking page seat map
        @Query("SELECT DISTINCT s FROM Showtime s " +
                        "JOIN FETCH s.movie " +
                        "JOIN FETCH s.showroomRef " +
                        "LEFT JOIN FETCH s.seats " +
                        "WHERE s.id = :showtimeId")
        Optional<Showtime> findByIdWithAll(Long showtimeId);

        // Kept for delete/exists checks
        List<Showtime> findByMovieIdOrderByShowDateAscShowTimeAsc(Long movieId);

        List<Showtime> findAllByOrderByShowDateAscShowTimeAsc();
}
