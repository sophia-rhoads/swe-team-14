package theatreBooking;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // Registration Endpoint
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            userService.register(request);

            return ResponseEntity.ok(
                    "Registration successful. Please check your email to activate your account.");

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Login Endpoint
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.login(request.getEmail(), request.getPassword());

            return ResponseEntity.ok(
                    new LoginResponse(
                            user.getId(),
                            user.getUsername(),
                            user.getEmail(),
                            user.getRole().name() // Important
                    ));

        } catch (RuntimeException e) {

            String msg = e.getMessage();

            // Return correct status codes
            if (msg.contains("activate")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(msg);
            } else if (msg.contains("Invalid")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(msg);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(msg);
            }
        }
    }

    // Logout Endpoint
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok("Logged out successfully");
    }

    // Account Activation Endpoint
    @GetMapping("/activate")
    public ResponseEntity<?> activate(@RequestParam String token) {
        try {
            String message = userService.activateAccount(token);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Get Cards Endpoint
    @GetMapping("/cards/{userId}")
    public ResponseEntity<?> getCards(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getCards(userId));
    }

    // Add Card Endpoint
    @PostMapping("/cards/{userId}")
    public ResponseEntity<?> addCard(@PathVariable Long userId,
            @RequestBody PaymentCardRequest request) {
        return ResponseEntity.ok(userService.addCard(userId, request));
    }

    // Delete Card Endpoint
    @DeleteMapping("/cards/{cardId}")
    public ResponseEntity<?> deleteCard(@PathVariable Long cardId) {
        userService.deleteCard(cardId);
        return ResponseEntity.ok("Deleted");
    }

    // Forgot Password Endpoint
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");

            userService.sendPasswordResetEmail(email);

            return ResponseEntity.ok("If this email exists, a reset link has been sent");

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Reset Password Endpoint
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest request) {
        try {
            userService.resetPassword(request);
            return ResponseEntity.ok("Password reset successful");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Favorites Endpoints
    @GetMapping("/favorites/{userId}")
    public ResponseEntity<?> getFavorites(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getFavorites(userId));
    }

    // Add Favorite Endpoint
    @PostMapping("/favorites/{userId}")
    public ResponseEntity<?> addFavorite(@PathVariable Long userId,
            @RequestBody Map<String, Long> body) {

        Long movieId = body.get("movieId");

        return ResponseEntity.ok(
                userService.addFavorite(userId, movieId));
    }

    // Delete Favorite Endpoint
    @DeleteMapping("/favorites/{id}")
    public ResponseEntity<?> deleteFavorite(@RequestParam Long userId,
            @RequestParam Long movieId) {

        userService.deleteFavorite(userId, movieId);
        return ResponseEntity.ok("Deleted");
    }
}