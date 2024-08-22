package musictransferauth.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class AuthApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.load();
		System.setProperty("SPOTIFY_CLIENT_ID", dotenv.get("SPOTIFY_CLIENT_ID"));
		System.setProperty("SPOTIFY_CLIENT_SECRET", dotenv.get("SPOTIFY_CLIENT_SECRET"));
		SpringApplication.run(AuthApplication.class, args);
	}

}
