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

    public UserProfileResponse getProfile(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        MailingAddr addr = (user instanceof Customer c) ? c.getMailingAddr() : null;
        return new UserProfileResponse(user, addr);
    }

    public UserProfileResponse updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getUsername() != null && !request.getUsername().isBlank())
            user.setUsername(request.getUsername());
        if (request.getFirstName() != null && !request.getFirstName().isBlank())
            user.setFirstName(request.getFirstName());
        if (request.getLastName() != null && !request.getLastName().isBlank())
            user.setLastName(request.getLastName());
        if (request.getDateOfBirth() != null)
            user.setDateOfBirth(request.getDateOfBirth());
        if (request.getPhone() != null && !request.getPhone().isBlank())
            user.setPhone(request.getPhone());
        if (request.getPassword() != null && !request.getPassword().isBlank())
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPreferences(request.getPreferences());
        user.setPromotionsOptIn(request.isPromotionsOptIn());

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

        User savedUser = userRepo.save(user);
        MailingAddr savedAddr = (savedUser instanceof Customer c) ? c.getMailingAddr() : null;

        emailService.sendHtmlEmail(
                savedUser.getEmail(),
                "Profile Updated",
                "<p>Your profile has been successfully updated.</p>");

        return new UserProfileResponse(savedUser, savedAddr);
    }
}
