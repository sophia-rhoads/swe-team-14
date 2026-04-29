package theatreBooking;

import java.time.LocalDate;

public class ProfileUpdateRequest {
    private String username;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String phone;
    private String password;
    private String preferences;
    private boolean promotionsOptIn;

    private MailingAddr address;

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

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPreferences() {
        return preferences;
    }

    public void setPreferences(String preferences) {
        this.preferences = preferences;
    }

    public boolean isPromotionsOptIn() {
        return promotionsOptIn;
    }

    public void setPromotionsOptIn(boolean promotionsOptIn) {
        this.promotionsOptIn = promotionsOptIn;
    }

    public MailingAddr getAddress() {
        return address;
    }

    public void setAddress(MailingAddr address) {
        this.address = address;
    }

}
