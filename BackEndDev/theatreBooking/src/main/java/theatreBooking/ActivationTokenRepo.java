package theatreBooking;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ActivationTokenRepo extends JpaRepository<ActivationToken, Long> {

    Optional<ActivationToken> findByToken(String token);

    List<ActivationToken> findAllByExpiryDateBefore(LocalDateTime cutoff);

    // Convenience method for TokenCleanupService to call. --- IGNORE ---
    default List<ActivationToken> findAllExpiredBefore(LocalDateTime cutoff) {
        return findAllByExpiryDateBefore(cutoff);
    }
}