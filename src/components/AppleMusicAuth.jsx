import React from 'react'
import useMusicKit from './MusicKitHook';
import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify, faApple } from "@fortawesome/free-brands-svg-icons";
// hey
const AppleMusicAuth = () => {
  const {musicKit, instance} = useMusicKit();
  const navigate = useNavigate();
  const MotionButton = motion(Button);

  const handleAuthorize = async () => {
    console.log("clicking apple btn: ", musicKit);
    if (musicKit) {
        try {
            await musicKit.authorize();
            console.log("Auth successful!");
            navigate("/result");
        } catch (error) {
            console.error("Auth failed! ", error);
        }
    }
  }
  return (
    <div>
        {/* <Button onClick={handleAuthorize} colorScheme='red'>Upload to Apple Music</Button> */}
        <MotionButton
            whileTap={{ scale: 0.85 }}
            size="md"
            bg="customRed.50"
            leftIcon={<FontAwesomeIcon size="lg" icon={faApple} />}
            // onClick={() => handleAuthorize()}
          >
            Upload to Apple Music
          </MotionButton>
        {/* <button onClick={handleAuthorize}>Authorize Apple Music</button> */}
    </div>
  )
}

export default AppleMusicAuth;