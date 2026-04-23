package theatreBooking;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TokenCleanUpService {

    private final ActivationTokenRepo activationTokenRepo;
    private final PasswordResetTokenRepo passwordResetTokenRepo;
    private final SeatLockRepo seatLockRepo;

    public TokenCleanUpService(ActivationTokenRepo activationTokenRepo,
            PasswordResetTokenRepo passwordResetTokenRepo,
            SeatLockRepo seatLockRepo) {
        this.activationTokenRepo = activationTokenRepo;
        this.passwordResetTokenRepo = passwordResetTokenRepo;
        this.seatLockRepo = seatLockRepo;
    }

    @Scheduled(fixedRate = 3_600_000)
    @Transactional
    public void purgeExpiredActivationTokens() {
        List<ActivationToken> expired = activationTokenRepo.findAllExpiredBefore(LocalDateTime.now());
        if (!expired.isEmpty())
            activationTokenRepo.deleteAll(expired);
    }

    @Scheduled(fixedRate = 3_600_000)
    @Transactional
    public void purgeExpiredPasswordResetTokens() {
        List<PasswordResetToken> expired = passwordResetTokenRepo.findAllExpiredBefore(LocalDateTime.now());
        if (!expired.isEmpty())
            passwordResetTokenRepo.deleteAll(expired);
    }

    @Scheduled(fixedRate = 30_000)
    @Transactional
    public void purgeExpiredSeatLocks() {
        List<SeatLock> expired = seatLockRepo.findAllByExpiresAtBefore(LocalDateTime.now());
        if (!expired.isEmpty())
            seatLockRepo.deleteAll(expired);
    }
}