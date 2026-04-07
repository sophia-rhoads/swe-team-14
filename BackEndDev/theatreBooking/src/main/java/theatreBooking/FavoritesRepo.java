package theatreBooking;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FavoritesRepo extends JpaRepository<Favorites, Long> {

    List<Favorites> findByCustomerId(Long customerId);
}