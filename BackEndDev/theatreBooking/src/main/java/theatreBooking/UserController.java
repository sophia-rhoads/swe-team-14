package theatreBooking;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Add favorites
    @PostMapping("/favorite")
    public String addFavorite(@RequestParam Long customerId,
            @RequestParam String movieName) {
        userService.addFavorite(customerId, movieName);
        ;
        return "Favorite added";
    }

    // Add payment card
    @PostMapping("/payment-card")
    public String addPaymentCard(@RequestParam Long customerId,
            @RequestBody PaymentCardRequest request) {
        userService.addCard(customerId, request);
        return "Payment card added";
    }
}