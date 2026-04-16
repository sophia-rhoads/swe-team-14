package theatreBooking;

import java.time.LocalDate;
import java.util.List;

public class BookingRequest {
    private Long userId;
    private Long movieId;
    private LocalDate showDate;
    private String showTime;
    private Integer adultTickets;
    private Integer childTickets;
    private Integer seniorTickets;
    private List<String> seatNumbers;
    private String confirmationEmail;
    private PaymentDetailsRequest payment;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public LocalDate getShowDate() {
        return showDate;
    }

    public void setShowDate(LocalDate showDate) {
        this.showDate = showDate;
    }

    public String getShowTime() {
        return showTime;
    }

    public void setShowTime(String showTime) {
        this.showTime = showTime;
    }

    public Integer getAdultTickets() {
        return adultTickets;
    }

    public void setAdultTickets(Integer adultTickets) {
        this.adultTickets = adultTickets;
    }

    public Integer getChildTickets() {
        return childTickets;
    }

    public void setChildTickets(Integer childTickets) {
        this.childTickets = childTickets;
    }

    public Integer getSeniorTickets() {
        return seniorTickets;
    }

    public void setSeniorTickets(Integer seniorTickets) {
        this.seniorTickets = seniorTickets;
    }

    public List<String> getSeatNumbers() {
        return seatNumbers;
    }

    public void setSeatNumbers(List<String> seatNumbers) {
        this.seatNumbers = seatNumbers;
    }

    public String getConfirmationEmail() {
        return confirmationEmail;
    }

    public void setConfirmationEmail(String confirmationEmail) {
        this.confirmationEmail = confirmationEmail;
    }

    public PaymentDetailsRequest getPayment() {
        return payment;
    }

    public void setPayment(PaymentDetailsRequest payment) {
        this.payment = payment;
    }
}