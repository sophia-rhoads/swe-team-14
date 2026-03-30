package theatreBooking;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200") // Angular frontend
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // Register User
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody theatreBooking.UserService.RegisterRequest request) {

        try {
            userService.register(request);
            return ResponseEntity.ok("User registered successfully");
            // return ResponseEntity.ok("A confirmation Email has been sent for Activation:"
            // + request.email);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Login User
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        try {
            userService.login(request.email, request.password);
            return ResponseEntity.ok("Login successful");
            // return ResponseEntity.ok("Login successful for user: " + user.getEmail());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}