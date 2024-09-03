import React from "react";
import { Button, Spinner, Box, Text, VStack, Heading, Divider } from "@chakra-ui/react";
import { usePlaylist } from "../components/PlaylistProvider";

export const ResultRoute = () => {
	const { failedPlaylists } = usePlaylist();
	return (
		<VStack>
			<Heading size="lg">
				Your playlists have been successfully uploaded
			</Heading>
			<Text fontSize="xl" fontWeight={"medium"}>
				The following songs could not be uploaded...
			</Text>
            {
                Object.entries(failedPlaylists).map(([k,v]) => {
                    return (
                        // console.log("failedPlaylist map: ", failedPlaylists);
                        // console.log("k: ", k);
                        // console.log("v: ", v);
                        <VStack key={k}>
                            <Divider />
                            <Text>Playlist: {k}</Text>
                            <VStack>
                               {v.map((track, index) => {
                                   return (<Text key={index}>Track: {track}</Text>);
                               })}
                            </VStack>
                            <Divider />
                        </VStack>
                    );
                })
            }
		</VStack>
	);
};
