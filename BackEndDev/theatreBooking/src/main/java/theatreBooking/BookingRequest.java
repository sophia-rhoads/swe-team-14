package theatreBooking;

import java.time.LocalDate;
import java.util.List;

public class BookingRequest {
    private Long userId;
    private Long movieId;
    private Long showtimeId;
    private LocalDate showDate;
    private String showTime;
    private Integer adultTickets;
    private Integer childTickets;
    private Integer seniorTickets;
    private List<String> seatNumbers;
    private String confirmationEmail;
    private String promoCode;
    private PaymentDetailsRequest payment;
    private String sessionToken;

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

    public Long getShowtimeId() {
        return showtimeId;
    }

    public void setShowtimeId(Long showtimeId) {
        this.showtimeId = showtimeId;
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

    public void setAdultTickets(Integer v) {
        this.adultTickets = v;
    }

    public Integer getChildTickets() {
        return childTickets;
    }

    public void setChildTickets(Integer v) {
        this.childTickets = v;
    }

    public Integer getSeniorTickets() {
        return seniorTickets;
    }

    public void setSeniorTickets(Integer v) {
        this.seniorTickets = v;
    }

    public List<String> getSeatNumbers() {
        return seatNumbers;
    }

    public void setSeatNumbers(List<String> v) {
        this.seatNumbers = v;
    }

    public String getConfirmationEmail() {
        return confirmationEmail;
    }

    public void setConfirmationEmail(String v) {
        this.confirmationEmail = v;
    }

    public String getPromoCode() {
        return promoCode;
    }

    public void setPromoCode(String promoCode) {
        this.promoCode = promoCode;
    }

    public PaymentDetailsRequest getPayment() {
        return payment;
    }

    public void setPayment(PaymentDetailsRequest p) {
        this.payment = p;
    }

    public String getSessionToken() {
        return sessionToken;
    }

    public void setSessionToken(String v) {
        this.sessionToken = v;
    }
}
