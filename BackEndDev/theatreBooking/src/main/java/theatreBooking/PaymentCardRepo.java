package theatreBooking;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentCardRepo extends JpaRepository<PaymentCard, Long> {
}