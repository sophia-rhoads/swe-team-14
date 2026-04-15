package theatreBooking;

import jakarta.persistence.*;

@Entity
public class PaymentCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String cardNumber;
    private String cardType;
    private String expirationDate;
    private String billingZipCode;
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getCardType() {
        return cardType;
    }

    public void setCardType(String cardType) {
        this.cardType = cardType;
    }

    public String getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(String expirationDate) {
        this.expirationDate = expirationDate;
    }

    public String getBillingZipCode() {
        return billingZipCode;
    }

    public void setBillingZipCode(String billingZipCode) {
        this.billingZipCode = billingZipCode;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }
}