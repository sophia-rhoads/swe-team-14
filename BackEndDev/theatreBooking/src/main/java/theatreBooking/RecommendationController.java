package theatreBooking;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:4200")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping
    public List<RecommendationDto> getRecommendations(@RequestBody RecommendationRequest request) {
        return recommendationService.recommendMovies(request.getFavoriteMovieIds());
    }
}