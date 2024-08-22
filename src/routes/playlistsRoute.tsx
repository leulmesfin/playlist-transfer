import React, { useEffect, useState } from "react";
import Card from "../components/card";
import AppleMusicAuth from "../components/AppleMusicAuth";

export type Playlist = {
	name: string
	uri: string
	tracksHref: string
}
const playlist1 = {
	name: "Soul",
	uri: "/assets/adele.jpg",
	tracksHref: "hey"
}
const playlist2 = {
	name: "Reggaeton",
	uri: "/assets/bunny.jpg",
	tracksHref: "hey"
}


const PlaylistsRoute = () => {
	const [isSelected, setSelected] = useState(false);
	const [playlists, setPlaylists] = useState<Playlist[]>([]);
	const [selectedPlaylists, setSelectedPlaylists] = useState<Playlist[]>([]);

	const toggleSelect = (playlist: Playlist) => {
		const playlistFound = selectedPlaylists.some((p) => p.uri === playlist.uri)
		if (playlistFound) {
			// remove the playlist from playlists (don't mutate playlists, set playlists to new arr)
			setSelectedPlaylists(selectedPlaylists.filter((p) => p.uri != playlist.uri))
		} else {
			// add the playlist to playlists
			setSelectedPlaylists([...selectedPlaylists, playlist])
		}
  	}

	useEffect(() => {
		fetch("http://localhost:8080/api/get-playlists")
		.then(response => response.json())
		.then(data => {
			setPlaylists(data)
		})
		.catch(error => console.error('Error fetching playlists:', error));
	}, []);
	
	// used for testing to see the selected playlists
	useEffect(() => {
	console.log("Updated selectedPlaylists:", selectedPlaylists);
	}, [selectedPlaylists]);

	return (
		<div>
			<h1>Playlists</h1>
			{playlists.map((playlist: Playlist) => {
				return (
					<Card 
						key={playlist.uri}
						name={playlist.name}
						uri={playlist.uri}
						isSelected={selectedPlaylists.some((p) => p.uri === playlist.uri)}
						toggleSelect={() => toggleSelect(playlist)}
					/>
				)
			})}
			<AppleMusicAuth />
		</div>
	);
};

export default PlaylistsRoute;
