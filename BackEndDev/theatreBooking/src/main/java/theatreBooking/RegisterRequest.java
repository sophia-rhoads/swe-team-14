package theatreBooking;

import java.util.List;

public class RegisterRequest {

    public String username;
    public String firstName;
    public String lastName;
    public String email;
    public String password;

    public String phone;
    public String dateOfBirth;

    public String street;
    public String city;
    public String county;
    public String state;
    public String zip;

    public List<PaymentCardRequest> paymentCards;
}
