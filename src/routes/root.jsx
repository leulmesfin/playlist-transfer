import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import {
	Button,
	ButtonGroup,
	Heading,
	VStack,
	useColorMode,
  Box,
  Text
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

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
			{/* <h1>Music Transfer</h1> */}
			{/* <button onClick={() =>spotifyLoginRedirect()}>Get Started <FontAwesomeIcon size="lg" icon={faSpotify} /></button> */}
			{/* <Button colorScheme='green' size='md'>
        Button
      </Button> */}
      <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bg="brand.900">
        <VStack
          spacing={10}
          >
          <VStack spacing={5}>
            <Heading size='3xl'>Music Transfer.</Heading>
            <Text fontSize='xl'>Seamlessly transfer your playlists from Spotify to Apple Music.</Text>
          </VStack>
          
          <MotionButton
            whileTap={{ scale: 0.85 }}
            size="md"
            bg="customGreen.100"
            leftIcon={<FontAwesomeIcon size="lg" icon={faSpotify} />}
            onClick={() =>spotifyLoginRedirect()}
          >
            Get Started
          </MotionButton>

          {/* <MotionButton 
            onClick={toggleColorMode}
            whileTap={{ scale: 0.85 }}
            size="md">
            {colorMode === 'light' ? <SunIcon /> : <MoonIcon /> }
          </MotionButton> */}
        </VStack>
      </Box>
			
		</div>
	);
}
