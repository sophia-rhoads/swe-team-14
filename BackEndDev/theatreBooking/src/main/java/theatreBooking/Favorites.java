package theatreBooking;
import jakarta.persistence.*;
import java.util.List;
import java.time.LocalDate;

public class Favorites {

   @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long favId;

    private LocalDate favDate;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;

   
    public Movie getMovie() {
    return movie;
}

public void setMovie(Movie movie) {
    this.movie = movie;
}//movie

public Customer getCustomer() {
    return customer;
}

public void setCustomer(Customer customer) {
    this.customer = customer;
}//cust

}
