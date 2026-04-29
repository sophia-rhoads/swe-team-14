package theatreBooking;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class BookingService {

    private static final BigDecimal ADULT_PRICE = new BigDecimal("5.00");
    private static final BigDecimal CHILD_PRICE = new BigDecimal("2.50");
    private static final BigDecimal SENIOR_PRICE = new BigDecimal("3.50");
    private static final BigDecimal SALES_TAX_RATE = new BigDecimal("0.07");
    private static final BigDecimal ZERO = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);

    private static final Set<String> DECLINED_CVVS = Set.of("000", "0000");
    private static final Set<String> INSUFFICIENT_FUNDS_CVVS = Set.of("999", "9999");

    private final CustomerRepo customerRepo;
    private final MovieRepo movieRepo;
    private final PaymentCardRepo paymentCardRepo;
    private final BookingHistoryRepo bookingHistoryRepo;
    private final EmailService emailService;
    private final QrCodeService qrCodeService;
    private final SeatRepo seatRepo;
    private final SeatLockService seatLockService;

    public BookingService(
            CustomerRepo customerRepo,
            MovieRepo movieRepo,
            PaymentCardRepo paymentCardRepo,
            BookingHistoryRepo bookingHistoryRepo,
            EmailService emailService,
            QrCodeService qrCodeService,
            SeatRepo seatRepo,
            SeatLockService seatLockService) {
        this.customerRepo = customerRepo;
        this.movieRepo = movieRepo;
        this.paymentCardRepo = paymentCardRepo;
        this.bookingHistoryRepo = bookingHistoryRepo;
        this.emailService = emailService;
        this.qrCodeService = qrCodeService;
        this.seatRepo = seatRepo;
        this.seatLockService = seatLockService;
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

        // Validate seats are not already permanently booked
        if (request.getShowtimeId() != null) {
            for (String seatNumber : request.getSeatNumbers()) {
                seatRepo.findByShowtimeIdAndSeatNumber(request.getShowtimeId(), seatNumber)
                        .ifPresent(seat -> {
                            if (seat.isBooked()) {
                                throw new RuntimeException(
                                        "Seat " + seatNumber + " is already booked for this showtime");
                            }
                        });
            }
        }

        BigDecimal subtotal = ADULT_PRICE.multiply(BigDecimal.valueOf(adultTickets))
                .add(CHILD_PRICE.multiply(BigDecimal.valueOf(childTickets)))
                .add(SENIOR_PRICE.multiply(BigDecimal.valueOf(seniorTickets)))
                .setScale(2, RoundingMode.HALF_UP);

        PromoDiscount promoDiscount = calculateDiscount(request.getPromoCode(), subtotal);
        BigDecimal discountedSubtotal = subtotal.subtract(promoDiscount.discountAmount()).max(ZERO)
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal taxAmount = discountedSubtotal.multiply(SALES_TAX_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = discountedSubtotal.add(taxAmount).setScale(2, RoundingMode.HALF_UP);

        // Payment auth runs BEFORE any DB write
        simulatePaymentAuthorization(request.getPayment());

        ProcessedPaymentDetails processedPayment = resolvePayment(customer, request.getPayment());
        String approvalCode = UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase(Locale.US);
        String bookingReference = generateBookingReference();
        String qrPayload = String.join("|",
                bookingReference, movie.getTitle(), request.getShowDate().toString(),
                request.getShowTime(), String.join(",", request.getSeatNumbers()), customer.getEmail());

        BookingHistory booking = new BookingHistory();
        booking.setCustomer(customer);
        booking.setMovie(movie);
        booking.setBookingReference(bookingReference);
        booking.setShowDate(request.getShowDate());
        booking.setShowTime(request.getShowTime());
        booking.setAdultTickets(adultTickets);
        booking.setChildTickets(childTickets);
        booking.setSeniorTickets(seniorTickets);
        booking.setTotalTickets(totalTickets);
        booking.setSeatNumbers(String.join(", ", request.getSeatNumbers()));
        booking.setSubtotal(subtotal);
        booking.setTaxAmount(taxAmount);
        booking.setDiscountAmount(promoDiscount.discountAmount());
        booking.setPromoCode(promoDiscount.promoCode());
        booking.setTotalAmount(totalAmount);
        booking.setConfirmationEmail(request.getConfirmationEmail().trim());
        booking.setPaymentStatus("PAID");
        booking.setPaymentCardBrand(processedPayment.cardBrand());
        booking.setPaymentCardLast4(processedPayment.cardLast4());
        booking.setPaymentApprovalCode(approvalCode);
        booking.setQrCodeDataUrl(qrCodeService.generateDataUrl(qrPayload));
        booking.setBookedAt(LocalDateTime.now());

        BookingHistory saved = bookingHistoryRepo.save(booking);

        // Mark seats as permanently booked
        if (request.getShowtimeId() != null) {
            for (String seatNumber : request.getSeatNumbers()) {
                seatRepo.findByShowtimeIdAndSeatNumber(request.getShowtimeId(), seatNumber)
                        .ifPresent(seat -> {
                            seat.setBooked(true);
                            seatRepo.save(seat);
                        });
            }

            // Release the seat locks held by this checkout session.
            // Seat locks are 5-minute temporary reservations; once payment
            if (request.getSessionToken() != null && !request.getSessionToken().isBlank()) {
                seatLockService.releaseByToken(request.getSessionToken());
            }
        }

        sendBookingConfirmation(saved);
        return new BookingResponse(saved);
    }

    public List<BookingResponse> getBookingHistory(Long userId) {
        if (!customerRepo.existsById(userId)) {
            throw new RuntimeException("Customer not found");
        }
        return bookingHistoryRepo.findByCustomerIdOrderByBookedAtDesc(userId)
                .stream().map(BookingResponse::new).toList();
    }

    private void simulatePaymentAuthorization(PaymentDetailsRequest payment) {
        String cvv = payment.getCvv() == null ? "" : payment.getCvv().trim();
        if (DECLINED_CVVS.contains(cvv)) {
            throw new RuntimeException(
                    "PAYMENT_DECLINED: Your card was declined. Please check your card details and try again.");
        }
        if (INSUFFICIENT_FUNDS_CVVS.contains(cvv)) {
            throw new RuntimeException("PAYMENT_DECLINED: Transaction failed due to insufficient funds.");
        }
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
        if (payment == null)
            throw new RuntimeException("Payment details are required");
        if (payment.getCardholderName() == null || payment.getCardholderName().isBlank()) {
            throw new RuntimeException("Cardholder name is required");
        }
        if (payment.getCvv() == null || !payment.getCvv().matches("\\d{3,4}")) {
            throw new RuntimeException("CVV must contain 3 or 4 digits");
        }
        if (payment.getPaymentCardId() != null)
            return;

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

    private void sendBookingConfirmation(BookingHistory b) {
        String html = """
                <h2>Booking Confirmed</h2>
                <p>Your payment was approved and your ticket is ready.</p>
                <ul>
                    <li><strong>Booking Reference:</strong> %s</li>
                    <li><strong>Movie:</strong> %s</li>
                    <li><strong>Show:</strong> %s at %s</li>
                    <li><strong>Seats:</strong> %s</li>
                    <li><strong>Discount:</strong> $%s</li>
                    <li><strong>Total Paid:</strong> $%s</li>
                    <li><strong>Payment:</strong> %s ending in %s</li>
                    <li><strong>Approval Code:</strong> %s</li>
                </ul>
                <p>Please keep the QR ticket in your booking history for scanning at the theatre.</p>
                <img alt="Ticket QR" src="%s" />
                """.formatted(
                b.getBookingReference(), b.getMovie().getTitle(),
                b.getShowDate().format(DateTimeFormatter.ofPattern("MMM d, yyyy")), b.getShowTime(),
                b.getSeatNumbers(), b.getDiscountAmount().setScale(2, RoundingMode.HALF_UP),
                b.getTotalAmount().setScale(2, RoundingMode.HALF_UP),
                b.getPaymentCardBrand(), b.getPaymentCardLast4(),
                b.getPaymentApprovalCode(), b.getQrCodeDataUrl());

        emailService.sendHtmlEmail(b.getConfirmationEmail(), "Your Cinema Booking Confirmation", html);
    }

    private ProcessedPaymentDetails resolvePayment(Customer customer, PaymentDetailsRequest payment) {
        if (payment.getPaymentCardId() != null) {
            PaymentCard stored = paymentCardRepo.findById(payment.getPaymentCardId())
                    .orElseThrow(() -> new RuntimeException("Selected payment card was not found"));
            if (!stored.getCustomer().getId().equals(customer.getId())) {
                throw new RuntimeException("Selected payment card does not belong to this customer");
            }
            String num = stored.getCardNumber().replaceAll("\\s+", "");
            return new ProcessedPaymentDetails(stored.getCardType(), num.substring(num.length() - 4));
        }
        String num = payment.getCardNumber().replaceAll("\\s+", "");
        return new ProcessedPaymentDetails(detectCardBrand(num), num.substring(num.length() - 4));
    }

    private String generateBookingReference() {
        return "BK-T14-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMddyyyyHHmmss"));
    }

    private String detectCardBrand(String cardNumber) {
        if (cardNumber.startsWith("4"))
            return "Visa";
        if (cardNumber.matches("5[1-5].*"))
            return "Mastercard";
        if (cardNumber.matches("3[47].*"))
            return "American Express";
        return "Card";
    }

    private int defaultValue(Integer value) {
        return value == null ? 0 : value;
    }

    private PromoDiscount calculateDiscount(String rawPromoCode, BigDecimal subtotal) {
        if (rawPromoCode == null || rawPromoCode.isBlank()) {
            return new PromoDiscount(null, ZERO);
        }

        String code = rawPromoCode.trim().toUpperCase(Locale.US);
        BigDecimal discount = switch (code) {
            case "SAVE5" -> subtotal.multiply(new BigDecimal("0.05"));
            case "SAVE7" -> subtotal.multiply(new BigDecimal("0.07"));
            case "SAVE10" -> subtotal.multiply(new BigDecimal("0.10"));
            case "OVER25" -> {
                if (subtotal.compareTo(new BigDecimal("25.00")) < 0)
                    throw new RuntimeException("Promo code OVER25 requires at least $25.00 before tax");
                yield new BigDecimal("2.00");
            }
            case "OVER50" -> {
                if (subtotal.compareTo(new BigDecimal("50.00")) < 0)
                    throw new RuntimeException("Promo code OVER50 requires at least $50.00 before tax");
                yield new BigDecimal("12.00");
            }
            default -> throw new RuntimeException("Invalid promo code");
        };

        return new PromoDiscount(code, discount.min(subtotal).setScale(2, RoundingMode.HALF_UP));
    }

    private record ProcessedPaymentDetails(String cardBrand, String cardLast4) {
    }

    private record PromoDiscount(String promoCode, BigDecimal discountAmount) {
    }
}
