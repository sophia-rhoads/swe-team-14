package theatreBooking;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class BookingService {

    private static final BigDecimal ADULT_PRICE = new BigDecimal("5.00");
    private static final BigDecimal CHILD_PRICE = new BigDecimal("2.50");
    private static final BigDecimal SENIOR_PRICE = new BigDecimal("3.50");
    private static final BigDecimal SALES_TAX_RATE = new BigDecimal("0.07");

    private final CustomerRepo customerRepo;
    private final MovieRepo movieRepo;
    private final PaymentCardRepo paymentCardRepo;
    private final BookingHistoryRepo bookingHistoryRepo;
    private final EmailService emailService;
    private final QrCodeService qrCodeService;

    public BookingService(
            CustomerRepo customerRepo,
            MovieRepo movieRepo,
            PaymentCardRepo paymentCardRepo,
            BookingHistoryRepo bookingHistoryRepo,
            EmailService emailService,
            QrCodeService qrCodeService) {
        this.customerRepo = customerRepo;
        this.movieRepo = movieRepo;
        this.paymentCardRepo = paymentCardRepo;
        this.bookingHistoryRepo = bookingHistoryRepo;
        this.emailService = emailService;
        this.qrCodeService = qrCodeService;
    }

    public BookingResponse createBooking(BookingRequest request) {
        validateRequest(request);

        Customer customer = customerRepo.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Movie movie = movieRepo.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        if (movie.getStatus() == MovieStatus.COMING_SOON) {
            throw new RuntimeException("Bookings are not available for coming soon movies");
        }

        int adultTickets = defaultValue(request.getAdultTickets());
        int childTickets = defaultValue(request.getChildTickets());
        int seniorTickets = defaultValue(request.getSeniorTickets());
        int totalTickets = adultTickets + childTickets + seniorTickets;

        if (request.getSeatNumbers().size() != totalTickets) {
            throw new RuntimeException("Seat count must match the number of selected tickets");
        }

        BigDecimal subtotal = ADULT_PRICE.multiply(BigDecimal.valueOf(adultTickets))
                .add(CHILD_PRICE.multiply(BigDecimal.valueOf(childTickets)))
                .add(SENIOR_PRICE.multiply(BigDecimal.valueOf(seniorTickets)))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal taxAmount = subtotal.multiply(SALES_TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal.add(taxAmount).setScale(2, RoundingMode.HALF_UP);

        PaymentDetailsRequest payment = request.getPayment();
        ProcessedPaymentDetails processedPayment = resolvePayment(customer, payment);
        String approvalCode = UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase(Locale.US);
        String bookingReference = generateBookingReference();
        String qrPayload = String.join("|",
                bookingReference,
                movie.getTitle(),
                request.getShowDate().toString(),
                request.getShowTime(),
                String.join(",", request.getSeatNumbers()),
                customer.getEmail());

        BookingHistory bookingHistory = new BookingHistory();
        bookingHistory.setCustomer(customer);
        bookingHistory.setMovie(movie);
        bookingHistory.setBookingReference(bookingReference);
        bookingHistory.setShowDate(request.getShowDate());
        bookingHistory.setShowTime(request.getShowTime());
        bookingHistory.setAdultTickets(adultTickets);
        bookingHistory.setChildTickets(childTickets);
        bookingHistory.setSeniorTickets(seniorTickets);
        bookingHistory.setTotalTickets(totalTickets);
        bookingHistory.setSeatNumbers(String.join(", ", request.getSeatNumbers()));
        bookingHistory.setSubtotal(subtotal);
        bookingHistory.setTaxAmount(taxAmount);
        bookingHistory.setTotalAmount(totalAmount);
        bookingHistory.setConfirmationEmail(request.getConfirmationEmail().trim());
        bookingHistory.setPaymentStatus("PAID");
        bookingHistory.setPaymentCardBrand(processedPayment.cardBrand());
        bookingHistory.setPaymentCardLast4(processedPayment.cardLast4());
        bookingHistory.setPaymentApprovalCode(approvalCode);
        bookingHistory.setQrCodeDataUrl(qrCodeService.generateDataUrl(qrPayload));
        bookingHistory.setBookedAt(LocalDateTime.now());

        BookingHistory savedBooking = bookingHistoryRepo.save(bookingHistory);

        sendBookingConfirmation(savedBooking);

        return new BookingResponse(savedBooking);
    }

    public List<BookingResponse> getBookingHistory(Long userId) {
        if (!customerRepo.existsById(userId)) {
            throw new RuntimeException("Customer not found");
        }

        return bookingHistoryRepo.findByCustomerIdOrderByBookedAtDesc(userId)
                .stream()
                .map(BookingResponse::new)
                .toList();
    }

    private void validateRequest(BookingRequest request) {
        if (request.getUserId() == null || request.getMovieId() == null) {
            throw new RuntimeException("User and movie are required");
        }

        if (request.getShowDate() == null || request.getShowTime() == null || request.getShowTime().isBlank()) {
            throw new RuntimeException("Show date and time are required");
        }

        if (request.getConfirmationEmail() == null
                || !request.getConfirmationEmail().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new RuntimeException("A valid confirmation email is required");
        }

        if (request.getSeatNumbers() == null || request.getSeatNumbers().isEmpty()) {
            throw new RuntimeException("At least one seat must be selected");
        }

        int totalTickets = defaultValue(request.getAdultTickets())
                + defaultValue(request.getChildTickets())
                + defaultValue(request.getSeniorTickets());

        if (totalTickets <= 0) {
            throw new RuntimeException("At least one ticket must be purchased");
        }

        PaymentDetailsRequest payment = request.getPayment();
        if (payment == null) {
            throw new RuntimeException("Payment details are required");
        }

        if (payment.getCardholderName() == null || payment.getCardholderName().isBlank()) {
            throw new RuntimeException("Cardholder name is required");
        }

        if (payment.getCvv() == null || !payment.getCvv().matches("\\d{3,4}")) {
            throw new RuntimeException("CVV must contain 3 or 4 digits");
        }

        if (payment.getPaymentCardId() != null) {
            return;
        }

        String cardNumber = payment.getCardNumber() == null ? "" : payment.getCardNumber().replaceAll("\\s+", "");
        if (!cardNumber.matches("\\d{16}")) {
            throw new RuntimeException("Card number must contain 16 digits");
        }

        if (payment.getExpiryDate() == null || !payment.getExpiryDate().matches("\\d{4}-\\d{2}")) {
            throw new RuntimeException("Expiry date must use YYYY-MM format");

        }

        if (payment.getBillingZipCode() == null || !payment.getBillingZipCode().matches("\\d{5}")) {
            throw new RuntimeException("Billing ZIP code must contain 5 digits");
        }
    }

    private void sendBookingConfirmation(BookingHistory bookingHistory) {
        String html = """
                <h2>Booking Confirmed</h2>
                <p>Your payment was approved and your ticket is ready.</p>
                <ul>
                    <li><strong>Booking Reference:</strong> %s</li>
                    <li><strong>Movie:</strong> %s</li>
                    <li><strong>Show:</strong> %s at %s</li>
                    <li><strong>Seats:</strong> %s</li>
                    <li><strong>Total Paid:</strong> $%s</li>
                    <li><strong>Payment:</strong> %s ending in %s</li>
                    <li><strong>Approval Code:</strong> %s</li>
                </ul>
                <p>Please keep the QR ticket in your booking history for scanning at the theatre.</p>
                <img alt="Ticket QR" src="%s" />
                """.formatted(
                bookingHistory.getBookingReference(),
                bookingHistory.getMovie().getTitle(),
                bookingHistory.getShowDate().format(DateTimeFormatter.ofPattern("MMM d, yyyy")),
                bookingHistory.getShowTime(),
                bookingHistory.getSeatNumbers(),
                bookingHistory.getTotalAmount().setScale(2, RoundingMode.HALF_UP),
                bookingHistory.getPaymentCardBrand(),
                bookingHistory.getPaymentCardLast4(),
                bookingHistory.getPaymentApprovalCode(),
                bookingHistory.getQrCodeDataUrl());

        emailService.sendHtmlEmail(
                bookingHistory.getConfirmationEmail(),
                "Your Cinema Booking Confirmation",
                html);
    }

    private int defaultValue(Integer value) {
        return value == null ? 0 : value;
    }

    private ProcessedPaymentDetails resolvePayment(Customer customer, PaymentDetailsRequest payment) {
        if (payment.getPaymentCardId() != null) {
            PaymentCard storedCard = paymentCardRepo.findById(payment.getPaymentCardId())
                    .orElseThrow(() -> new RuntimeException("Selected payment card was not found"));

            if (!storedCard.getCustomer().getId().equals(customer.getId())) {
                throw new RuntimeException("Selected payment card does not belong to this customer");
            }

            String sanitizedCardNumber = storedCard.getCardNumber().replaceAll("\\s+", "");
            return new ProcessedPaymentDetails(
                    storedCard.getCardType(),
                    sanitizedCardNumber.substring(sanitizedCardNumber.length() - 4));
        }

        String sanitizedCardNumber = payment.getCardNumber().replaceAll("\\s+", "");
        return new ProcessedPaymentDetails(
                detectCardBrand(sanitizedCardNumber),
                sanitizedCardNumber.substring(sanitizedCardNumber.length() - 4));
    }

    private String generateBookingReference() {
        return "BK-T14-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMddyyyyHHmmss"));
    }

    private String detectCardBrand(String cardNumber) {
        if (cardNumber.startsWith("4")) {
            return "Visa";
        }
        if (cardNumber.matches("5[1-5].*")) {
            return "Mastercard";
        }
        if (cardNumber.matches("3[47].*")) {
            return "American Express";
        }
        return "Card";
    }

    private record ProcessedPaymentDetails(String cardBrand, String cardLast4) {
    }

}