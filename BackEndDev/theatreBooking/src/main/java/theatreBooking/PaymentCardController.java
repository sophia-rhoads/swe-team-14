package theatreBooking;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
@CrossOrigin(origins = "http://localhost:4200")
public class PaymentCardController {

    private final UserService userService;

    public PaymentCardController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<PaymentCard>> getCards(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getCards(userId));
    }

    @PostMapping("/{userId}")
    public ResponseEntity<?> addCard(@PathVariable Long userId,
            @RequestBody PaymentCardRequest request) {
        try {
            return ResponseEntity.ok(userService.addCard(userId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{cardId}")
    public ResponseEntity<?> deleteCard(@PathVariable Long cardId) {
        userService.deleteCard(cardId);
        return ResponseEntity.ok("Card deleted successfully");
    }
}