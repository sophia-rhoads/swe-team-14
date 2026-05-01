package theatreBooking;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FavoritesRepo extends JpaRepository<Favorites, Long> {

    List<Favorites> findByCustomer_Id(Long customerId);

    Optional<Favorites> findByCustomer_IdAndMovie_Id(Long customerId, Long movieId);

    void deleteByCustomer_IdAndMovie_Id(Long customerId, Long movieId);

    void deleteByMovie_Id(Long movieId);

    boolean existsByCustomer_IdAndMovie_Id(Long customerId, Long movieId);
}