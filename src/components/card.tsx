import React from "react";
import { Button, Stack, Divider, Text, VStack, Heading} from "@chakra-ui/react";

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
		<VStack
			className="card"
			style={{ backgroundColor: isSelected ? "#89CFF0" : "#899499" }}
		>
			<img className="card-image" src={imageUrl} alt="playlist img"></img>
			<Heading size="md" color="white">
				{name}
			</Heading>
			<Button colorScheme="red" onClick={() => toggleSelect()}>
				{isSelected ? "X" : "Select"}
			</Button>
		</VStack>
	);
};

export default CardComponent;
