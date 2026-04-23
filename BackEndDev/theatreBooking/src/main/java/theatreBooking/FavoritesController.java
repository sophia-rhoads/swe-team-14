package theatreBooking;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin
public class FavoritesController {

    private final FavoritesService service;

    public FavoritesController(FavoritesService service) {
        this.service = service;
    }

    @PostMapping("/toggle")
    public Map<String, Boolean> toggle(@RequestParam Long userId, @RequestParam Long movieId) {
        boolean isFavorite = service.toggleFavorite(userId, movieId);
        return Map.of("favorite", isFavorite);
    }

    @GetMapping("/{userId}")
    public List<Movie> getFavorites(@PathVariable Long userId) {
        return service.getFavorites(userId);
    }

    @DeleteMapping("{userId}/{movieId}")
    public void removeFavorite(@PathVariable Long userId, @PathVariable Long movieId) {
        service.removeFavorite(userId, movieId);
    }
}