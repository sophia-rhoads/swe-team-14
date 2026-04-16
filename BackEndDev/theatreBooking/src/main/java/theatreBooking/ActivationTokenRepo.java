package theatreBooking;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ActivationTokenRepo extends JpaRepository<ActivationToken, Long> {
    Optional<ActivationToken> findByToken(String token);
}
