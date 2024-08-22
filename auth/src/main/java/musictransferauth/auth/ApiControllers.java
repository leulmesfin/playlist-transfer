package musictransferauth.auth;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import musictransferauth.Playlist;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.PlaylistSimplified;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRequest;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeUriRequest;
import se.michaelthelin.spotify.requests.data.playlists.GetListOfCurrentUsersPlaylistsRequest;

@RestController
@RequestMapping("/api")
public class ApiControllers {
    private static final URI redirectUri = SpotifyHttpManager.makeUri("http://localhost:8080/api/get-code");
    private String code = "";
    private static final SpotifyApi spotifyApi = new SpotifyApi.Builder()
    .setClientId(SpotifyApiKeys.getSpotifyClientID())
    .setClientSecret(SpotifyApiKeys.getSpotifyClientSecret())
    .setRedirectUri(redirectUri)
    .build();

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping("/login")
    @ResponseBody
    public String spotifyLogin() {
        AuthorizationCodeUriRequest authorizationCodeUriRequest = spotifyApi.authorizationCodeUri()
            .scope("playlist-read-private user-read-email user-read-private")
            .show_dialog(true)
            .build();
        final URI uri = authorizationCodeUriRequest.execute();
        System.out.println(AppleMusicApiKeys.getApplePrivateKey());
        return uri.toString();
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping(value = "get-code")
    public String getSpotifyCode(@RequestParam("code") String userCode, HttpServletResponse response) throws IOException {
        code = userCode;
        AuthorizationCodeRequest authorizationCodeRequest = spotifyApi.authorizationCode(code)
        .build();
        try {
            final AuthorizationCodeCredentials authorizationCodeCredentials = authorizationCodeRequest.execute();

            // set access and refresh token for more spotifyApi object usage
            spotifyApi.setAccessToken(authorizationCodeCredentials.getAccessToken());
            spotifyApi.setRefreshToken(authorizationCodeCredentials.getRefreshToken());

            System.out.println("Expires in: " + authorizationCodeCredentials.getExpiresIn());
        } catch (IOException | SpotifyWebApiException | org.apache.hc.core5.http.ParseException e) {
            System.out.println("Error: " + e.getMessage());
        }
        response.sendRedirect("http://localhost:5173/get-playlists");
        return spotifyApi.getAccessToken();
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping(value = "get-playlists")
    public ArrayList<Playlist> getPlaylists() {
        ArrayList<Playlist> list = new ArrayList<>();

        final GetListOfCurrentUsersPlaylistsRequest getListOfCurrentUsersPlaylistsRequest = spotifyApi
            .getListOfCurrentUsersPlaylists()
            // .limit(15)
            // .offset(5)
            .build();
        try {
            final Paging<PlaylistSimplified> playlistSimplifiedPaging = getListOfCurrentUsersPlaylistsRequest.execute();
            PlaylistSimplified[] playlistSimplifiedArr = playlistSimplifiedPaging.getItems();

            for (PlaylistSimplified playlistObj : playlistSimplifiedArr) {
                Playlist playlist = new Playlist(playlistObj.getName(), playlistObj.getImages()[0].getUrl(), playlistObj.getTracks().getHref());
                list.add(playlist); 
            }
            return list;
            // return playlistSimplifiedPaging.getItems(); // spotify api request succeeded, return an array of PlaylistSimplified objects
        } catch (IOException | SpotifyWebApiException | org.apache.hc.core5.http.ParseException e) {
            System.out.println("Error: " + e.getMessage());
        }
        Playlist playlist = new Playlist("Chimmy Chunga", "hello", "hola");
        list.add(playlist);
        return new ArrayList<>(); // spotify api request failed, so return an empty list
    } 

}
