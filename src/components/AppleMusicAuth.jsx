import React, { useEffect, useState } from "react";
import useMusicKit from "./MusicKitHook";
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify, faApple } from "@fortawesome/free-brands-svg-icons";
import { Spinner } from "@chakra-ui/react";
import { usePlaylist } from "../components/PlaylistProvider";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const AppleMusicAuth = () => {
	const { musicKit, instance } = useMusicKit();
	const navigate = useNavigate();
	const MotionButton = motion(Button);
	const [isLoading, setIsLoading] = useState(false);
	const { selectedPlaylists } = usePlaylist();
  const [waitTime, setWaitTime] = useState(3000);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 4000);
    }
  }, [isLoading]);

	useEffect(() => {
		const getPlaylists = async () => {
			console.log("chosen playlists in result: ", selectedPlaylists);
		};
		getPlaylists();
	}, []);

	const handleAuthorize = async () => {
		console.log("clicking apple btn: ", musicKit);
		if (musicKit) {
			try {
				await musicKit.authorize();
				console.log("Auth successful!");
        // only upload to apple music if 
        // fetch tracks for each selected playlist
        for (const playlist of selectedPlaylists) {
          const tracks = await fetchPlaylistTracks(playlist.id);
          playlist.songs = tracks;
        }
        if (selectedPlaylists.length > 0) {
          await uploadPlaylistsToAppleMusic(instance, selectedPlaylists);
        }
				navigate("/result");
			} catch (error) {
				console.error("Auth failed! ", error);
			}
		}
	};

	return (
		<div>
			<MotionButton
				whileTap={{ scale: 0.85 }}
				size="md"
				bg="customRed.50"
				leftIcon={
					isLoading ? null : <FontAwesomeIcon size="lg" icon={faApple} />
				}
				//onClick={() => handleAuthorize()}
				onClick={() => {
					setIsLoading(!isLoading);
          handleAuthorize();
				}}
			>
				{isLoading ? <Spinner speed="0.70s" /> : "Upload to Apple Music"}
			</MotionButton>
			{/* <button onClick={handleAuthorize}>Authorize Apple Music</button> */}
		</div>
	);
};

const fetchPlaylistTracks = async (id) => {
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

/// upload logic
export const getHeader = (instance) => {
	const header = {
		Authorization: `Bearer ${instance.developerToken}`,
		Accept: "application/json",
		"Content-Type": "application/json",
		"Music-User-Token": instance.musicUserToken,
	};
	return header;
};

// this function makes a POST request to create a new playlist in an authorized user's Apple Music library
const createAppleMusicPlaylist = async (instance, data) => {
	const response = await fetch(
		"https://api.music.apple.com/v1/me/library/playlists",
		{
			headers: getHeader(instance),
			method: "POST",
			body: JSON.stringify(data),
			mode: "cors",
		}
	);

	const responseJson = await response.json();
	console.log("response: ", responseJson);
	return responseJson.data[0].id; // returns the playlist id
};

// function that 1. creates a playlist for each playlist in selectedPlaylists, 2. then adds its tracks to that playlist
// get 1 working first (done), get 2
const uploadPlaylistsToAppleMusic = async (musicKitInstance, playlists) => {
	// map thru every playlist in playlists, create a playlist
	// map thru songs (synchronously) and add to playlist
	console.log("playlists: ", playlists);
	for (const playlist of playlists) {
		const songIdList = [];
		for (const song of playlist.songs) {
			console.log("song: ", song);
			await delay(50); // Wait .05 second between each songId fetch
			const songId = await getSongId(musicKitInstance, song.name, song.artist);
			if (songId) {
				const trackData = {
					id: songId,
					type: "songs",
				};
				songIdList.push(trackData);
			} else {
				console.log(
					"OOPS! The track with name: " +
						song.name +
						" and artistName: " +
						song.artist +
						" does not exist in Apple Music :("
				);
			}
		}

		let data = {
			attributes: {
				name: playlist.name,
				description: "...",
				artwork: {
					url: playlist.imageUrl,
					"width:": 640,
					height: 640,
				},
			},
			relationships: {
				tracks: {
					data: [],
				},
			},
		};
		// create a playlist in apple music using this data,
		const playlistId = await createAppleMusicPlaylist(musicKitInstance, data);
		// add tracks to the playlist
		const body = {
			data: songIdList,
		};
		console.log("body before adding: ", body);
		addTracksToPlaylist(musicKitInstance, playlistId, body);
	}
};

const getSongId = async (musicKitInstance, songName, artist) => {
	const url = new URL("https://api.music.apple.com/v1/catalog/us/search");
	url.searchParams.append("term", `${songName} ${artist}`);
	url.searchParams.append("types", "songs");
	url.searchParams.append("limit", "1");

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: getHeader(musicKitInstance),
		});

		const songData = await response.json();
		if (songData) {
			// if song exists in apple music, return the id
			return songData.results.songs.data[0].id;
		}
		return null;
	} catch (error) {
		console.log("error: " + error);
	}
};

const getSong = async (musicKitInstance, songId) => {
	const url = new URL(
		"https://api.music.apple.com/v1/catalog/us/songs/" + songId
	);
	try {
		const response = await fetch(url, {
			method: "GET",
			headers: getHeader(musicKitInstance),
		});

		const data = await response.json();
		console.log("song from apple music: ", data);

		return data;
	} catch (error) {
		console.log("error: " + error);
	}
};

const addTracksToPlaylist = async (musicKitInstance, playlistId, body) => {
	// extract songId list from the body
	const songIdList = body.data;
	console.log("SONG ID LIST: ", songIdList);
	for (const song of songIdList) {
		await delay(50); // Wait 0.05 seconds between each track addition
		const response = await fetch(
			`https://api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks`,
			{
				headers: getHeader(musicKitInstance),
				method: "POST",
				body: JSON.stringify({ data: [song] }),
				mode: "cors",
			}
		);
		console.log(`Added track ${song.id}, status: ${response.status}`);
	}
	return null;
};
export default AppleMusicAuth;
