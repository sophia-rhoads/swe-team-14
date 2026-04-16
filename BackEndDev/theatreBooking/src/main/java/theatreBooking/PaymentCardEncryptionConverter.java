package theatreBooking;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;

@Converter
public class PaymentCardEncryptionConverter implements AttributeConverter<String, String> {

    private static final String PREFIX = "enc:";
    private static final String SECRET = "team14-cinema-card-key";

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null || attribute.isBlank()) {
            return attribute;
        }

        if (attribute.startsWith(PREFIX)) {
            return attribute;
        }

        try {
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(buildKey(), "AES"));
            byte[] encrypted = cipher.doFinal(attribute.getBytes(StandardCharsets.UTF_8));
            return PREFIX + Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            throw new RuntimeException("Unable to encrypt payment card number", e);
        }
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return dbData;
        }

        if (!dbData.startsWith(PREFIX)) {
            return dbData;
        }

        try {
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(buildKey(), "AES"));
            byte[] decoded = Base64.getDecoder().decode(dbData.substring(PREFIX.length()));
            return new String(cipher.doFinal(decoded), StandardCharsets.UTF_8);
        } catch (Exception e) {
            throw new RuntimeException("Unable to decrypt payment card number", e);
        }
    }

    private byte[] buildKey() throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] key = digest.digest(SECRET.getBytes(StandardCharsets.UTF_8));
        byte[] aesKey = new byte[16];
        System.arraycopy(key, 0, aesKey, 0, 16);
        return aesKey;
    }
}