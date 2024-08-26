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
import musictransferauth.Tracks;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.SpotifyHttpManager;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.credentials.AuthorizationCodeCredentials;
import se.michaelthelin.spotify.model_objects.specification.Paging;
import se.michaelthelin.spotify.model_objects.specification.PlaylistSimplified;
import se.michaelthelin.spotify.model_objects.specification.PlaylistTrack;
import se.michaelthelin.spotify.model_objects.specification.Track;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeRequest;
import se.michaelthelin.spotify.requests.authorization.authorization_code.AuthorizationCodeUriRequest;
import se.michaelthelin.spotify.requests.data.playlists.GetListOfCurrentUsersPlaylistsRequest;
import se.michaelthelin.spotify.requests.data.playlists.GetPlaylistsItemsRequest;

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
                Tracks tracks = new Tracks(playlistObj.getTracks()); 
                // System.out.println("tracks obj: " + tracks);
                Playlist playlist = new Playlist(playlistObj.getName(), playlistObj.getImages()[0].getUrl(), tracks, playlistObj.getId());
                // System.out.println("playlist obj: " + playlist);
                list.add(playlist); 
            }
            // System.out.println("list: " + list);
            // System.out.println("\n");
            return list;
            // return playlistSimplifiedPaging.getItems(); // spotify api request succeeded, return an array of PlaylistSimplified objects
        } catch (IOException | SpotifyWebApiException | org.apache.hc.core5.http.ParseException e) {
            System.out.println("Error: " + e.getMessage());
        }
        Playlist playlist = new Playlist("Chimmy Chunga", "hello", null, "hey");
        list.add(playlist);
        return new ArrayList<>(); // spotify api request failed, so return an empty list
    } 

    @CrossOrigin(origins = "http://localhost:5173")
    @GetMapping(value = "get-playlist-tracks")
    public ArrayList<LeulPlaylistTrack> getTrack_Sync(@RequestParam String playlistId) {
        ArrayList<LeulPlaylistTrack> tracksList = new ArrayList<>();

        try {
            GetPlaylistsItemsRequest getPlaylistsItemsRequest = spotifyApi
                .getPlaylistsItems(playlistId)
                .build();

            final Paging<PlaylistTrack> playlistTrackPaging = getPlaylistsItemsRequest.execute();
            System.out.println("Total tracks: " + playlistTrackPaging.getTotal());
            // System.out.println("Track's first artist: " + ((Track) playlistTrackPaging.getItems()[0].getTrack()).getArtists()[0]);
            PlaylistTrack[] playlistTrackArr = playlistTrackPaging.getItems();
            for (PlaylistTrack track : playlistTrackArr) {
                LeulPlaylistTrack playlistTrack = new LeulPlaylistTrack(((Track) track.getTrack()).getName(), (((Track) track.getTrack()).getArtists()[0]).getName());
                tracksList.add(playlistTrack);
                System.out.println("Track Name: " + ((Track) track.getTrack()).getName());
                System.out.println("Track Artist: " + (((Track) track.getTrack()).getArtists()[0]).getName());
                System.out.println("\n\n");
            }
            return tracksList;
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
        return null;
    }

}
