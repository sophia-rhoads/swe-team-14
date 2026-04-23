package theatreBooking;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SeatLockService {

    public static final int LOCK_MINUTES = 5;

    private final SeatLockRepo seatLockRepo;
    private final SeatRepo seatRepo;

    public SeatLockService(SeatLockRepo seatLockRepo, SeatRepo seatRepo) {
        this.seatLockRepo = seatLockRepo;
        this.seatRepo = seatRepo;
    }

    @Transactional
    public SeatLockResult lockSeats(Long showtimeId, List<String> seatNumbers, Long userId) {

        String sessionToken = UUID.randomUUID().toString();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(LOCK_MINUTES);

        for (String seatNumber : seatNumbers) {

            seatRepo.findByShowtimeIdAndSeatNumber(showtimeId, seatNumber)
                    .ifPresent(seat -> {
                        if (seat.isBooked()) {
                            throw new RuntimeException(
                                    "Seat " + seatNumber + " has already been booked.");
                        }
                    });

            Optional<SeatLock> existing = seatLockRepo.findByShowtimeIdAndSeatNumber(showtimeId, seatNumber);

            if (existing.isPresent()) {
                SeatLock lock = existing.get();
                if (!lock.getUserId().equals(userId) && !lock.isExpired()) {
                    throw new RuntimeException(
                            "Seat " + seatNumber + " is currently reserved by another customer. " +
                                    "Please choose a different seat.");
                }
                seatLockRepo.delete(lock);
                seatLockRepo.flush();
            }

            seatLockRepo.save(
                    new SeatLock(showtimeId, seatNumber, userId, sessionToken, expiresAt));
        }

        return new SeatLockResult(sessionToken, expiresAt);
    }

    // Release all locks belonging to a sessionToken (abandon or payment success).
    @Transactional
    public void releaseByToken(String sessionToken) {
        seatLockRepo.deleteAll(seatLockRepo.findBySessionToken(sessionToken));
    }

    // All seat numbers currently locked (non-expired) for a showtime.
    @Transactional(readOnly = true)
    public List<String> getLockedSeats(Long showtimeId) {
        return seatLockRepo.findByShowtimeId(showtimeId).stream()
                .filter(l -> !l.isExpired())
                .map(SeatLock::getSeatNumber)
                .toList();
    }

    // Seat numbers locked by a specific session token (still valid).
    @Transactional(readOnly = true)
    public List<String> getLockedSeatsByToken(String sessionToken) {
        return seatLockRepo.findBySessionToken(sessionToken).stream()
                .filter(l -> !l.isExpired())
                .map(SeatLock::getSeatNumber)
                .toList();
    }

    // Expiry time for this session token, or null if no valid locks exist.
    @Transactional(readOnly = true)
    public LocalDateTime getLockExpiry(String sessionToken) {
        return seatLockRepo.findBySessionToken(sessionToken).stream()
                .filter(l -> !l.isExpired())
                .map(SeatLock::getExpiresAt)
                .findFirst()
                .orElse(null);
    }

    public record SeatLockResult(String sessionToken, LocalDateTime expiresAt) {
    }
}