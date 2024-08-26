import React, { createContext, useState, useContext } from 'react';
import { Playlist } from '../routes/playlistsRoute';

interface PlaylistContextType {
    selectedPlaylists: Playlist[];
    setSelectedPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider = ({ children }) => {
    const [selectedPlaylists, setSelectedPlaylists] = useState<Playlist[]>([]);

    return (
        <PlaylistContext.Provider value={{ selectedPlaylists, setSelectedPlaylists }}>
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
