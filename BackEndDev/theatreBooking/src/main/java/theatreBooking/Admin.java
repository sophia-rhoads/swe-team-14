package theatreBooking;
import jakarta.persistence.*;

@Entity
@DiscriminatorValue("ADMIN")
@SecondaryTable(name ="Admin")

public class Admin extends User {

}