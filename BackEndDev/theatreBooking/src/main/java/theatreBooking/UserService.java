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

    public class RegisterRequest {
        public String username;
        public String firstName;
        public String lastName;
        public String email;
        public String password;
        public String phone;
        public String dateOfBirth;

        public String street;
        public String city;
        public String state;
        public int zipCode;
        public PaymentCard paymentCards;
    }// regreq

    public User register(RegisterRequest request) {

        // Email uniqueness check
        if (userRepo.findByEmail(request.email).isPresent()) {
            throw new RuntimeException("This Email is already tied to an account");
        }

        // Payment card limit
        // if (request.paymentCards != null && request.paymentCards.size() > 3) {
        // throw new RuntimeException("Maximum 3 payment cards allowed");
        // }

        // Create user
        Customer customer = new Customer();

        customer.setUsername(request.username);
        customer.setFirstName(request.firstName);
        customer.setLastName(request.lastName);
        customer.setEmail(request.email);

        // Encrypt password
        customer.setPassword(encoder.encode(request.password));

        customer.setPhoneNumber(request.phone);

        if (request.dateOfBirth != null) {
            customer.setDateOfBirth(LocalDate.parse(request.dateOfBirth));
        }

        MailingAddr addr = new MailingAddr();
        addr.setStreet(request.street);
        addr.setCity(request.city);
        addr.setState(request.state);
        addr.setZip(request.zipCode);
        customer.setMailingAddr(addr);

        // customer.setRole("CUSTOMER");

        // ACTIVE by default (you can change later for email verification)
        customer.setStatus("ACTIVE");

        // Save user first
        User savedUser = userRepo.save(customer);

        // // save payment cards if provided
        // if (request.paymentCards != null) {

        // for (PaymentCardRequest cardReq : request.paymentCards) {

        // // Skip invalid cards
        // if (cardReq.cardNumber == null || cardReq.cardNumber.length() < 4) {
        // continue;
        // }

        // PaymentCard card = new PaymentCard();

        // card.setCardType(cardReq.cardType);

        // // Store ONLY last 4 digits
        // String last4 = cardReq.cardNumber.substring(cardReq.cardNumber.length() - 4);
        // card.setLast4Digits(last4);

        // card.setExpirationDate(cardReq.expirationDate);

        // // Link to user
        // card.setUser(savedUser);

<<<<<<< Updated upstream
        //         paymentCardRepository.save(card);
        //     }
        // }//req payment cards
=======
        // paymentCardRepository.save(card);
        // }
        // }//req payment cars
>>>>>>> Stashed changes

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

    public User saveUser(User user) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'saveUser'");
    }
}