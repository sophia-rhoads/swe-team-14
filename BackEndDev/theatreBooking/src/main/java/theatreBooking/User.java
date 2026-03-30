package theatreBooking;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String firstName;
    private String lastName;

    @Column(unique = true)
    private String email;

    private String password;

    private String phoneNumber;

    private LocalDate dateOfBirth;

    // Address fields(optional)
    private String street;
    private String city;
    private String county;
    private String state;
    private String zipCode;

    // Payment cards (max 3)
    @ElementCollection

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<PaymentCard> cards;

    private String role; // CUSTOMER or ADMIN

    private String status = "ACTIVE"; // ACTIVE / INACTIVE

    public User() {
    }

    public User(String username, String firstName, String lastName, String email, String password, String role,
            String status, String phoneNumber, LocalDate dateOfBirth,
            String street, String city, String county, String state, String zipCode, List<String> paymentCards) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.status = status;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.dateOfBirth = dateOfBirth;
        this.street = street;
        this.city = city;
        this.county = county;
        this.state = state;
        this.zipCode = zipCode;
    }

    // getters & setters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCounty() {
        return county;
    }

    public void setCounty(String county) {
        this.county = county;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getZipCode() {
        return zipCode;
    }

    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    public List<PaymentCard> getCards() {
        return cards;
    }

    public void setCards(List<PaymentCard> cards) {
        this.cards = cards;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}