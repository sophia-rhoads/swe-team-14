package theatreBooking;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingResponse {
    private Long id;
    private String bookingReference;
    private String movieTitle;
    private String posterUrl;
    private LocalDate showDate;
    private String showTime;
    private Integer adultTickets;
    private Integer childTickets;
    private Integer seniorTickets;
    private Integer totalTickets;
    private String seatNumbers;
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal discountAmount;
    private String promoCode;
    private BigDecimal totalAmount;
    private String confirmationEmail;
    private String paymentStatus;
    private String paymentCardBrand;
    private String paymentCardLast4;
    private String paymentApprovalCode;
    private String qrCodeDataUrl;
    private LocalDateTime bookedAt;

    public BookingResponse(BookingHistory bookingHistory) {
        this.id = bookingHistory.getId();
        this.bookingReference = bookingHistory.getBookingReference();
        this.movieTitle = bookingHistory.getMovie().getTitle();
        this.posterUrl = bookingHistory.getMovie().getPosterUrl();
        this.showDate = bookingHistory.getShowDate();
        this.showTime = bookingHistory.getShowTime();
        this.adultTickets = bookingHistory.getAdultTickets();
        this.childTickets = bookingHistory.getChildTickets();
        this.seniorTickets = bookingHistory.getSeniorTickets();
        this.totalTickets = bookingHistory.getTotalTickets();
        this.seatNumbers = bookingHistory.getSeatNumbers();
        this.subtotal = bookingHistory.getSubtotal();
        this.taxAmount = bookingHistory.getTaxAmount();
        this.discountAmount = bookingHistory.getDiscountAmount();
        this.promoCode = bookingHistory.getPromoCode();
        this.totalAmount = bookingHistory.getTotalAmount();
        this.confirmationEmail = bookingHistory.getConfirmationEmail();
        this.paymentStatus = bookingHistory.getPaymentStatus();
        this.paymentCardBrand = bookingHistory.getPaymentCardBrand();
        this.paymentCardLast4 = bookingHistory.getPaymentCardLast4();
        this.paymentApprovalCode = bookingHistory.getPaymentApprovalCode();
        this.qrCodeDataUrl = bookingHistory.getQrCodeDataUrl();
        this.bookedAt = bookingHistory.getBookedAt();
    }

    public Long getId() {
        return id;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public LocalDate getShowDate() {
        return showDate;
    }

    public String getShowTime() {
        return showTime;
    }

    public Integer getAdultTickets() {
        return adultTickets;
    }

    public Integer getChildTickets() {
        return childTickets;
    }

    public Integer getSeniorTickets() {
        return seniorTickets;
    }

    public Integer getTotalTickets() {
        return totalTickets;
    }

    public String getSeatNumbers() {
        return seatNumbers;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount;
    }

    public String getPromoCode() {
        return promoCode;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public String getConfirmationEmail() {
        return confirmationEmail;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public String getPaymentCardBrand() {
        return paymentCardBrand;
    }

    public String getPaymentCardLast4() {
        return paymentCardLast4;
    }

    public String getPaymentApprovalCode() {
        return paymentApprovalCode;
    }

    public String getQrCodeDataUrl() {
        return qrCodeDataUrl;
    }

    public LocalDateTime getBookedAt() {
        return bookedAt;
    }
}
