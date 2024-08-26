package musictransferauth.auth;

// named it LeulPlaylistTrack to avoid conflict with built-in Track and PlaylistTrack classes in Java Spotify API library
public class LeulPlaylistTrack {
    private final String name;
    private final String artist;

    public LeulPlaylistTrack(String name, String artist) {
        this.name = name;
        this.artist = artist;
    }

    public String getName() {
        return name;
    }

    public String getArtist() {
        return artist;
    }

    @Override
    public String toString() {
        return "LeulPlaylistTrack(name=" + this.name + ", artist=" + this.artist + ")";
    }
}
