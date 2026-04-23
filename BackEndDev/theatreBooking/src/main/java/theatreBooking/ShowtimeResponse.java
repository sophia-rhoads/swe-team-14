package theatreBooking;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class ShowtimeResponse {

    private Long id;
    private Long movieId;
    private String movieTitle;
    private Long roomId;
    private String roomName;

    // This frontend expects "YYYY-MM-DD" string for date formatting.
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate showDate;

    // The frontend expects "HH:mm:ss" string for slice(0,5) to work correctly.
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    private LocalTime showTime;

    private List<SeatInfo> seats;

    public ShowtimeResponse(Showtime s) {
        this.id = s.getId();
        this.movieId = s.getMovie().getId();
        this.movieTitle = s.getMovie().getTitle();
        this.roomId = s.getShowroom().getId();
        this.roomName = s.getShowroom().getName();
        this.showDate = s.getShowDate();
        this.showTime = s.getShowTime();
        this.seats = s.getSeats() == null ? List.of()
                : s.getSeats().stream()
                        .map(seat -> new SeatInfo(seat.getId(), seat.getSeatNumber(), seat.isBooked()))
                        .toList();
    }

    public Long getId() {
        return id;
    }

    public Long getMovieId() {
        return movieId;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public Long getRoomId() {
        return roomId;
    }

    public String getRoomName() {
        return roomName;
    }

    public LocalDate getShowDate() {
        return showDate;
    }

    public LocalTime getShowTime() {
        return showTime;
    }

    public List<SeatInfo> getSeats() {
        return seats;
    }

    public record SeatInfo(Long id, String seatNumber, boolean booked) {
    }
}