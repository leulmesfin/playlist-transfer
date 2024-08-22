package musictransferauth;

public class Playlist {
    private final String name;
    private final String uri;
    private final String tracksHref;

    public Playlist(String name, String uri, String tracksHref) {
        this.name = name;
        this.uri = uri;
        this.tracksHref = tracksHref;
    }

    // getters
    public String getName() {
        return name;
    }

    public String getUri() {
        return uri;
    }

    public String getTracksHref() {
        return tracksHref;
    }
}
