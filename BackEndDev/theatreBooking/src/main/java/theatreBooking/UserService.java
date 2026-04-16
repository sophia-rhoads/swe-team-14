package theatreBooking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepo userRepo;
    private final MovieRepo movieRepo;
    private final BCryptPasswordEncoder encoder;
    private final ActivationTokenRepo tokenRepo;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepo passwordResetTokenRepo;
    private final EmailService emailService;

    @Autowired
    private CustomerRepo customerRepo;

    @Autowired
    private FavoritesRepo favoriteRepo;

    @Autowired
    private PaymentCardRepo paymentCardRepo;

    public UserService(UserRepo userRepo,
            MovieRepo movieRepo,
            BCryptPasswordEncoder encoder,
            ActivationTokenRepo tokenRepo,
            PasswordEncoder passwordEncoder,
            PasswordResetTokenRepo passwordResetTokenRepo,
            EmailService emailService) {
        this.userRepo = userRepo;
        this.movieRepo = movieRepo;
        this.encoder = encoder;
        this.tokenRepo = tokenRepo;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetTokenRepo = passwordResetTokenRepo;
        this.emailService = emailService;
    }

    public User register(RegisterRequest request) {
        if (request.email == null || request.email.isBlank()) {
            throw new RuntimeException("Email is required");
        }
        if (request.password == null || request.password.isBlank()) {
            throw new RuntimeException("Password is required");
        }
        if (!request.password.equals(request.confirmPassword)) {
            throw new RuntimeException("Passwords do not match");
        }
        if (userRepo.findByEmail(request.email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        Customer customer = new Customer();
        customer.setUsername(request.username);
        customer.setFirstName(request.firstName);
        customer.setLastName(request.lastName);
        customer.setEmail(request.email);
        customer.setPassword(encoder.encode(request.password));
        customer.setPhone(request.phone);
        customer.setRole(User.Role.CUSTOMER);
        customer.setUserState(UserState.INACTIVE);

        if (request.dateOfBirth != null && !request.dateOfBirth.isBlank()) {
            customer.setDateOfBirth(LocalDate.parse(request.dateOfBirth));
        }

        if (request.street != null) {
            MailingAddr addr = new MailingAddr();
            addr.setStreet(request.street);
            addr.setCity(request.city);
            addr.setState(request.state);
            addr.setZipCode(request.zip);
            addr.setCustomer(customer);
            customer.setMailingAddr(addr);
        }

        User savedUser = userRepo.save(customer);

        String token = UUID.randomUUID().toString();
        tokenRepo.save(new ActivationToken(token, savedUser));

        String activationLink = "http://localhost:8080/api/auth/activate?token=" + token;
        String htmlBody = """
                <html>
                <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2 style="color: #2c3e50;">🎬 Welcome to Cinema E-Booking!</h2>
                    <p style="font-size: 16px;">Hi <b>%s</b>,</p>
                    <p style="font-size: 14px;">Thank you for registering! Click the button below to activate your account:</p>
                    <a href="%s" style="display:inline-block;padding:12px 25px;margin-top:20px;font-size:16px;color:white;background-color:#28a745;text-decoration:none;border-radius:5px;">
                        Activate Account
                    </a>
                    <p style="margin-top:30px; font-size:12px; color:gray;">This link will expire in 24 hours.</p>
                    <p style="font-size:12px; color:gray;">If you did not create this account, please ignore this email.</p>
                </body>
                </html>
                """
                .formatted(customer.getUsername(), activationLink);

        emailService.sendHtmlEmail(customer.getEmail(), "Activate Your Cinema Booking Account", htmlBody);
        return savedUser;
    }

    public User login(String email, String password) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!encoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (user instanceof Customer customer && customer.getUserState() == UserState.INACTIVE) {
            throw new RuntimeException("Please activate your account before logging in");
        }

        return user;
    }

    public String activateAccount(String token) {
        ActivationToken activationToken = tokenRepo.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (activationToken.isExpired()) {
            throw new RuntimeException("Token expired");
        }

        User user = activationToken.getUser();
        user.setUserState(UserState.ACTIVE);
        userRepo.save(user);
        return "Account activated successfully";
    }

    public void sendPasswordResetEmail(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusHours(1));
        passwordResetTokenRepo.save(resetToken);

        String link = "http://localhost:4200/reset-password?token=" + token;
        String html = """
                <html>
                <body style="font-family: Arial; text-align:center;">
                    <h2>Password Reset Request</h2>
                    <p>Click the button below to reset your password:</p>
                    <a href="%s" style="padding:10px 20px; background:#007bff; color:white; text-decoration:none; border-radius:5px;">
                       Reset Password
                    </a>
                    <p style="margin-top:20px; font-size:12px; color:gray;">This link will expire in 1 hour.</p>
                </body>
                </html>
                """
                .formatted(link);

        emailService.sendHtmlEmail(email, "Reset Password", html);
    }

    public String resetPassword(PasswordResetRequest request) {
        if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
            throw new RuntimeException("Password cannot be empty");
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        PasswordResetToken token = passwordResetTokenRepo.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (token.getExpiryDate() == null || token.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired or invalid");
        }

        User user = token.getUser();
        if (user.getRole() == null) {
            user.setRole(User.Role.CUSTOMER);
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepo.save(user);
        passwordResetTokenRepo.delete(token);
        return "Password reset successful";
    }

    public List<Favorites> getFavorites(Long userId) {
        return favoriteRepo.findByCustomer_Id(userId);
    }

    public Favorites addFavorite(Long userId, Long movieId) {
        Customer customer = customerRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Movie movie = movieRepo.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        if (favoriteRepo.existsByCustomer_IdAndMovie_Id(userId, movieId)) {
            throw new RuntimeException("Already in Favourites");
        }

        Favorites fav = new Favorites();
        fav.setMovie(movie);
        fav.setCustomer(customer);
        return favoriteRepo.save(fav);
    }

    public void deleteFavorite(Long userId, Long movieId) {
        favoriteRepo.deleteByCustomer_IdAndMovie_Id(userId, movieId);
    }

    public List<PaymentCard> getCards(Long userId) {
        return paymentCardRepo.findByCustomerId(userId);
    }

    public PaymentCard addCard(Long userId, PaymentCardRequest request) {
        Customer customer = customerRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<PaymentCard> existingCards = paymentCardRepo.findByCustomerId(userId);

        if (existingCards.size() >= 3) {
            throw new RuntimeException("Maximum 3 cards allowed");
        }

        // Compute last 4 digits in a single expression
        final String incomingLast4 = last4(request.cardNumber.replaceAll("\\s+", ""));

        boolean duplicate = existingCards.stream().anyMatch(existing -> {
            String existingLast4 = last4(existing.getCardNumber().replaceAll("\\s+", ""));
            return existingLast4.equals(incomingLast4)
                    && existing.getExpirationDate().equals(request.expirationDate)
                    && existing.getBillingZipCode().equals(request.billingZipCode);
        });

        if (duplicate) {
            throw new RuntimeException("This card is already saved to your account");
        }

        PaymentCard card = new PaymentCard();
        card.setCardHolderName(request.cardHolderName);
        card.setCardType(request.cardType);
        card.setCardNumber(request.cardNumber);
        card.setExpirationDate(request.expirationDate);
        card.setBillingZipCode(request.billingZipCode);
        card.setCustomer(customer);
        return paymentCardRepo.save(card);
    }

    public void deleteCard(Long cardId) {
        paymentCardRepo.deleteById(cardId);
    }

    // Extract last 4 characters of a string safely
    private String last4(String value) {
        return value.substring(Math.max(0, value.length() - 4));
    }
}