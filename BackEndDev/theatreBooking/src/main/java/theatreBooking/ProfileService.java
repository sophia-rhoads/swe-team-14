package theatreBooking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    @Autowired
    private UserRepo userRepo;

    public UserProfileResponse getProfile(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        MailingAddr addr = null;
        if (user instanceof Customer customer) {
            addr = customer.getMailingAddr();
        }

        return new UserProfileResponse(user, addr);
    }

    public UserProfileResponse updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(request.getUsername());
        user.setPhoneNumber(request.getPhoneNumber());

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(request.getPassword());
        }

        MailingAddr addr = null;

        if (user instanceof Customer customer) {
            addr = customer.getMailingAddr();

            if (addr == null) {
                addr = new MailingAddr();
            }

            addr.setStreet(request.getHomeAddress());
            //addr.setCounty(request.getCounty());
            addr.setState(request.getState());
            addr.setZip(request.getZipCode());

            customer.setMailingAddr(addr);
            user = customer;
        }

        User savedUser = userRepo.save(user);
        MailingAddr savedAddr = null;

        if (savedUser instanceof Customer customer) {
            savedAddr = customer.getMailingAddr();
        }

        return new UserProfileResponse(savedUser, savedAddr);
    }
}