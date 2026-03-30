package theatreBooking;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("CUSTOMER")
@SecondaryTable(name = "Customer")

public class Customer extends User{


    @Enumerated(EnumType.STRING)
    private UserState userState;

     @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
private List<Favorites> favorites = new ArrayList<>();

@OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PaymentCard> paymentCards;

    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
private MailingAddr mailingAddr;


    // private String street;
    // private String city;
    // private String county;
    // private String state;
    // private String zipCode;

    
 //private String role; // CUSTOMER or ADMIN


  public void addPaymentCard(PaymentCard card) {
    card.setCustomer(this);
    this.paymentCards.add(card);
//Logic to limit num f cards 
}


public void addFavMovie(Movie movie) {

    Favorites favorite = new Favorites();
    favorite.setCustomer(this); 
    favorite.setMovie(movie);
    favorite.setFavDate(LocalDate.now());

    this.favorites.add(favorite);
}
//Add/removie favorites
public List<PaymentCard> getPaymentCards() {
    return paymentCards;
}

public void setPaymentCards(List<PaymentCard> paymentCards) {
    this.paymentCards = paymentCards;
}//paycards

public MailingAddr getMailingAddr() {
    return mailingAddr;
}//mailing

public void setMailingAddr(MailingAddr mailingAddr) {
    this.mailingAddr = mailingAddr;
    
}
public List<Favorites> getFavorites() {
    return favorites;
}
private void setFavorites(List<Favorites> favorites) {
    this.favorites = favorites; }

// public String getStreet() {
//         return street;
//     }

//     public void setStreet(String street) {
//         this.street = street;
//     }

//     public String getCity() {
//         return city;
//     }

//     public void setCity(String city) {
//         this.city = city;
//     }

//     public String getCounty() {
//         return county;
//     }

//     public void setCounty(String county) {
//         this.county = county;
//     }

//     public String getState() {
//         return state;
//     }

//     public void setState(String state) {
//         this.state = state;
//     }

//     public String getZipCode() {
//         return zipCode;
//     }

//     public void setZipCode(String zipCode) {
//         this.zipCode = zipCode;
//     }

    public List<PaymentCard> getCards() {
        return paymentCards;
    }

    public void setCards(List<PaymentCard> cards) {
        this.paymentCards = cards;
    }

}

