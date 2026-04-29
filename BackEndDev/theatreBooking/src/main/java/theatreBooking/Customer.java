package theatreBooking;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
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
}