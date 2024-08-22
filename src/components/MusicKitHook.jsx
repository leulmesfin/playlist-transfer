import { useContext } from 'react';
import { MusicKitContext } from './MusicKitProvider';

// type MusicKitInstance = {
//     authorize: () => Promise<void>;
// }
const useMusicKit = () => {
    return useContext(MusicKitContext);
}
export default useMusicKit;