package theatreBooking;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class PaymentCard {

@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long cardNum;
    private String billingAddr;
    private LocalDate expDate;
    private String cardType;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;


    
    public void setCardNum(Long cardNum) {
        this.cardNum = cardNum;
    }

    public Long getCardNum() {
        return cardNum;
    }//cardnum



    private void setAddr(String billingAddr) {
        this.billingAddr = billingAddr;
    }

    public String getAddr() {
        return billingAddr;
    }//addr

    private void setExpDate(LocalDate expDate) {
        this.expDate = expDate;
    }

    public LocalDate getExpDate() {
        return expDate;
    }//expdate

    private void setCardType(String cardType) {
        this.cardType = cardType;
    }

    public String getCardType() {
        return cardType;
    }//cardtype

    public void setCustomer(Customer customer2) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setCustomer'");
    }

}
