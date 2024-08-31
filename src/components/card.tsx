import React from "react";
import { Playlist } from "../routes/playlistsRoute";
import {
	Button,
	ButtonGroup,
	Heading,
	VStack,
	useColorMode,
	Box,
	Card,
	CardHeader,
	CardBody,
	Image,
	CardFooter,
  Stack,
  Divider,
  Text
} from "@chakra-ui/react";

type MusicCard = {
	name: string;
	imageUrl: string;
	isSelected: boolean;
	toggleSelect: () => void;
};

const CardComponent = ({
	name,
	imageUrl,
	isSelected,
	toggleSelect,
}: MusicCard) => {
	return (
		// <Card maxW="sm" backgroundColor={isSelected ? "#50c2ff" : "#fafafa" }>
		// 	<CardBody>
		// 		<Image
		// 			src={imageUrl}
    //       w="80%"
    //       h="80%"
		// 			alt="Green double couch with wooden legs"
		// 			borderRadius="lg"
		// 		/>
		// 		<Stack mt="6" spacing="3">
		// 			<Heading size="md" color='customBlack.50'>{name}</Heading>
    //       <Button colorScheme='green' onClick={() => toggleSelect()}>{isSelected ? "X" : "Select"}</Button>
		// 		</Stack>
		// 	</CardBody>
		// </Card>
		// <Card
		// width="360px"
		// height="450px"
		// maxW="lg"
		// overflow="hidden"
		// display="flex"
		// flexDirection="column"
		// alignItems="center"
		//   >
		//   <CardHeader>
		//     <Heading size='lg'>{name}</Heading>
		//   </CardHeader>
		//   <CardBody>
		//     <Image src={imageUrl} alt='playlist img' w="250px" h="250px"/>
		//   </CardBody>
		//   <CardFooter>
		//     <Button variant='solid' colorScheme='blue'>
		//       Select
		//     </Button>
		//   </CardFooter>
		// </Card>
    <VStack className="card" style={{ backgroundColor: isSelected ? "#89CFF0" : "#899499" }}>
      <img className="card-image" src={imageUrl} alt='playlist img'></img>
		    {/* <h2 className='card-title'>{name}</h2> */}
      <Heading size='md' color='white'>{name}</Heading>
		  <Button colorScheme='red' onClick={() => toggleSelect()}>{isSelected ? "X" : "Select"}</Button>
    </VStack>
		// <div className="card" style={{ backgroundColor: isSelected ? "#50c2ff" : "#fafafa" }}>
		//     <img className="card-image" src={imageUrl} alt='playlist img'></img>
		//     {/* <h2 className='card-title'>{name}</h2> */}
    //     <Heading size='md' color='customBlack.50'>{name}</Heading>
		//     <Button colorScheme='green' onClick={() => toggleSelect()}>{isSelected ? "X" : "Select"}</Button>

		//     {/* <button onClick={() => toggleSelect()}>{isSelected ? "X" : "Select"}</button> */}
		// </div>
	);
};

export default CardComponent;
