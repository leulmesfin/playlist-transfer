import React, { createContext, useEffect, useState } from "react";

export const MusicKitContext = createContext(null);

export const MusicKitProvider = ({ children }) => {
    const [musicKit, setMusicKit] = useState(null);
    const [instance, setInstance] = useState(null);

    useEffect(() => {
        const initializeMusicKit = async () => {
            const devToken = await fetchDevToken();
            // console.log("music kit: ", window.MusicKit);
            // console.log("dev toke : ", devToken);
            if (window.MusicKit) {
                // console.log("inside window.musickit: ", window.MusicKit);
                // This configures MusicKit and assigns the returned instance to music.
                const music = window.MusicKit.configure({
                    developerToken: devToken,
                    app: {
                        name: 'Music Transfer',
                        build: '1.0'
                    }
                })
                // console.log("the music: ", music)
                setMusicKit(music);
                setInstance(music); 
                // console.log("music kit instance: ", window.MusicKit.getInstance());
                // setInstance(window.MusicKit.getInstance()); This gets the singleton instance (which is the same as music at this point) and saves it to your component's state.
                // music and getInstance are interchangeable at this point
            }
            
        }
        initializeMusicKit();
    }, []);

    useEffect(() => {
        // console.log("Updated musicKit:", musicKit);
    }, [musicKit]);

    return (
        <MusicKitContext.Provider value={{musicKit, instance}}>
            {children}
        </MusicKitContext.Provider>
    );
}

const fetchDevToken = async () => {
    const response = await fetch('http://localhost:8080/music/developer-token');
    return await response.text();
}
