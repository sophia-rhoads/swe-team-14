package theatreBooking;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class FavoritesService {

    private final FavoritesRepo favoritesRepo;
    private final CustomerRepo customerRepo;
    private final MovieRepo movieRepo;

    public FavoritesService(FavoritesRepo favoritesRepo, CustomerRepo customerRepo, MovieRepo movieRepo) {
        this.favoritesRepo = favoritesRepo;
        this.customerRepo = customerRepo;
        this.movieRepo = movieRepo;
    }

    public boolean toggleFavorite(Long userId, Long movieId) {
        Customer customer = customerRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Favorites> existing = favoritesRepo.findByCustomer_IdAndMovie_Id(userId, movieId);

        if (existing.isPresent()) {
            favoritesRepo.delete(existing.get());
            return false;
        }

        Movie movie = movieRepo.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        Favorites fav = new Favorites();
        fav.setCustomer(customer);
        fav.setMovie(movie);
        favoritesRepo.save(fav);
        return true;
    }

    public List<Movie> getFavorites(Long userId) {
        return favoritesRepo.findByCustomer_Id(userId)
                .stream()
                .map(Favorites::getMovie)
                .distinct()
                .toList();
    }

    public void removeFavorite(Long userId, Long movieId) {
        Favorites favorite = favoritesRepo.findByCustomer_IdAndMovie_Id(userId, movieId)
                .orElseThrow(() -> new RuntimeException("Favorite not found"));
        favoritesRepo.delete(favorite);
    }
}