import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import {
	Button,
	Heading,
	VStack,
	useColorMode,
	Box,
	Text,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

export default function Root() {
	const MotionButton = motion(Button);
	const { colorMode, toggleColorMode } = useColorMode();

	const spotifyLoginRedirect = async () => {
		console.log("Hello Leul");
		try {
			const response = await fetch("http://localhost:8080/api/login");
			const url = await response.text();
			console.log("url: ", url);
			window.location.replace(url); // redirect user to spotify login page
		} catch (error) {
			console.log("error is happening");
			console.log(error);
		}
	};

	return (
		<div className="homeLayout">
			<Box
				display="flex"
				alignItems="center"
				justifyContent="center"
				height="100vh"
				bg="customBlack.100"
			>
				<VStack spacing={10}>
					<VStack spacing={5}>
						<Heading
							size="3xl"
							bgGradient="linear(to-r, #1DB954, #FA2D48)"
							bgClip="text"
						>
							Music Transfer.
						</Heading>
						<Text fontSize="xl" fontWeight={"medium"}>
							Seamlessly transfer your playlists from Spotify to Apple Music.
						</Text>
					</VStack>

					<MotionButton
						whileTap={{ scale: 0.9 }}
						size="md"
						bg="customGreen.100"
						leftIcon={<FontAwesomeIcon size="lg" icon={faSpotify} />}
						onClick={() => spotifyLoginRedirect()}
					>
						Get Started
					</MotionButton>
				</VStack>
			</Box>
		</div>
	);
}
