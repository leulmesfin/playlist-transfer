import React from "react";
import useMusicKit from "./MusicKitHook";
import { useNavigate } from "react-router-dom";
import { Button, HStack, Flex, Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple } from "@fortawesome/free-brands-svg-icons";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const AppleMusicAuth = () => {
	const { musicKit } = useMusicKit();
	const navigate = useNavigate();
	const MotionButton = motion(Button);

	const handleAuthorize = async () => {
		// console.log("clicking apple btn: ", musicKit);
		if (musicKit) {
			try {
				await musicKit.authorize();
				// console.log("Auth successful!");
				navigate("/upload");
			} catch (error) {
				console.error("Auth failed! ", error);
			}
		}
	};

	return (
		<Flex>
			<MotionButton
				whileTap={{ scale: 0.85 }}
				size="md"
				bg="customRed.50"
				alignItems={"center"}
				rightIcon={
					<Box marginTop="-4.5px">
						<FontAwesomeIcon size="lg" icon={faApple} />
					</Box>
				}
				onClick={() => handleAuthorize()}
			>
				Upload
			</MotionButton>
		</Flex>
	);
};

export default AppleMusicAuth;
