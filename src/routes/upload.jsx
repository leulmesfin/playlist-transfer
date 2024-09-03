import React, { useEffect, useState, useRef } from "react";
import useMusicKit from "../components/MusicKitHook";
import { usePlaylist } from "../components/PlaylistProvider";
import { Button, Spinner, Box, Text, VStack } from "@chakra-ui/react";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const UploadRoute = () => {
	const { musicKit, instance } = useMusicKit();
	const { selectedPlaylists, failedPlaylists, setFailedPlaylists } = usePlaylist();
	let ref = useRef(false);
	const [totalCount, setTotalCount] = useState(0);
	const [counter, setCounter] = useState(0);
	const navigate = useNavigate();
	// const [failedPlaylists, setFailedPlaylists] = useState([]);

	// process playlists and tracks
	useEffect(() => {
		// load the tracks to each playlist, then add each selected playlist to Apple Music
		const uploadPlaylists = async () => {
			// loading tracks...
            let songsCount = 0;
			for (const playlist of selectedPlaylists) {
				playlist.songs = await fetchPlaylistTracks(playlist.id);
				songsCount += playlist.songs.length; // total playlists+tracks
				console.log("playlists after adding songs: ", selectedPlaylists);
			}
            const count = selectedPlaylists.length + songsCount;
			setTotalCount(count);

			if (ref.current === false) {
				uploadPlaylistsToAppleMusic(instance, selectedPlaylists, setCounter, setFailedPlaylists);
				ref.current = true;
			}
		};
		uploadPlaylists();
	}, []);

	useEffect(() => {
		if (totalCount !== 0 && counter === totalCount) {
			console.log("totalCount: ", totalCount);
			console.log("Counter: ", counter);
			navigate("/result");
		}
	}, [counter, totalCount, navigate]);

	useEffect(() => {
		const getFailedPlaylists = async () => {
			console.log("failedplaylists: ", failedPlaylists);
		};
		getFailedPlaylists();
	}, [failedPlaylists]);

	useEffect(() => {
		const getPlaylists = async () => {
			// console.log("chosen playlists in result: ", selectedPlaylists);
		};
		getPlaylists();
	}, [selectedPlaylists]);

	return (
		<Box
			display="flex"
			alignItems="center"
			justifyContent="center"
			height="100vh"
			bg="customBlack.100"
		>
			<VStack>
				<ScaleLoader color={"#ffffff"} />
			</VStack>
		</Box>
	);
};

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
const createAppleMusicPlaylist = async (instance, data, setCounterFunc) => {
	const response = await fetch(
		"https://api.music.apple.com/v1/me/library/playlists",
		{
			headers: getHeader(instance),
			method: "POST",
			body: JSON.stringify(data),
			mode: "cors",
		}
	);

    setCounterFunc(prev => prev + 1); // increment counter for every playlist
	const responseJson = await response.json();
	console.log("response: ", responseJson);
	return responseJson.data[0].id; // returns the playlist id
};

const addTracksToPlaylist = async (musicKitInstance, playlistId, body, setCounterFunc) => {
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
        //setCounterFunc(prev => prev + 1); // increment counter for every track added
	}
	return null;
};

// function that 1. creates a playlist for each playlist in selectedPlaylists, 2. then adds its tracks to that playlist
// get 1 working first (done), get 2
const uploadPlaylistsToAppleMusic = async (
	musicKitInstance,
	playlists,
    setCounterFunc,
	setFailedPlaylistFunc
) => {
	// map thru every playlist in playlists, create a playlist
	// map thru songs (synchronously) and add to playlist
	// console.log("playlists: ", playlists);
	for (const playlist of playlists) {
		const songIdList = [];
		for (const song of playlist.songs) {
			// console.log("song: ", song);
			await delay(50); // Wait .05 second between each songId fetch
			const songId = await getSongId(musicKitInstance, song.name, song.artist); // getting slng id from spotify
			if (songId) {
				const trackData = {
					id: songId,
					type: "songs",
				};
				songIdList.push(trackData);
			} else {
				// setFailedPlaylistFunc(prevPlaylists => ([...prevPlaylists, {[playlist.name]: [...prevPlaylists,`${song.name} by ${song.artist}`]}]));
				// review this
				setFailedPlaylistFunc(prevFailedPlaylists => {
                    const updatedFailedPlaylists = { ...prevFailedPlaylists };
                    if (!updatedFailedPlaylists[playlist.name]) {
                        updatedFailedPlaylists[playlist.name] = [];
                    }
                    updatedFailedPlaylists[playlist.name].push(`${song.name} by ${song.artist}`);
                    return updatedFailedPlaylists;
                });
				console.log(
					"OOPS! The track with name: " +
						song.name +
						" and artistName: " +
						song.artist +
						" does not exist in Apple Music :("
				);
			}
			setCounterFunc(prev => prev + 1); // increment counter for every song in playlist
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
		const playlistId = await createAppleMusicPlaylist(musicKitInstance, data, setCounterFunc);

		// add tracks to the playlist
		const body = {
			data: songIdList,
		};
		console.log("body before adding: ", body);
		addTracksToPlaylist(musicKitInstance, playlistId, body, setCounterFunc);
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
        console.log("song data in getSongId: ", songData);

        // Check if songData.results exists and has a songs property
        if (songData.results && songData.results.songs && songData.results.songs.data && songData.results.songs.data.length > 0) {
            return songData.results.songs.data[0].id;
        } else {
            console.log(`No song found for: ${songName} by ${artist}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching song ID for: ${songName} by ${artist}`, error);
        return null;
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
