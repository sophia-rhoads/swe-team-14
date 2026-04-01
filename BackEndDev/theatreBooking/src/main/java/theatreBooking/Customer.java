package theatreBooking;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue("CUSTOMER")
@SecondaryTable(name = "Customer")
public class Customer extends User {

    @Enumerated(EnumType.STRING)
    private UserState userState;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Favorites> favorites = new ArrayList<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PaymentCard> paymentCards = new ArrayList<>();

    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private MailingAddr mailingAddr;

    public void addPaymentCard(PaymentCard card) {
        card.setCustomer(this);
        this.paymentCards.add(card);
    }

    public void addFavMovie(Movie movie) {
        Favorites favorite = new Favorites();
        favorite.setCustomer(this);
        favorite.setMovie(movie);
        favorite.setFavDate(LocalDate.now());
        this.favorites.add(favorite);
    }

    public List<PaymentCard> getPaymentCards() {
        return paymentCards;
    }

    public void setPaymentCards(List<PaymentCard> paymentCards) {
        this.paymentCards = paymentCards;
    }

    public MailingAddr getMailingAddr() {
        return mailingAddr;
    }

    public void setMailingAddr(MailingAddr mailingAddr) {
        this.mailingAddr = mailingAddr;
        if (mailingAddr != null) {
            mailingAddr.setCustomer(this);
        }
    }

    public List<Favorites> getFavorites() {
        return favorites;
    }

    public void setFavorites(List<Favorites> favorites) {
        this.favorites = favorites;
    }
}