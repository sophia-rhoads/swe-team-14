package theatreBooking;

import java.util.List;

public class RecommendationRequest {
    private List<Long> favoriteMovieIds;

    public List<Long> getFavoriteMovieIds() {
        return favoriteMovieIds;
    }

    public void setFavoriteMovieIds(List<Long> favoriteMovieIds) {
        this.favoriteMovieIds = favoriteMovieIds;
    }
}