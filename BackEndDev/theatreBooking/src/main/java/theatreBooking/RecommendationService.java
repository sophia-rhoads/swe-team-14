package theatreBooking;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private final MovieRepo movieRepo;

    public RecommendationService(MovieRepo movieRepo) {
        this.movieRepo = movieRepo;
    }

    public List<RecommendationDto> recommendMovies(List<Long> favoriteMovieIds) {
        if (favoriteMovieIds == null || favoriteMovieIds.isEmpty()) {
            return getFallbackRecommendations();
        }

        List<Movie> favoriteMovies = movieRepo.findAllById(favoriteMovieIds);
        List<Movie> allMovies = movieRepo.findAll();

        Set<Long> favoriteIdSet = favoriteMovies.stream()
                .map(Movie::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<String, Integer> genreWeights = new HashMap<>();
        Map<String, Integer> directorWeights = new HashMap<>();
        Map<String, Integer> producerWeights = new HashMap<>();

        for (Movie movie : favoriteMovies) {
            addWeight(genreWeights, movie.getGenre());
            addWeight(directorWeights, movie.getDirector());
            addWeight(producerWeights, movie.getProducer());
        }

        Map<String, RecommendationDto> bestByTitle = new HashMap<>();

        for (Movie movie : allMovies) {
            if (movie.getId() == null || favoriteIdSet.contains(movie.getId())) {
                continue;
            }

            double score = 0.0;
            List<String> reasons = new ArrayList<>();

            if (movie.getGenre() != null && genreWeights.containsKey(movie.getGenre())) {
                score += genreWeights.get(movie.getGenre()) * 5.0;
                reasons.add("Matches your favorite genre: " + movie.getGenre());
            }

            if (movie.getDirector() != null && directorWeights.containsKey(movie.getDirector())) {
                score += directorWeights.get(movie.getDirector()) * 3.0;
                reasons.add("Same director as one of your favorites");
            }

            if (movie.getProducer() != null && producerWeights.containsKey(movie.getProducer())) {
                score += producerWeights.get(movie.getProducer()) * 2.0;
                reasons.add("Similar producer preference");
            }

            if (movie.getImdbRating() != null) {
                score += movie.getImdbRating() / 10.0;
            }

            if (movie.getStatus() != null && movie.getStatus().name().equals("CURRENTLY_RUNNING")) {
                score += 0.5;
            }

            if (score <= 0) {
                continue;
            }

            String reason = reasons.isEmpty()
                    ? "Recommended based on your favorites"
                    : String.join(", ", reasons);

            RecommendationDto dto = new RecommendationDto(
                    movie.getId(),
                    movie.getTitle(),
                    movie.getGenre(),
                    movie.getPosterUrl(),
                    movie.getImdbRating(),
                    reason,
                    score
            );

            String key = movie.getTitle() == null
                    ? String.valueOf(movie.getId())
                    : movie.getTitle().trim().toLowerCase();

            if (!bestByTitle.containsKey(key) || dto.getScore() > bestByTitle.get(key).getScore()) {
                bestByTitle.put(key, dto);
            }
        }

        return bestByTitle.values().stream()
                .sorted(Comparator.comparingDouble(RecommendationDto::getScore).reversed())
                .limit(10)
                .collect(Collectors.toList());
    }

    private List<RecommendationDto> getFallbackRecommendations() {
        Map<String, RecommendationDto> bestByTitle = new HashMap<>();

        for (Movie movie : movieRepo.findAll()) {
            double score = movie.getImdbRating() == null ? 0.0 : movie.getImdbRating();

            RecommendationDto dto = new RecommendationDto(
                    movie.getId(),
                    movie.getTitle(),
                    movie.getGenre(),
                    movie.getPosterUrl(),
                    movie.getImdbRating(),
                    "Popular recommendation based on overall catalog quality",
                    score
            );

            String key = movie.getTitle() == null
                    ? String.valueOf(movie.getId())
                    : movie.getTitle().trim().toLowerCase();

            if (!bestByTitle.containsKey(key) || dto.getScore() > bestByTitle.get(key).getScore()) {
                bestByTitle.put(key, dto);
            }
        }

        return bestByTitle.values().stream()
                .sorted(Comparator.comparingDouble(RecommendationDto::getScore).reversed())
                .limit(10)
                .collect(Collectors.toList());
    }

    private void addWeight(Map<String, Integer> map, String value) {
        if (value != null && !value.isBlank()) {
            map.put(value, map.getOrDefault(value, 0) + 1);
        }
    }
}