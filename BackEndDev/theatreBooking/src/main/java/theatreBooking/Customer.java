package theatreBooking;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("CUSTOMER")

public class Customer extends User{

    @Enumerated(EnumType.STRING)
    private UserState userState;

    public void addPaymentCard(PaymentCard card) {
    card.setCustomer(this);
    this.paymentCards.add(card);
//Logic to limit num f cards
    
}//user

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
private List<Favorites> favorites = new ArrayList<>();

@OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PaymentCard> paymentCards;

    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
private MailingAddr mailingAddr;

   // private Customer customer;


public List<PaymentCard> getPaymentCards() {
    return paymentCards;
}

public void setPaymentCards(List<PaymentCard> paymentCards) {
    this.paymentCards = paymentCards;
}//paycards

public MailingAddr getMailingAddr() {
    return mailingAddr;
}

public void setMailingAddr(MailingAddr mailingAddr) {
    this.mailingAddr = mailingAddr;
}//addr

public List<Favorites> getFavorites() {
    return favorites;
}

private void setFavorites(List<Favorites> favorites) {
    this.favorites = favorites;
}//fav

public void addFavMovie(Movie movie) {

    Favorites favorite = new Favorites();
    favorite.setCustomer(this); 
    favorite.setMovie(movie);
    favorite.setFavDate(LocalDate.now());

    this.favorites.add(favorite);
}
//Add/removie favorites
}
