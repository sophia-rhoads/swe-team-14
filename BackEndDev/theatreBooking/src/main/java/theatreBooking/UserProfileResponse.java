package theatreBooking;

public class UserProfileResponse {
    private Long id;
    private String username;
    private String email;
    private String phoneNumber;
    private String homeAddress;
    private String city;
    private String state;
    private String zipCode;

    public UserProfileResponse() {
    }

    public UserProfileResponse(User user, MailingAddr addr) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.phoneNumber = user.getPhoneNumber();

        if (addr != null) {
            this.homeAddress = addr.getStreet();
            this.city = addr.getCity();
            this.state = addr.getState();
            this.zipCode = addr.getZip();
        }
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getHomeAddress() {
        return homeAddress;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getZipCode() {
        return zipCode;
    }
}