package theatreBooking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TheatreBookingApplication {
	public static void main(String[] args) {
		SpringApplication.run(TheatreBookingApplication.class, args);
	}
}