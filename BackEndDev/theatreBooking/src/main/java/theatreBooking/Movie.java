package theatreBooking;

import jakarta.persistence.*;

@Entity
@Table(name = "movie")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String genre;
    @Column(name = "mpaa_rating")
    private String mpaaRating;

    @Column(name = "imdb_rating")
    private Double imdbRating;
    private String director;
    private String producer;

    @Column(length = 2000)
    private String description;

    private String trailerUrl;
    private String posterUrl;

    private String status; // CURRENTLY_RUNNING or COMING_SOON

    // Constructors
    public Movie() {
    }

    public Movie(String title, String genre, String mpaaRating, Double imdbRating,
            String director, String producer,
            String description, String trailerUrl,
            String posterUrl, String status) {
        this.title = title;
        this.genre = genre;
        this.mpaaRating = mpaaRating;
        this.imdbRating = imdbRating;
        this.director = director;
        this.producer = producer;
        this.description = description;
        this.trailerUrl = trailerUrl;
        this.posterUrl = posterUrl;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getMpaaRating() {
        return mpaaRating;
    }

    public void setMpaaRating(String mpaaRating) {
        this.mpaaRating = mpaaRating;
    }

    public Double getImdbRating() {
        return imdbRating;
    }

    public void setImdbRating(Double imdbRating) {
        this.imdbRating = imdbRating;
    }

    public String getDirector() {
        return director;
    }

    public void setDirector(String director) {
        this.director = director;
    }

    public String getProducer() {
        return producer;
    }

    public void setProducer(String producer) {
        this.producer = producer;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTrailerUrl() {
        return trailerUrl;
    }

    public void setTrailerUrl(String trailerUrl) {
        this.trailerUrl = trailerUrl;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}