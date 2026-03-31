package theatreBooking;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")

public class UserControler {

      private final UserService userService;

    public UserControler(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register/customer")
    public User registerCustomer(@RequestBody Customer customer) {
        return userService.saveUser(customer);
    }

    @PostMapping("/register/admin")
    public User registerAdmin(@RequestBody Admin admin) {
        return userService.saveUser(admin);
    }

    @PostMapping("/login")
    public User login(@RequestParam String email, @RequestParam String password) {
        return userService.login(email, password);
    }

}
