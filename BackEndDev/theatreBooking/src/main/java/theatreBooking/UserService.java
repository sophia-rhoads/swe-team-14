package theatreBooking;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepo userRepo;
    private final BCryptPasswordEncoder encoder;

    public UserService(UserRepo userRepo, BCryptPasswordEncoder encoder) {
        this.userRepo = userRepo;
        this.encoder = encoder;
    }

    public User register(User user) {

        user.setPassword(encoder.encode(user.getPassword()));
        user.setRole("CUSTOMER");
        user.setStatus("ACTIVE");

        return userRepo.save(user);
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
}