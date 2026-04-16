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

    @PostMapping("/payment-card")
    public String addPaymentCard(@RequestParam Long customerId, @RequestBody PaymentCardRequest request) {
        userService.addCard(customerId, request);
        return "Payment card added";
    }
}