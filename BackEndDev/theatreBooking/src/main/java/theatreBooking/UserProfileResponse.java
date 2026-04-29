package theatreBooking;

import java.time.LocalDate;

public class UserProfileResponse {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String email;
    private String phone;
    private String preferences;
    private boolean promotionsOptIn;

    private MailingAddr address;

    public UserProfileResponse() {
    }

    public UserProfileResponse(User user, MailingAddr addr) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.dateOfBirth = user.getDateOfBirth();
        this.email = user.getEmail();
        this.phone = user.getPhone();
        this.preferences = user.getPreferences();
        this.promotionsOptIn = user.isPromotionsOptIn();
        this.address = addr;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getPreferences() {
        return preferences;
    }

    public boolean isPromotionsOptIn() {
        return promotionsOptIn;
    }

    public MailingAddr getAddress() {
        return address;
    }
}
