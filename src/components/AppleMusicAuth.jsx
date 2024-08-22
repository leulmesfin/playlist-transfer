import React from 'react'
import useMusicKit from './MusicKitHook';
// hey
const AppleMusicAuth = () => {
  const musicKit = useMusicKit();

  const handleAuthorize = async () => {
    console.log("clicking apple btn: ", musicKit);
    if (musicKit) {
        try {
            await musicKit.authorize();
            console.log("Auth successful!");
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