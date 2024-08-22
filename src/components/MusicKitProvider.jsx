import React, { createContext, useEffect, useState } from "react";

export const MusicKitContext = createContext(null);

export const MusicKitProvider = ({ children }) => {
    const [musicKit, setMusicKit] = useState(null);

    useEffect(() => {
        const initializeMusicKit = async () => {
            const devToken = await fetchDevToken();
            console.log("music kit: ", window.MusicKit);
            console.log("dev toke : ", devToken);
            if (window.MusicKit) {
                console.log("inside window.musickit: ", window.MusicKit);
                const music = window.MusicKit.configure({
                    developerToken: devToken,
                    app: {
                        name: 'Music Transfer',
                        build: '1.0'
                    }
                })
                console.log("the music: ", music)
                setMusicKit(music);
            }
            
        }
        initializeMusicKit();
    }, []);

    useEffect(() => {
        console.log("Updated musicKit:", musicKit);
    }, [musicKit]);

    return (
        <MusicKitContext.Provider value={musicKit}>
            {children}
        </MusicKitContext.Provider>
    );
}

const fetchDevToken = async () => {
    const response = await fetch('http://localhost:8080/music/developer-token');
    return await response.text();
}
