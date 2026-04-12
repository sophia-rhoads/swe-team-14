package theatreBooking;

import java.util.List;

import jakarta.persistence.*;

@Entity
public class Showroom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int capacity;

    @OneToMany(mappedBy = "showroom", cascade = CascadeType.ALL)
    private List<Showtime> showtimes;

    public int setTotalSeats() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setTotalSeats'");
    }
}
