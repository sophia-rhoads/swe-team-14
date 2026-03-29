package theatreBooking;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepo userRepo;
    private final PaymentCardRepo paymentCardRepository;
    private final BCryptPasswordEncoder encoder;

    public UserService(UserRepo userRepo,
            PaymentCardRepo paymentCardRepository,
            BCryptPasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.paymentCardRepository = paymentCardRepository;
        this.encoder = encoder;
    }

    public Optional<User> findByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    public User register(RegisterRequest request) {

        // Email uniqueness check
        if (userRepo.findByEmail(request.email).isPresent()) {
            throw new RuntimeException("This Email is already tied to an account");
        }

        // Payment card limit
        if (request.paymentCards != null && request.paymentCards.size() > 3) {
            throw new RuntimeException("Maximum 3 payment cards allowed");
        }

        // Create user
        User user = new User();

        user.setUsername(request.username);
        user.setFirstName(request.firstName);
        user.setLastName(request.lastName);
        user.setEmail(request.email);

        // Encrypt password
        user.setPassword(encoder.encode(request.password));

        user.setPhoneNumber(request.phone);

        if (request.dateOfBirth != null) {
            user.setDateOfBirth(LocalDate.parse(request.dateOfBirth));
        }

        user.setStreet(request.street);
        user.setCity(request.city);
        user.setCounty(request.county);
        user.setState(request.state);
        user.setZipCode(request.zip);

        user.setRole("CUSTOMER");

        // ACTIVE by default (you can change later for email verification)
        user.setStatus("ACTIVE");

        // Save user first
        User savedUser = userRepo.save(user);

        // save payment cards if provided
        if (request.paymentCards != null) {

            for (PaymentCardRequest cardReq : request.paymentCards) {

                // Skip invalid cards
                if (cardReq.cardNumber == null || cardReq.cardNumber.length() < 4) {
                    continue;
                }

                PaymentCard card = new PaymentCard();

                card.setCardType(cardReq.cardType);

                // Store ONLY last 4 digits
                String last4 = cardReq.cardNumber.substring(cardReq.cardNumber.length() - 4);
                card.setLast4Digits(last4);

                card.setExpirationDate(cardReq.expirationDate);

                // Link to user
                card.setUser(savedUser);

                paymentCardRepository.save(card);
            }
        }

        return savedUser;
    }

    // user login
    public User login(String email, String password) {

        Optional<User> userOpt = userRepo.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            if (encoder.matches(password, user.getPassword())) {
                return user;
            }
        }

        throw new RuntimeException("Invalid email or password");
    }
}