package musictransferauth;

public class Playlist {
    private final String name;
    private final String imageUrl;
    private final Tracks tracksInfo;
    private final String id; // playlist id

    public Playlist(String name, String imageUrl, Tracks tracksInfo, String id) {
        this.name = name;
        this.imageUrl = imageUrl;
        this.tracksInfo = tracksInfo;
        this.id = id;
    }

    // implement a toString()

    // getters
    public String getName() {
        return name;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public Tracks getTracks() {
        return tracksInfo;
    }

    public String getID() {
        return id;
    }
    @Override
    public String toString() {
        return "Playlist[name=" + this.name + ", imageUrl=" + this.imageUrl + ", tracksInfo=" + this.tracksInfo + ", id=" + this.id + "]";
    }
}
