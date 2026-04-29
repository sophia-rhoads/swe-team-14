package theatreBooking;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seats")
@CrossOrigin(origins = "http://localhost:4200")
public class SeatLockController {

    private final SeatLockService seatLockService;

    public SeatLockController(SeatLockService seatLockService) {
        this.seatLockService = seatLockService;
    }

    @PostMapping("/lock")
    public ResponseEntity<?> lockSeats(@RequestBody LockRequest req) {
        try {
            SeatLockService.SeatLockResult result = seatLockService.lockSeats(req.showtimeId(), req.seatNumbers(),
                    req.userId());
            return ResponseEntity.ok(new LockResponse(result.sessionToken(), result.expiresAt()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @DeleteMapping("/lock/{sessionToken}")
    public ResponseEntity<?> releaseLocks(@PathVariable String sessionToken) {
        seatLockService.releaseByToken(sessionToken);
        return ResponseEntity.ok("Seat locks released");
    }

    @GetMapping("/locked/{showtimeId}")
    public ResponseEntity<Map<String, Object>> getLockedSeats(@PathVariable Long showtimeId) {
        List<String> locked = seatLockService.getLockedSeats(showtimeId);
        return ResponseEntity.ok(Map.of("lockedSeats", locked));
    }

    @GetMapping("/lock/status/{sessionToken}")
    public ResponseEntity<?> getLockStatus(@PathVariable String sessionToken) {
        LocalDateTime expiry = seatLockService.getLockExpiry(sessionToken);
        if (expiry == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No active lock found for this session");
        }
        return ResponseEntity.ok(new LockStatusResponse(sessionToken, expiry));
    }

    // DTOs
    public record LockRequest(Long showtimeId, List<String> seatNumbers, Long userId) {
    }

    public record LockResponse(
            String sessionToken,
            @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime expiresAt) {
    }

    public record LockStatusResponse(
            String sessionToken,
            @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime expiresAt) {
    }
}