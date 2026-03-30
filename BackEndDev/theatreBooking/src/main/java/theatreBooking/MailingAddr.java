package theatreBooking;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class MailingAddr {

@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String street;
    private String city;
    private String state;
    private int zipCode;

    @OneToOne
    @JoinColumn(name = "customer_id")

    private Customer customer;


 public void setStreet(String street) {
        this.street = street;
    }

    public String getStreet() {
        return street;
    }//Street


     public void setCity(String city) {
        this.city = city;
    }

    public String getCity() {
        return city;
    }//city

     public void setState(String state) {
        this.state = street;
    }


    public String getState() {
        return state;
    }//State

     public void setZip(int zipCode) {
        this.zipCode = zipCode;
    }

    public int getZip() {
        return zipCode;
    }//zip



}
