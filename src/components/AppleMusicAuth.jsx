import React from 'react'
import useMusicKit from './MusicKitHook';
import { useNavigate } from "react-router-dom";
// hey
const AppleMusicAuth = () => {
  const {musicKit, instance} = useMusicKit();
  
  const navigate = useNavigate();

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
        <button onClick={handleAuthorize}>Authorize Apple Music</button>
    </div>
  )
}

export default AppleMusicAuth;