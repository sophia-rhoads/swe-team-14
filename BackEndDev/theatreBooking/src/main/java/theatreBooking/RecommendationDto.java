package theatreBooking;

public class RecommendationDto {
    private Long movieId;
    private String title;
    private String genre;
    private String posterUrl;
    private Double imdbRating;
    private String reason;
    private double score;

    public RecommendationDto() {
    }

    public RecommendationDto(Long movieId, String title, String genre, String posterUrl,
                             Double imdbRating, String reason, double score) {
        this.movieId = movieId;
        this.title = title;
        this.genre = genre;
        this.posterUrl = posterUrl;
        this.imdbRating = imdbRating;
        this.reason = reason;
        this.score = score;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
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

    public String getPosterUrl() {
        return posterUrl;
    }

    public void setPosterUrl(String posterUrl) {
        this.posterUrl = posterUrl;
    }

    public Double getImdbRating() {
        return imdbRating;
    }

    public void setImdbRating(Double imdbRating) {
        this.imdbRating = imdbRating;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }
}