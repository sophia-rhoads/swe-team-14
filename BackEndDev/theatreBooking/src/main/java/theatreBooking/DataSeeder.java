package theatreBooking;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ShowroomRepo showroomRepo;

    public DataSeeder(ShowroomRepo showroomRepo) {
        this.showroomRepo = showroomRepo;
    }

    @Override
    public void run(String... args) {
        seedShowroom("Athens AMC — Showroom 1", 35);
        seedShowroom("Athens AMC — Showroom 2", 35);
        seedShowroom("Athens AMC — Showroom 3", 35);
    }

    private void seedShowroom(String name, int capacity) {
        if (showroomRepo.findByName(name).isPresent()) {
            return; // already seeded — skip
        }

        Showroom room = new Showroom();
        room.setName(name);
        room.setCapacity(capacity);

        // Persist the Showroom first so it gets a DB-generated ID before any Seat
        // objects reference it.
        Showroom savedRoom = showroomRepo.save(room);

        List<Seat> templateSeats = new ArrayList<>();

        // Rows A, B, C — 7 seats each (21 seats total)
        for (String row : new String[] { "A", "B", "C" }) {
            for (int col = 1; col <= 7; col++) {
                Seat seat = new Seat();
                seat.setSeatNumber(row + col);
                seat.setShowroom(savedRoom);
                seat.setBooked(false);

                templateSeats.add(seat);
            }
        }

        // Rows D, E — 5 seats each (10 seats), raised back section
        for (String row : new String[] { "D", "E" }) {
            for (int col = 1; col <= 5; col++) {
                Seat seat = new Seat();
                seat.setSeatNumber(row + col);
                seat.setShowroom(savedRoom);
                seat.setBooked(false);
                templateSeats.add(seat);
            }
        }

        savedRoom.setSeats(templateSeats);
        showroomRepo.save(savedRoom); // CascadeAll persists all 35 seats
    }
}