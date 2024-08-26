package musictransferauth.auth;

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Base64;
import java.util.Date;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.jsonwebtoken.Jwts;

@RestController
@RequestMapping("/music")
public class MusicKitController {
    // 3 variables: private key, key id, team id
    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/developer-token")
    @ResponseBody
    public ResponseEntity<String> getDeveloperToken() {
        try {
            // System.out.println("apple private key: " + AppleMusicApiKeys.getApplePrivateKey());
            String token = getDevToken(AppleMusicApiKeys.getApplePrivateKey(),  AppleMusicApiKeys.getAppleKeyID(), AppleMusicApiKeys.getAppleTeamID());
            
            return ResponseEntity.ok(token); // http 200 success response
        } catch(Exception e) {
            return ResponseEntity.internalServerError().build(); // http 500 internal server error
        }
    }

    public String getDevToken(String privateKey, String keyID, String teamID) {
        try {
            // generate a JWT 
            // Decode the key
            // Remove PEM headers, footers, and any whitespace
            privateKey = privateKey.replaceAll("-----BEGIN PRIVATE KEY-----", "")
            .replaceAll("-----END PRIVATE KEY-----", "")
            .replaceAll("\\s", "");
            byte[] decodedKey = Base64.getDecoder().decode(privateKey);
            // Create the private key
            PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(decodedKey);
            KeyFactory keyFactory = KeyFactory.getInstance("EC");
            PrivateKey newPrivateKey = keyFactory.generatePrivate(keySpec);

            String jwt = Jwts.builder()  
                .header()
                .keyId(keyID)
                .add("alg", "ES256")
                .and()
            
                .issuer(teamID)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 3600000)) // makes this JWT expire in 1 hr
                .signWith(newPrivateKey, Jwts.SIG.ES256) // signing the jwt
                .compact();
            
            return jwt;
        } catch(Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
