package theatreBooking;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Safe holder for all custom application properties related to recommendation
 * service.
 */
@Component
@ConfigurationProperties(prefix = "gemini")
public class AppProperties {

    /**
     * Google AI Studio API key for the Gemini recommendation service.
     * Set in application.properties as: gemini.apiKey=AIza...
     */
    private String apiKey = "NOT_CONFIGURED";

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }
}