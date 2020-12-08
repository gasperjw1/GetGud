import React, { useState, useEffect, useMemo } from "react";
import { View, Text } from "react-native";
import io from "socket.io-client";
import { btoa } from 'js-base64';
import { Audio } from 'expo-av';
import { Button } from "@material-ui/core";
// import { fetchUri } from './utils';

export default function PlayAudio() {

    // For web version, url is fetched by fetchUri()
    // const [socket] = useState(() => io('http://localhost:8080/'), {
    const socket = useMemo(() => io('/', {
        reconnection: true,
        reconnectionAttempts: Infinity,
        timeout: 60000,
        transports: ['websocket']
    }), []);

    useEffect(() => {
        let chunks = [];

        socket.on("receiveAudio", (data) => {
            let dataArray = new Uint8Array(data);
            dataArray.forEach((item) => chunks.push(item));
        });

        socket.on("end", () => {
            let audioArray = Uint8Array.from(chunks);
            playAudio(audioArray);
            chunks = [];
        });
    }, [socket]);

    const handleClick = () => {
        socket.emit("sendAudio");
    };

    const playAudio = async (arr) => {
        let binstr = Array.prototype.map
            .call(arr, (ch) => {
              return String.fromCharCode(ch);
            })
            .join("");
        let base64arr = btoa(binstr);
        let uri = "data:audio/mp3;base64," + base64arr;
        await Audio.Sound.createAsync({ uri: uri }, { shouldPlay: true });
    };

    const hookedStyles = {
        view: {
            alignItems: 'center',
            justifyContent: 'center'
        },
        button: {
            alignItems: 'center',
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
            height: "300px",
            width: "100%",
            fontSize: "50px",
            backgroundColor: "#E9967A"
        }
        
    }

    return (
        <View style={hookedStyles.view}>
            <Button
                fullWidth
                type="Play Quack"
                variant="contained"
                color="secondary"
                onClick={handleClick}
                title="Play Quack"
                style={hookedStyles.button}
            >
                GET GUD
            </Button>
        </View>
    );
}
