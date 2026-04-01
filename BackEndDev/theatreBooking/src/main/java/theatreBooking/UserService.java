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

        if (request.email == null || request.email.isBlank()) {
            throw new RuntimeException("Email is required");
        }

        if (request.password == null || request.password.isBlank()) {
            throw new RuntimeException("Password is required");
        }

        if (request.confirmPassword == null || request.confirmPassword.isBlank()) {
            throw new RuntimeException("Confirm Password is required");
        }

        if (!request.password.equals(request.confirmPassword)) {
            throw new RuntimeException("Passwords do not match");
        }

        if (userRepo.findByEmail(request.email).isPresent()) {
            throw new RuntimeException("This Email is already tied to an account");
        }

        Customer customer = new Customer();
        customer.setUsername(request.username);
        customer.setFirstName(request.firstName);
        customer.setLastName(request.lastName);
        customer.setEmail(request.email);
        customer.setPassword(encoder.encode(request.password));
        customer.setPhoneNumber(request.phone);
        customer.setStatus("ACTIVE");

        if (request.dateOfBirth != null && !request.dateOfBirth.isBlank()) {
            customer.setDateOfBirth(LocalDate.parse(request.dateOfBirth));
        }

        MailingAddr addr = new MailingAddr();
        addr.setStreet(request.street);
        addr.setCity(request.city);
        addr.setState(request.state);
        addr.setZip(request.zip);

        // only keep this if MailingAddr has county field
        // addr.setCounty(request.county);

        customer.setMailingAddr(addr);

        return userRepo.save(customer);
    }

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
        return userRepo.save(user);
    }
}