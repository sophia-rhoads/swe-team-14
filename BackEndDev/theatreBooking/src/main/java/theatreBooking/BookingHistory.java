package theatreBooking;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking_history")
public class BookingHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(optional = false)
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @Column(nullable = false, unique = true)
    private String bookingReference;

    @Column(nullable = false)
    private LocalDate showDate;

    @Column(nullable = false)
    private String showTime;

    @Column(nullable = false)
    private Integer adultTickets;

    @Column(nullable = false)
    private Integer childTickets;

    @Column(nullable = false)
    private Integer seniorTickets;

    @Column(nullable = false)
    private Integer totalTickets;

    @Column(nullable = false)
    private String seatNumbers;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal taxAmount;

    @Column(nullable = false, precision = 10, scale = 2, columnDefinition = "DECIMAL(10,2) DEFAULT 0.00")
    private BigDecimal discountAmount = BigDecimal.ZERO;

    private String promoCode;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private String confirmationEmail;

    @Column(nullable = false)
    private String paymentStatus;

    @Column(nullable = false)
    private String paymentCardBrand;

    @Column(nullable = false)
    private String paymentCardLast4;

    @Column(nullable = false)
    private String paymentApprovalCode;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String qrCodeDataUrl;

    @Column(nullable = false)
    private LocalDateTime bookedAt;

    public Long getId() {
        return id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public String getBookingReference() {
        return bookingReference;
    }

    public void setBookingReference(String bookingReference) {
        this.bookingReference = bookingReference;
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

    public Integer getTotalTickets() {
        return totalTickets;
    }

    public void setTotalTickets(Integer totalTickets) {
        this.totalTickets = totalTickets;
    }

    public String getSeatNumbers() {
        return seatNumbers;
    }

    public void setSeatNumbers(String seatNumbers) {
        this.seatNumbers = seatNumbers;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public BigDecimal getDiscountAmount() {
        return discountAmount == null ? BigDecimal.ZERO : discountAmount;
    }

    public void setDiscountAmount(BigDecimal discountAmount) {
        this.discountAmount = discountAmount;
    }

    public String getPromoCode() {
        return promoCode;
    }

    public void setPromoCode(String promoCode) {
        this.promoCode = promoCode;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getConfirmationEmail() {
        return confirmationEmail;
    }

    public void setConfirmationEmail(String confirmationEmail) {
        this.confirmationEmail = confirmationEmail;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentCardBrand() {
        return paymentCardBrand;
    }

    public void setPaymentCardBrand(String paymentCardBrand) {
        this.paymentCardBrand = paymentCardBrand;
    }

    public String getPaymentCardLast4() {
        return paymentCardLast4;
    }

    public void setPaymentCardLast4(String paymentCardLast4) {
        this.paymentCardLast4 = paymentCardLast4;
    }

    public String getPaymentApprovalCode() {
        return paymentApprovalCode;
    }

    public void setPaymentApprovalCode(String paymentApprovalCode) {
        this.paymentApprovalCode = paymentApprovalCode;
    }

    public String getQrCodeDataUrl() {
        return qrCodeDataUrl;
    }

    public void setQrCodeDataUrl(String qrCodeDataUrl) {
        this.qrCodeDataUrl = qrCodeDataUrl;
    }

    public LocalDateTime getBookedAt() {
        return bookedAt;
    }

    public void setBookedAt(LocalDateTime bookedAt) {
        this.bookedAt = bookedAt;
    }
}
