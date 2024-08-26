package musictransferauth.auth;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Scanner;

import io.github.cdimascio.dotenv.Dotenv;

public class AppleMusicApiKeys {
  private static final Dotenv dotenv = Dotenv.load();
  private static final String APPLE_PRIVATE_KEY = retrieveApplePrivateKey();
  private static final String APPLE_TEAM_ID = dotenv.get("APPLE_TEAM_ID");
  private static final String APPLE_KEY_ID = dotenv.get("APPLE_KEY_ID");

  /* This function opens the apple_private_key.p8 file, reads its contents and returns it as a string for later use */
    private static String retrieveApplePrivateKey() {
        try {
            File file = new File("auth/src/main/java/musictransferauth/auth/apple_private_key.p8");
            Scanner scan = new Scanner(file);
            String apple_private_key = "";
            
            while (scan.hasNextLine()) {
                apple_private_key = apple_private_key.concat(scan.nextLine()).concat("\n"); // preserve the line breaks bc its a p8 file
            }
            // System.out.println("Apple private key: " + apple_private_key);
            scan.close(); // close the scanner
            return apple_private_key.trim(); // remove the extra trailing new line
        } catch(FileNotFoundException e) {
            System.out.println("ERROR: File not found.");
            e.printStackTrace();
        }
        return null;
    }
  
    public static String getApplePrivateKey() {
        return APPLE_PRIVATE_KEY;
    }

    public static String getAppleTeamID() {
        return APPLE_TEAM_ID;
    }

    public static String getAppleKeyID() {
        return APPLE_KEY_ID;  
    }
}
