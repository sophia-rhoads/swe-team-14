package theatreBooking;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class UserService {

    

    private final UserRepo userRepo;
    private final PaymentCardRepo paymentCardRepository;
    private final BCryptPasswordEncoder encoder;
 private final MovieRepo movieRepo;
    

    public UserService(UserRepo userRepo,
            PaymentCardRepo paymentCardRepository,
            BCryptPasswordEncoder encoder, MovieRepo movieRepo) {
        this.userRepo = userRepo;
        this.paymentCardRepository = paymentCardRepository;
        this.encoder = encoder;
         this.movieRepo = movieRepo;
    }

    public Optional<User> findByEmail(String email) {
        return userRepo.findByEmail(email);
    }


      public Optional<User> findById(Long id) {
        return userRepo.findById(id);
    }
 


    public User register(RegisterRequest request) {

        if (request.email == null || request.email.isBlank()) {
            throw new RuntimeException("Email is required");
        }

        if (request.password == null || request.password.isBlank()) {
            throw new RuntimeException("Password is required");
        }

        if (request.confirmPassword == null || request.confirmPassword.isBlank()) {
            throw new RuntimeException("Confirm Password is required");
        }

        if (!request.password.equals(request.confirmPassword)) {
            throw new RuntimeException("Passwords do not match");
        }

        if (userRepo.findByEmail(request.email).isPresent()) {
            throw new RuntimeException("This Email is already tied to an account");
        }

    
        // User newUser;

        // if ("admin".equals(request.role)) {

        // }else 

        Customer customer = new Customer();
        customer.setUsername(request.username);
        customer.setFirstName(request.firstName);
        customer.setLastName(request.lastName);
        customer.setEmail(request.email);
        customer.setPassword(encoder.encode(request.password));
        customer.setPhoneNumber(request.phone);
        customer.setStatus("ACTIVE");
       
        

        if (request.dateOfBirth != null && !request.dateOfBirth.isBlank()) {
            customer.setDateOfBirth(LocalDate.parse(request.dateOfBirth));
        }

        // Create user
        //User user = new User();
      // Customer newCustomer = new Customer();
        
   

        MailingAddr addr = new MailingAddr();
        addr.setStreet(request.street);
        addr.setCity(request.city);
        addr.setState(request.state);
        addr.setZip(request.zip);

             customer.setUsername(request.username);
        customer.setFirstName(request.firstName);
        customer.setLastName(request.lastName);
        customer.setEmail(request.email);
  customer.setStreet(request.street);
        customer.setCity(request.city);
       // customer.setCounty(request.county);
        customer.setState(request.state);
        customer.setZipCode(request.zip);
  customer.setMailingAddr(addr);

        customer.setPhoneNumber(request.phone);

        // only keep this if MailingAddr has county field
        // addr.setCounty(request.county);

      

        if (request.dateOfBirth != null) {
            customer.setDateOfBirth(LocalDate.parse(request.dateOfBirth));
        }

      

        //user.setRole("CUSTOMER");

        // ACTIVE by default (you can change later for email verification)
        customer.setStatus("ACTIVE");

        // Save user first
        
        //customer= userRepo.save(customer);
        
        return userRepo.save(customer);
    }

    public User login(String email, String password) {
        Optional<User> userOpt = userRepo.findByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            if (encoder.matches(password, user.getPassword())) {
                return user;
            }
        }

        throw new RuntimeException("Invalid email or password");
    }//login

    public User saveUser(User user) {
        return userRepo.save(user);
    }



   public void addFavService(Long cId, Long mId) {

    Customer c = (Customer) userRepo.findById(cId)
        .orElseThrow(()-> new RuntimeException("Error finding User"));

        Movie m = (Movie) movieRepo.findById(mId)
        .orElseThrow(()-> new RuntimeException("Error finding Movie"));

        c.addFavMovie(m);
        userRepo.save(c);
   }//addfav

}
