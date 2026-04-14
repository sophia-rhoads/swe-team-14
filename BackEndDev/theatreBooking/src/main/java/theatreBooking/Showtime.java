package theatreBooking;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;

@Entity
public class Showtime{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    LocalDateTime time;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Showroom showroom;
    private int totalSeats;
    

// @OneToMany(mappedBy = "showtime", cascade = CascadeType.ALL)
// private List<Seat> seats;

@OneToMany(mappedBy = "showtime", cascade = CascadeType.ALL)
private List<Seat> seats;

public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


public LocalDateTime getTime() {
        return time;
    }

    public void setTime(LocalDateTime time) {
        this.time = time;
    }

 public Movie getMovie() { 
    return movie;

  }
public void setMovie(Movie movie) { 
    this.movie = movie; 
}

public Showroom getShowRoom() { 
    return showroom;

 }
public void setShowRoom(Showroom room) {
     this.showroom = room; }

public int getTotalSeats() {
     return totalSeats;
     }
public void setTotalSeats(int totalSeats) {
     this.totalSeats = totalSeats;
     }

public List<Seat> getSeats() {
         return seats;
         }
    public void setSeats(List<Seat> seats) {
         this.seats = seats; 
        }


}