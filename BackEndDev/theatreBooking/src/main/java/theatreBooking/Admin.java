package theatreBooking;
import jakarta.persistence.*;

@Entity
@DiscriminatorValue("ADMIN")
//@Table(name = "Admin")

public class Admin extends User {

}