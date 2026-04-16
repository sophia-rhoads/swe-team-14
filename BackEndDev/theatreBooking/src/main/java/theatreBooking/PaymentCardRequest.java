package theatreBooking;

public class PaymentCardRequest {
    public String cardHolderName;
    public String cardType;
    public String cardNumber;
    public String expirationDate;
    public String billingZipCode;

    // Getters for JSON deserialization compatibility
    public String getCardHolderName() {
        return cardHolderName;
    }

    public String getCardType() {
        return cardType;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public String getExpirationDate() {
        return expirationDate;
    }

    public String getBillingZipCode() {
        return billingZipCode;
    }
}