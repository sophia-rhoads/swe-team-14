package theatreBooking;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingHistoryRepo extends JpaRepository<BookingHistory, Long> {
    List<BookingHistory> findByCustomerIdOrderByBookedAtDesc(Long customerId);

    boolean existsByMovie_Id(Long movieId);
}