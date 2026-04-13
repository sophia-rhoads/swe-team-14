
    package theatreBooking;

import jakarta.persistence.*;

@Entity
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String seatNumber; // e.g. A1, B2

    private boolean isBooked = false;

    @ManyToOne
    @JoinColumn(name = "showroom_id")
    private Showroom showroom;

    public Long getId() {
         return id; 
    }

    public String getSeatNumber() { 
        return seatNumber; 
    }
    public void setSeatNumber(String seatNumber) { 
        this.seatNumber = seatNumber; 
    }

    public boolean isBooked() { 
        return isBooked; 
    }
    public void setBooked(boolean booked) {
         isBooked = booked; 
        }

    public Showroom getShowroom() { 
        return showroom; 
    }
    public void setShowroom(Showroom showroom) {
         this.showroom = showroom;
         }
}

