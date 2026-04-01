package theatreBooking;
import jakarta.persistence.*;

@Entity
@DiscriminatorValue("ADMIN")
@SecondaryTable(name = "Admin")
//@Inheritance(strategy = InheritanceType.JOINED)

public class Admin extends User {

}