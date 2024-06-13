import React, { useState } from "react";
import Game from "./game";

import ChatWindow from "./chat";
import "./game.css";
import useGameServer from "./useGameServer";



function GameConection(props){
    const gameServer = useGameServer("http://examplegameserver.com", props.authToken, (error) => onConnectionClosed(error));
    gameServer.connect();

    return (<div>

        <div className="chat-window"><ChatWindow username = {props.username} gameServer = {gameServer} settings = {props.settings}/></div>
        <div className="game"><Game gameServer = {gameServer} playSound = {props.playSound} settings = {props.settings} onConnectionClosed = {onConnectionClosed}/></div>
        
        
    </div>);

    function onConnectionClosed(error){
        console.log("lost connection");
        console.log(error);
        gameServer.disconnect();
        props.LogOut();
    }
}


export default GameConection;