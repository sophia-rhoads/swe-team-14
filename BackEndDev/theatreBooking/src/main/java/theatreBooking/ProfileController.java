package theatreBooking;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:4200")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping("/{userId}")
    public UserProfileResponse getProfile(@PathVariable Long userId) {
        return profileService.getProfile(userId);
    }

    @PutMapping("/{userId}")
    public UserProfileResponse updateProfile(
            @PathVariable Long userId,
            @RequestBody ProfileUpdateRequest request) {
        return profileService.updateProfile(userId, request);
    }
}