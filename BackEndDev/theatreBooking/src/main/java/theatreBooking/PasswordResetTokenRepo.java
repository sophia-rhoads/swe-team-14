package theatreBooking;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface PasswordResetTokenRepo extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    // Used by TokenCleanupService to find all password-reset tokens whose expiry
    // has passed
    List<PasswordResetToken> findAllByExpiryDateBefore(LocalDateTime cutoff);

    default List<PasswordResetToken> findAllExpiredBefore(LocalDateTime cutoff) {
        return findAllByExpiryDateBefore(cutoff);
    }
}