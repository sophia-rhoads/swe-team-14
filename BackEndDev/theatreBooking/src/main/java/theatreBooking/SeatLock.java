package theatreBooking;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "seat_lock", uniqueConstraints = @UniqueConstraint(columnNames = { "showtime_id", "seat_number" }))
public class SeatLock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "showtime_id", nullable = false)
    private Long showtimeId;

    @Column(name = "seat_number", nullable = false)
    private String seatNumber;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "session_token", nullable = false)
    private String sessionToken;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    public SeatLock() {
    }

    public SeatLock(Long showtimeId, String seatNumber, Long userId,
            String sessionToken, LocalDateTime expiresAt) {
        this.showtimeId = showtimeId;
        this.seatNumber = seatNumber;
        this.userId = userId;
        this.sessionToken = sessionToken;
        this.expiresAt = expiresAt;
    }

    public Long getId() {
        return id;
    }

    public Long getShowtimeId() {
        return showtimeId;
    }

    public void setShowtimeId(Long v) {
        this.showtimeId = v;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String v) {
        this.seatNumber = v;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long v) {
        this.userId = v;
    }

    public String getSessionToken() {
        return sessionToken;
    }

    public void setSessionToken(String v) {
        this.sessionToken = v;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime v) {
        this.expiresAt = v;
    }

    public boolean isExpired() {
        return expiresAt.isBefore(LocalDateTime.now());
    }
}