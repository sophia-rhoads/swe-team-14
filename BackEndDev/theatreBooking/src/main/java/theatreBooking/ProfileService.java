package theatreBooking;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class ProfileService {

    private final UserRepo userRepo;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(UserRepo userRepo, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    // Get user profile by user ID
    public UserProfileResponse getProfile(Long userId) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        MailingAddr addr = null;

        if (user instanceof Customer customer) {
            addr = customer.getMailingAddr();
        }

        return new UserProfileResponse(user, addr);
    }

    // Update user profile by user ID
    public UserProfileResponse updateProfile(Long userId, ProfileUpdateRequest request) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ===== BASIC FIELDS =====
        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            user.setUsername(request.getUsername());
        }

        if (request.getFirstName() != null && !request.getFirstName().isBlank()) {
            user.setFirstName(request.getFirstName());
        }

        if (request.getLastName() != null && !request.getLastName().isBlank()) {
            user.setLastName(request.getLastName());
        }

        if (request.getDateOfBirth() != null) {
            user.setDateOfBirth(request.getDateOfBirth());
        }

        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            user.setPhone(request.getPhone());
        }

        // Password
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        // Mailing Address (only for customers)
        MailingAddr addr = null;

        if (user instanceof Customer customer) {

            addr = customer.getMailingAddr();

            if (addr == null) {
                addr = new MailingAddr();
                addr.setCustomer(customer);
            }

            if (request.getAddress() != null) {
                addr.setStreet(request.getAddress().getStreet());
                addr.setCity(request.getAddress().getCity());
                addr.setState(request.getAddress().getState());
                addr.setZipCode(request.getAddress().getZipCode());
            }

            customer.setMailingAddr(addr);
            user = customer;
        }

        // Save user
        User savedUser = userRepo.save(user);

        MailingAddr savedAddr = null;
        if (savedUser instanceof Customer customer) {
            savedAddr = customer.getMailingAddr();
        }

        // email notification
        emailService.sendHtmlEmail(
                savedUser.getEmail(),
                "Profile Updated",
                "<p>Your profile has been successfully updated.</p>");

        return new UserProfileResponse(savedUser, savedAddr);
    }
}