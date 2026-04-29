package theatreBooking;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentCardRepo extends JpaRepository<PaymentCard, Long> {
    List<PaymentCard> findByCustomerId(Long customerId);
}