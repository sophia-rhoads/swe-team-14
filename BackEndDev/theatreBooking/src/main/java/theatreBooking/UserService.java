package theatreBooking;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepo userRepo;
    public Customer customer;

    public UserService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public User saveUser(User user) {

        return userRepo.save(user);
        
    }//save

    public User login(String email, String password) {
        User user = userRepo.findByEmail(email);
        if (user != null && user.getPass().equals(password)) {
            return user;
        }
        throw new RuntimeException("error");
    }//Login
}