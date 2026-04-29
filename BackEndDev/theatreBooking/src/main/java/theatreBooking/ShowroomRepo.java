package theatreBooking;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ShowroomRepo extends JpaRepository<Showroom, Long> {
    Optional<Showroom> findByName(String name);
}