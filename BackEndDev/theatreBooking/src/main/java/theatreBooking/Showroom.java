package theatreBooking;

import java.util.List;

import jakarta.persistence.*;

@Entity
public class Showroom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int capacity;

@OneToMany(mappedBy = "showtime", cascade = CascadeType.ALL)
private List<Seat> seats;

    @OneToMany(mappedBy = "showroom", cascade = CascadeType.ALL)
    private List<Showtime> showtimes;

    public Long getId() { return id; }

    public List<Seat> getSeats() {
         return seats;
         }
    public void setSeats(List<Seat> seats) {
         this.seats = seats; 
        }
 
}
