package theatreBooking;

import jakarta.persistence.*;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Customer extends User {

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PaymentCard> paymentCards = new ArrayList<>();

    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL)
    @JsonManagedReference
    private MailingAddr mailingAddr;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Favorites> favorites = new ArrayList<>();

    // Getters & Setters
    public List<PaymentCard> getPaymentCards() {
        return paymentCards;
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

    // Business Logic
    public void addPaymentCard(PaymentCard card) {
        if (paymentCards.size() >= 3) {
            throw new RuntimeException("Max 3 cards allowed");
        }
        card.setCustomer(this);
        paymentCards.add(card);
    }

    public void addFavorites(Movie movie) {
        boolean exists = favorites.stream()
                .anyMatch(f -> f.getMovie().getId().equals(movie.getId()));

        if (!exists) {
            Favorites fav = new Favorites();
            fav.setMovie(movie);
            fav.setCustomer(this);
            favorites.add(fav);
        }
    }
}