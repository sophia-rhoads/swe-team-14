package theatreBooking;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;
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
            // REMOVE
            favoritesRepo.delete(existing.get());
            return false;
        } else {
            // ADD (only if not exists)
            Movie movie = movieRepo.findById(movieId).orElseThrow(() -> new RuntimeException("Movie not found"));

            Favorites fav = new Favorites();
            fav.setCustomer(customer);
            fav.setMovie(movie);

            favoritesRepo.save(fav);
            return true;
        }
    }

    public List<Movie> getFavorites(Long userId) {
        Map<Long, Movie> uniqueMovies = new LinkedHashMap<>();

        favoritesRepo.findByCustomer_Id(userId)
                .stream()
                .map(Favorites::getMovie)
                .forEach(movie -> uniqueMovies.put(movie.getId(), movie));

        return List.copyOf(uniqueMovies.values());
    }

    public void removeFavorite(Long userId, Long movieId) {
        Favorites favorite = favoritesRepo.findByCustomer_IdAndMovie_Id(userId, movieId)
                .orElseThrow(() -> new RuntimeException("Favorite not Found"));

        favoritesRepo.delete(favorite);
    }
}