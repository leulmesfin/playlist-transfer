import React, { useEffect } from 'react'
import useMusicKit from '../components/MusicKitHook';
import { usePlaylist } from '../components/PlaylistProvider';


export const ResultRoute = () => {
    const {musicKit, instance} = useMusicKit();
    const { selectedPlaylists } = usePlaylist();
    
    useEffect(() => {
        const getPlaylists = async () => {
            // // const result = await musicKit.api.library.playlists();
            // // console.log("res: ", result);
            // console.log("music kit: ", musicKit);
            // console.log("instance: ", instance);
            console.log("chosen playlists in result: ", selectedPlaylists);

        }
        getPlaylists();
    }, [])

    return (
        <div>
            <h1>Result</h1>
            <button onClick={() => uploadPlaylistsToAppleMusic(instance, selectedPlaylists)}>Add Playlist</button>
        </div>
    )
}

export const getHeader = (instance) => {
    const header = {
        Authorization: `Bearer ${instance.developerToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Music-User-Token': instance.musicUserToken
    }
    return header
}

// let data = {
//     "attributes": {
//         "name": "test",
//         "description": "..."
//     },
//     "relationships": {
//         "tracks": {
//             "data": []
//         }
//     }
// }

// this function makes a POST request to create a new playlist in an authorized user's Apple Music library
const createAppleMusicPlaylist = async (instance, data) => {
    const response = await fetch('https://api.music.apple.com/v1/me/library/playlists', {
        headers: getHeader(instance),
        method: "POST",
        body: JSON.stringify(data),
        mode: 'cors'
    })
    
    const responseJson = await response.json();
    console.log("response: ", responseJson);
    return responseJson.data[0].id; // returns the playlist id
}

// function that 1. creates a playlist for each playlist in selectedPlaylists, 2. then adds its tracks to that playlist
// get 1 working first (done), get 2
const uploadPlaylistsToAppleMusic = (musicKitInstance, playlists) => {
    // map thru every playlist in playlists, create a playlist
    // enter the name, and album image
    console.log("playlists: ", playlists);
    playlists.map(async (playlist) => {
        // go thru each track, push to list and use for data
        const songIdList = [];
        playlist.songs.map(async (song) => {
            // verify if track exists in apple music before using it
            const songId = await getSongId(musicKitInstance, song.name, song.artist)
            if (songId) {
                const trackData = {
                    "id": songId,
                    "type": "songs"
                }
                songIdList.push(trackData);
                // const theSong = await getSong(musicKitInstance, songId)
                // song id for testin: 187454421
                // console.log("track id: ", songId)
                // console.log("the song: ", theSong)
                // console.log("tracklist ids: ", songIdList)
            } else {
                console.log("OOPS! The track with name: " + song.name + " and artistName: " + song.artist + " does not exist in Apple Music :(");
            }

        })
        // create data
        let data = {
            "attributes": {
                "name": playlist.name,
                "description": "...",
                "artwork": {
                    "url": playlist.imageUrl,
                    "width:": 640,
                    "height": 640
                }
            },
            "relationships": {
                "tracks": {
                    "data": []
                }
            }
        }
        // create a playlist in apple music using this data,
        const playlistId = await createAppleMusicPlaylist(musicKitInstance, data);
        // add tracks to the playlist
        const body = {
            "data": songIdList
        }
        console.log("body before adding: ", body)
        addTracksToPlaylist(musicKitInstance, playlistId, body);
    })
}

const getSongId = async (musicKitInstance, songName, artist) => {
    const url = new URL('https://api.music.apple.com/v1/catalog/us/search');
    url.searchParams.append('term', `${songName} ${artist}`);
    url.searchParams.append('types', 'songs');
    url.searchParams.append('limit', '1');

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: getHeader(musicKitInstance)
        })

        const songData = await response.json();
        if (songData) { // if song exists in apple music, return the id
            return songData.results.songs.data[0].id;
        }
        // console.log("song id from apple music: ", data.results.songs.data[0].id);
        return null;
    } catch (error) {
        console.log("error: " + error);
    }
}

const getSong = async (musicKitInstance, songId) => {
    const url = new URL('https://api.music.apple.com/v1/catalog/us/songs/' + songId);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: getHeader(musicKitInstance)
        })

        const data = await response.json();
        console.log("song from apple music: ", data);

        return data;
    } catch (error) {
        console.log("error: " + error);
    }
}

const addTracksToPlaylist = async (musicKitInstance, playlistId, songIdList) =>  {
    const response = await fetch(`https://api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks`, {
        headers: getHeader(musicKitInstance),
        method: "POST",
        body: JSON.stringify(songIdList),
        mode: 'cors'
    })

    const responseVal = response.text()
    console.log("response after adding tracks: ", responseVal);
    return response.status;
}