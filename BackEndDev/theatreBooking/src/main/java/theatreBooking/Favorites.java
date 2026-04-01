package theatreBooking;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDate;


@Entity
public class Favorites {

   
  @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    
      
    private Long favId;

    private LocalDate favDate;

    //private Favorites favorites;
    

    @ManyToOne
    @JoinColumn(name = "customer_id")
    @JsonBackReference
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


public LocalDate getFavDate() {
    return favDate;
}

public void setFavDate(LocalDate favDate) {
    this.favDate = favDate;
}//date


}//add movie






