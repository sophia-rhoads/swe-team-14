package theatreBooking;

import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private static final String GEMINI_MODEL = "gemini-2.5-flash";
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/"
            + GEMINI_MODEL + ":generateContent";

    // Pattern that matches a JSON array of integers, e.g. [12, 7, 3]
    private static final Pattern ID_ARRAY_PATTERN = Pattern.compile("\\[\\s*(\\d+(?:\\s*,\\s*\\d+)*)\\s*,?\\s*$");

    private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    private final AppProperties appProperties;

    private final CustomerRepo customerRepo;
    private final BookingHistoryRepo bookingHistoryRepo;
    private final FavoritesRepo favoritesRepo;
    private final MovieRepo movieRepo;

    public RecommendationService(CustomerRepo customerRepo,
            BookingHistoryRepo bookingHistoryRepo,
            FavoritesRepo favoritesRepo,
            MovieRepo movieRepo,
            AppProperties appProperties) {
        this.customerRepo = customerRepo;
        this.bookingHistoryRepo = bookingHistoryRepo;
        this.favoritesRepo = favoritesRepo;
        this.movieRepo = movieRepo;
        this.appProperties = appProperties;
    }

    // Public entry point

    public List<Movie> getRecommendations(Long userId) {

        customerRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        String apiKey = appProperties.getApiKey();

        // Collect every movie the user has already engaged with
        Set<Long> alreadyEngaged = new HashSet<>();
        List<Movie> engagedMovies = new ArrayList<>();

        bookingHistoryRepo.findByCustomerIdOrderByBookedAtDesc(userId).forEach(b -> {
            alreadyEngaged.add(b.getMovie().getId());
            engagedMovies.add(b.getMovie());
        });
        favoritesRepo.findByCustomer_Id(userId).forEach(f -> {
            alreadyEngaged.add(f.getMovie().getId());
            engagedMovies.add(f.getMovie());
        });

        System.out.println("[Recommendations] userId=" + userId + " — engaged=" + alreadyEngaged.size());

        // Candidates — movies the user has NOT yet seen or favourited
        List<Movie> candidates = movieRepo.findAll().stream()
                .filter(Movie::isActive)
                .filter(m -> !alreadyEngaged.contains(m.getId()))
                .toList();

        System.out.println("[Recommendations] candidates=" + candidates.size());

        if (candidates.isEmpty())
            return List.of();

        // Build anonymized preference profile
        AnonymizedProfile profile = buildAnonymizedProfile(engagedMovies);
        System.out.println("[Recommendations] genres=" + profile.topGenres() + " directors=" + profile.topDirectors()
                + " avgImdb=" + profile.avgImdbRating());

        if (apiKey == null || apiKey.isBlank() || "NOT_CONFIGURED".equals(apiKey)) {
            System.out.println("[Recommendations] API key not configured — using local ranking");
            return rankLocally(profile, candidates, engagedMovies);
        }

        // Ask Gemini to rank up to 5 candidates, then fall back to local ranking
        // if the external service returns unusable data.
        List<Long> recommendedIds;
        try {
            recommendedIds = callGemini(profile, candidates);
        } catch (RuntimeException e) {
            System.out.println("[Recommendations] Falling back to local ranking: " + e.getMessage());
            return rankLocally(profile, candidates, engagedMovies);
        }

        System.out.println("[Recommendations] final IDs: " + recommendedIds);

        // Return full Movie objects in Gemini's ranked order
        Map<Long, Movie> byId = candidates.stream()
                .collect(Collectors.toMap(Movie::getId, m -> m));

        List<Movie> ranked = recommendedIds.stream()
                .map(byId::get)
                .filter(Objects::nonNull)
                .toList();

        return ranked.isEmpty() ? rankLocally(profile, candidates, engagedMovies) : ranked;
    }

    private List<Movie> rankLocally(AnonymizedProfile profile, List<Movie> candidates, List<Movie> engagedMovies) {
        Set<String> preferredGenres = new HashSet<>(profile.topGenres());
        Set<String> preferredDirectors = new HashSet<>(profile.topDirectors());
        Set<String> preferredRatings = new HashSet<>(profile.mpaaRatings());

        boolean hasTasteProfile = !engagedMovies.isEmpty();

        return candidates.stream()
                .sorted(Comparator
                        .comparingDouble((Movie movie) -> scoreCandidate(
                                movie, preferredGenres, preferredDirectors, preferredRatings, hasTasteProfile))
                        .reversed()
                        .thenComparing(Movie::getTitle, Comparator.nullsLast(String::compareToIgnoreCase)))
                .limit(5)
                .toList();
    }

    private double scoreCandidate(Movie movie,
            Set<String> preferredGenres,
            Set<String> preferredDirectors,
            Set<String> preferredRatings,
            boolean hasTasteProfile) {
        double score = 0.0;

        if (hasTasteProfile) {
            if (movie.getGenre() != null && preferredGenres.contains(movie.getGenre()))
                score += 5.0;
            if (movie.getDirector() != null && preferredDirectors.contains(movie.getDirector()))
                score += 3.0;
            if (movie.getMpaaRating() != null && preferredRatings.contains(movie.getMpaaRating()))
                score += 1.0;
        } else if (movie.getStatus() == MovieStatus.CURRENTLY_RUNNING) {
            score += 2.0;
        }

        if (movie.getImdbRating() != null)
            score += movie.getImdbRating() / 2.0;

        return score;
    }

    // Step 1: Build anonymized preference profile
    private AnonymizedProfile buildAnonymizedProfile(List<Movie> engaged) {
        if (engaged.isEmpty()) {
            return new AnonymizedProfile(List.of(), List.of(), List.of(), null);
        }

        List<String> topGenres = topN(engaged, Movie::getGenre, 5);
        List<String> topDirectors = topN(engaged, Movie::getDirector, 3);

        List<String> mpaaRatings = engaged.stream()
                .filter(m -> m.getMpaaRating() != null)
                .map(Movie::getMpaaRating)
                .distinct()
                .toList();

        Double avgImdb = engaged.stream()
                .filter(m -> m.getImdbRating() != null)
                .mapToDouble(Movie::getImdbRating)
                .average()
                .stream().boxed().findFirst()
                .map(v -> Math.round(v * 10.0) / 10.0)
                .orElse(null);

        return new AnonymizedProfile(topGenres, topDirectors, mpaaRatings, avgImdb);
    }

    // Returns the top-N most frequent non-null values for a movie field.
    private List<String> topN(List<Movie> movies,
            java.util.function.Function<Movie, String> field,
            int n) {
        return movies.stream()
                .filter(m -> field.apply(m) != null)
                .collect(Collectors.groupingBy(field, Collectors.counting()))
                .entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(n)
                .map(Map.Entry::getKey)
                .toList();
    }

    // Step 2: call Google Gemini API
    private List<Long> callGemini(AnonymizedProfile profile, List<Movie> candidates) {

        String prompt = buildPrompt(profile, buildCatalogueText(candidates));
        String reqBody = buildGeminiRequestBody(prompt);

        // Gemini authenticates via query param ?key= (NOT an Authorization header)
        String url = GEMINI_API_URL + "?key=" + appProperties.getApiKey();

        System.out.println("[Recommendations] Calling Gemini...");

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(20))
                    .POST(HttpRequest.BodyPublishers.ofString(reqBody))
                    .build();

            HttpResponse<String> response = HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("[Recommendations] Gemini status=" + response.statusCode());
            System.out.println("[Recommendations] Gemini body=" + response.body());

            if (response.statusCode() != 200) {
                throw new RuntimeException(
                        "Gemini HTTP " + response.statusCode()
                                + ": " + response.body());
            }

            return parseGeminiResponse(response.body());

        } catch (RuntimeException e) {
            System.out.println("[Recommendations] Gemini call failed: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.out.println("[Recommendations] Unexpected error: " + e.getMessage());
            throw new RuntimeException(
                    "Recommendation service unavailable: " + e.getMessage(), e);
        }
    }

    // Step 3: Build request JSON manually
    private String buildGeminiRequestBody(String prompt) {
        String escapedPrompt = prompt
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");

        return "{"
                + "\"contents\":[{\"parts\":[{\"text\":\"" + escapedPrompt + "\"}]}],"
                + "\"generationConfig\":{"
                + "\"maxOutputTokens\":1024,"
                + "\"temperature\":0.2"
                + "}"
                + "}";
    }

    // Step 4: Build the prompt
    private String buildCatalogueText(List<Movie> candidates) {
        StringBuilder sb = new StringBuilder();
        for (Movie m : candidates) {
            sb.append(String.format(
                    "ID:%d | %s | Genre:%s | Director:%s | MPAA:%s | IMDB:%s\n",
                    m.getId(),
                    m.getTitle(),
                    m.getGenre() != null ? m.getGenre() : "N/A",
                    m.getDirector() != null ? m.getDirector() : "N/A",
                    m.getMpaaRating() != null ? m.getMpaaRating() : "N/A",
                    m.getImdbRating() != null ? m.getImdbRating() : "N/A"));
        }
        return sb.toString();
    }

    private String buildPrompt(AnonymizedProfile p, String catalogue) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are a movie recommendation engine for a cinema booking system.\n\n");

        sb.append("ANONYMIZED VIEWER PREFERENCES (no personal data):\n");
        if (!p.topGenres().isEmpty())
            sb.append("- Favourite genres: ")
                    .append(String.join(", ", p.topGenres())).append("\n");
        if (!p.topDirectors().isEmpty())
            sb.append("- Preferred directors: ")
                    .append(String.join(", ", p.topDirectors())).append("\n");
        if (!p.mpaaRatings().isEmpty())
            sb.append("- MPAA ratings enjoyed: ")
                    .append(String.join(", ", p.mpaaRatings())).append("\n");
        if (p.avgImdbRating() != null)
            sb.append("- Average IMDB score of movies watched: ")
                    .append(p.avgImdbRating()).append("\n");

        sb.append("\nAVAILABLE MOVIES IN CATALOGUE:\n").append(catalogue);
        sb.append("""
                INSTRUCTIONS:
                Select up to 5 movies from the catalogue above that this viewer would most enjoy.
                Consider genre match, director style, and IMDB quality score.
                Respond with ONLY a JSON array of the numeric movie IDs in order of best match.
                Example: [12, 7, 3, 25, 19]
                Do NOT include any explanation, markdown code fences, or extra text.
                Only output the JSON array.
                """);

        return sb.toString();
    }

    // Step 5: parse Gemini response (regex)
    private List<Long> parseGeminiResponse(String body) {
        try {
            // Navigate to the "text" field value inside the response string
            int textKey = body.indexOf("\"text\"");
            if (textKey == -1) {
                System.out.println("[Recommendations] No 'text' field in response");
                return List.of();
            }

            int valueStart = body.indexOf("\"", textKey + 6) + 1;
            int valueEnd = findJsonStringEnd(body, valueStart);
            if (valueEnd == -1)
                return List.of();

            String rawText = body.substring(valueStart, valueEnd)
                    .replace("\\n", "\n")
                    .replace("\\\"", "\"")
                    .replace("\\\\", "\\")
                    .trim();

            System.out.println("[Recommendations] Gemini text: " + rawText);

            // Strip any accidental markdown code fences
            rawText = rawText.replaceAll("(?s)```[a-zA-Z]*\\s*", "")
                    .replaceAll("```", "")
                    .trim();

            // Extract the first [N, N, N, N, N] integer array from the text
            Matcher m = ID_ARRAY_PATTERN.matcher(rawText);
            if (!m.find()) {
                System.out.println("[Recommendations] No integer array found in: " + rawText);
                return List.of();
            }

            String[] parts = m.group(1).split("\\s*,\\s*");
            List<Long> ids = new ArrayList<>();
            for (String part : parts) {
                ids.add(Long.parseLong(part.trim()));
            }
            return ids;

        } catch (Exception e) {
            System.out.println("[Recommendations] Parse error: " + e.getMessage());
            return List.of(); // graceful fallback — never crash the home page
        }
    }

    private int findJsonStringEnd(String s, int start) {
        for (int i = start; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '\\') {
                i++;
                continue;
            } // skip escaped char
            if (c == '"') {
                return i;
            }
        }
        return -1;
    }

    // Internal record
    private record AnonymizedProfile(
            List<String> topGenres,
            List<String> topDirectors,
            List<String> mpaaRatings,
            Double avgImdbRating) {
    }
}
