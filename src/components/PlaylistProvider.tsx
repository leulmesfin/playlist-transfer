import React, { createContext, useState, useContext } from 'react';
import { Playlist } from '../routes/playlistsRoute';

interface PlaylistMap {
    [key: string]: [string];
}

interface PlaylistContextType {
    selectedPlaylists: Playlist[];
    failedPlaylists: PlaylistMap;
    setSelectedPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;
    setFailedPlaylists: React.Dispatch<React.SetStateAction<PlaylistMap>>;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider = ({ children }) => {
    const [selectedPlaylists, setSelectedPlaylists] = useState<Playlist[]>([]);
    const [failedPlaylists, setFailedPlaylists] = useState<PlaylistMap>({});

    return (
        <PlaylistContext.Provider value={{ selectedPlaylists, failedPlaylists, setSelectedPlaylists, setFailedPlaylists }}>
            {children}
        </PlaylistContext.Provider>
    );
};

export const usePlaylist = () => {  
    const context = useContext(PlaylistContext);
    if (context === undefined) {
        throw new Error("usePlaylist must be used within a PlaylistProvider");
    }
    return context;
}
