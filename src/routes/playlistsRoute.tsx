import React, { useEffect, useState } from "react";
import Card from "../components/card";
import AppleMusicAuth from "../components/AppleMusicAuth";
import { usePlaylist } from "../components/PlaylistProvider";
import CardComponent from "../components/card";
import { Heading, VStack, SimpleGrid, Box } from "@chakra-ui/react";
interface Tracks {
	totalTracks: number;
	trackHref: string;
}
interface Song {
	name: string;
	artist: string;
}
export type Playlist = {
	name: string;
	imageUrl: string;
	tracksInfo: Tracks;
	id: string;
	// songs: Song;
};

const PlaylistsRoute = () => {
	const [isSelected, setSelected] = useState(false);
	const [playlists, setPlaylists] = useState<Playlist[]>([]);
	const { selectedPlaylists, setSelectedPlaylists } = usePlaylist();
	let songs = [];

	const toggleSelect = async (playlist: Playlist) => {
		const playlistFound = selectedPlaylists.some(
			(p) => p.imageUrl === playlist.imageUrl
		);
		if (playlistFound) {
			// remove the playlist from playlists (don't mutate playlists, set playlists to new arr)
			setSelectedPlaylists(
				selectedPlaylists.filter((p) => p.imageUrl != playlist.imageUrl)
			);
		} else {
			// add the playlist to playlists
			setSelectedPlaylists([...selectedPlaylists, { ...playlist}]);
		}
	};

	useEffect(() => {
		// only fetch if the playlist list is empty
		if (playlists.length == 0) {
			fetch("http://localhost:8080/api/get-playlists")
				.then((response) => response.json())
				.then((data) => {
					// console.log("data from get-playlists: ", data);
					// parse this data into type Playlist and Tracks, then set to playlists lst
					const formattedPlaylists = data.map((playlist: any) => {
						// console.log("playlist tracks: ", playlist);
						return {
							name: playlist.name as String,
							imageUrl: playlist.imageUrl as String,
							tracksInfo: playlist.tracks as Tracks,
							id: playlist.id as String,
						};
					});
					// setPlaylists(prevPlaylists => [...prevPlaylists, ...formattedPlaylists])
					console.log("formatted playlists: ", formattedPlaylists);
					setPlaylists((prevPlaylists) => formattedPlaylists);
				})
				.catch((error) => console.error("Error fetching playlists:", error));
		}
	}, [playlists.length]);

	// used for testing to see the selected playlists
	useEffect(() => {
		console.log("Updated selectedPlaylists:", selectedPlaylists);
	}, [selectedPlaylists]);

	return (
		<div>
			{/* <h1>Playlists</h1> */}
			<VStack spacing={10}>
				<VStack spacing={17}>
					<Heading>Playlists</Heading>
					{selectedPlaylists.length > 0 ? <AppleMusicAuth /> : null}
				</VStack>

				<SimpleGrid columns={3} spacing="20px">
					{playlists.map((playlist: Playlist, index) => {
						// console.log("playlists: ", playlists);
						// console.log("playlist track info: ", playlist.tracksInfo);
						return (
							// <div key={index}> hey</div>
							<CardComponent
								key={playlist.tracksInfo.trackHref}
								name={playlist.name}
								imageUrl={playlist.imageUrl}
								isSelected={selectedPlaylists.some(
									(p) => p.imageUrl === playlist.imageUrl
								)}
								toggleSelect={() => toggleSelect(playlist)}
							/>
						);
					})}
				</SimpleGrid>
			</VStack>
		</div>
	);
};

const fetchPlaylistTracks = async (id: string) => {
	try {
		const resp = await fetch(
			`http://localhost:8080/api/get-playlist-tracks?playlistId=${id}`
		);
		const data = await resp.json();
		console.log("data in fetch playlist tracks: ", data);
		return data;
	} catch (error) {
		console.log("Error: ", error);
		return [];
	}
};

export default PlaylistsRoute;
