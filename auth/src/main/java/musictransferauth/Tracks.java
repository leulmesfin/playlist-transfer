package musictransferauth;

import se.michaelthelin.spotify.model_objects.miscellaneous.PlaylistTracksInformation;
// this class unpacks the PlaylistTracksInformation object into an easily digestiable object
// for use in the client
public class Tracks {
    private final int totalTracks;
    private final String trackHref;

    public Tracks(PlaylistTracksInformation tracksInfo) {
        this.trackHref = tracksInfo.getHref();
        this.totalTracks = tracksInfo.getTotal();
    }

    public String getTrackHref() {
        return this.trackHref;
    }
    public int getTotalTracks() {
        return this.totalTracks;
    }
    @Override
    public String toString() {
        return "Tracks[href=" + this.trackHref + ", totalTracks=" + this.totalTracks + "]";
    }
}
