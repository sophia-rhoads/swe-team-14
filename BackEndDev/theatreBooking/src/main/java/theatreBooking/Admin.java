package theatreBooking;
import jakarta.persistence.*;

@Entity
@DiscriminatorValue("ADMIN")


public class Admin extends User {

}