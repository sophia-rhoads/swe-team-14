
package theatreBooking;

import jakarta.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "userType")
public abstract class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fName;
    private String lName;
    private String email;
    private String password; 
    
     public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    } //id

     public String getFname() {
        return fName;
    }

    public void setFname(String fName) {
        this.fName = fName;
    } //fname

public String getLname() {
        return lName;
    }

    public void setLname(String lName) {
        this.lName = lName;
    } //lname

public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    } //email

    public String getPass() {
        return password;
    }

    public void setPass(String password) {
        this.password = password;
    } //psswd



}

