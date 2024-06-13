import React, { useState } from "react";

import LogOut from "./logout";
import "./game.css";


// global variable to keep track of the current soundtrack
let currentSoundtrack = undefined;
let currentBiome = null;

function Game(props){

    
    props.gameServer.onEvent("WorldUpdate", response => handleResponse(response))
    
    const [info, setInfo] = useState([]); 
 
    const [ground, setGround] = useState([]); 
    const [clutter, setClutter] = useState([]);
    const [moveables, setMoveables] = useState([]);
    const [effects, setEffects] = useState([]);
    const [effectsCooldown, setEffectsCooldown] = useState(0);
    const [awaitMove, setAwaitMove] = useState(false);
    const [awaitAttack, setAwaitAttack] = useState(false);
    document.onkeydown = handleKeyPress
    

    function logOut(){
        props.onConnectionClosed();
        stopMusic() //Stopper soundtrack
    }
    function handleResponse(response) {

        if(response["ground"] !== undefined){
            setGround(response["ground"])
        }
        if(response["clutter"] !== undefined){
            setClutter(response["clutter"]);
            
        }
        if(response["movables"] !== undefined){
            setMoveables(response["movables"]);
        }
        if(response["effects"] !== undefined){
            setEffects(response["effects"]);
            if(effectsCooldown !== 0){
                clearTimeout(effectsCooldown);
            }
            setEffectsCooldown(Number(handleEffects()));

        }
        else if(effects.length > 0 && response["effects"] === undefined){
            setEffects([]);
        }
        if(response["info"] !== undefined){
            if(effectsCooldown !== 0){
                clearTimeout(effectsCooldown);
                setEffectsCooldown(0);
            }
            setInfo(response["info"]);
        }
        
    }

    function handleEffects(){
        let id = setTimeout(() => setEffects([]), 500);
        return id;
    }

    let tile_prefix = "./tiles/tile_";
    function handleClutterAndMoveables(tile, type){
        let className = "grid-item " + type;
        if(tile["flipped"]){
            className += " flip";
        }
        return <img alt="" id={tile["id"]} style = {{left: Number(tile["xpos"]) * 48, top: Number(tile["ypos"]) * 48}} className={className} src= {tile_prefix + tile["tile"] + ".png"}></img>
    }

    function handleKeyPress(event){
        if(!awaitMove){
            if(event.key === "w" || event.key === "W"){
                props.gameServer.invoke("MoveDirection", "up");
                setAwaitMove(true);
                setTimeout(() => setAwaitMove(false), 155);
            }
            if(event.key === "s" || event.key === "S"){
                props.gameServer.invoke("MoveDirection", "down");
                setAwaitMove(true);
                setTimeout(() => setAwaitMove(false), 155);
            }
            if(event.key === "a" || event.key === "A"){
                props.gameServer.invoke("MoveDirection", "left");
                setAwaitMove(true);
                setTimeout(() => setAwaitMove(false), 155);
            }
            if(event.key === "d" || event.key === "D"){
                props.gameServer.invoke("MoveDirection", "right");
                setAwaitMove(true);
                setTimeout(() => setAwaitMove(false), 155);
            }
        }
        if(!awaitAttack){
            if(event.key === "q" || event.key === "q"){
                props.playSound("ooph.mp3");
                props.gameServer.invoke("Attack");
                setAwaitAttack(true);
                setTimeout(() => setAwaitAttack(false), 255);
            }
        }
        
        
            
        }
        
        function PlayerInfoDisplay(infoObj) {
            let info = infoObj.info

            let biomeColor = "black";

            

            switch(info["biome"])
            {
                case "Plains": biomeColor = "#556B2F"; break;
                case "Scrub": biomeColor = "#D2B48C"; break;
                case "Savanna": biomeColor = "#8B4513"; break;
                case "SavannaEdge": biomeColor = "#8B7355"; break;
                case "Forest": biomeColor = "#228B22";  break;
                case "Desert": biomeColor = "#FFD700"; break;
                case "Tundra": biomeColor = "#708090"; break;
                case "Jungle": biomeColor = "#006400"; break;
                default: biomeColor = "black"; 
            }
            
            
                transitionSoundtracks(info["biome"], props.settings)
            


            return (
                <div className="info"> 
                  <p className="biometext" style={{ color: biomeColor }}>Biome: {info["biome"]}</p>
                  <p className="positiontext">x position: {info["xpos"]}</p>
                  <p className="positiontext">y position: {info["ypos"]}</p>
                </div>
             );
            };
    return (<div>
        <div className="grid-container top-container" id="game-window">
            {ground.map((tile) => <img alt="" className="grid-item ground" src={tile_prefix + tile + ".png"}></img>)}
            {clutter.map((clutter) => {return handleClutterAndMoveables(clutter, "clutter")})}
            {moveables.map((moveable) => {return handleClutterAndMoveables(moveable, "movable")})}
            {effects.map((effect) => {return handleClutterAndMoveables(effect, "effect")})}
        </div>

        <PlayerInfoDisplay info = {info}/>
        <LogOut logOut = {logOut}/>
    </div>);
}


//----------------------------------- AUDIO FUNCTIONS -------------------------------//

function stopMusic() {
    if (currentSoundtrack) {
        // Pause og reset soundtrack
        currentSoundtrack.pause();
        currentSoundtrack.currentTime = 0;

        // Remove event listeners
        currentSoundtrack.removeEventListener('canplay', fadeIn);

        // Clear the source and unload the audio
        currentSoundtrack.src = '';
        currentSoundtrack.load();
        currentSoundtrack = null;
    }
}

// Funktion til at 'fade out' lyd/soundtrack
function fadeOut(audio) {

    const fadeOutInterval = 50; // Interval in milliseconds for fading out
    const fadeOutStep = 0.05; // Step size for decreasing volume

    let volume = audio.volume;

    const fadeOutTimer = setInterval(function() {
        volume -= fadeOutStep;
        audio.volume = Math.max(0, volume);

        if (volume <= 0) {
            // Pause and reset the audio once faded out
            audio.removeEventListener('canplay', fadeIn);
            clearInterval(fadeOutTimer);
            audio.pause();
            audio.src = ''; // Clear the source
            audio.load(); // Reload the audio element
            audio = null; // Dereference the audio element
        }
    }, fadeOutInterval);
}

// Function to fade in the new audio
function fadeIn(audio, maxVolume) {
    const fadeInInterval = 50; // Interval in milliseconds for fading in
    const fadeInStep = 0.05; // Step size for increasing volume

    audio.volume = 0; // Start with zero volume

    const fadeInTimer = setInterval(function() {
        audio.volume = Math.min(maxVolume.volume, audio.volume + fadeInStep); // Ensure volume doesn't exceed 1

        if (audio.volume >= maxVolume.volume) {
            // Audio has fully faded in
            clearInterval(fadeInTimer);
        }
    }, fadeInInterval);
}

// Function to transition between soundtracks with fading
function transitionSoundtracks(biome, maxVolume) {
    // Define the soundtrack filenames for each biome
    const soundtrackFilenames = {
        "Plains": "01 plains.mp3",
        "Scrub": "02 scrub.mp3",
        "Savanna": "03 savanna.mp3",
        "SavannaEdge": "04 savannaEdge.mp3",
        "Forest": "05 forest.mp3",
        "Desert": "06 desert.mp3",
        "Tundra": "07 tundra.mp3",
        "Jungle": "08 jungle.mp3"
    };

    // Check if the biome has changed
    if (biome !== currentBiome &&  maxVolume.volume >= 0.1) {
        // Update current biome
        currentBiome = biome;

        // Create a new audio element for the new soundtrack
        const newSoundtrack = new Audio(soundtrackFilenames[biome]);
        newSoundtrack.loop = true; // Ensure new soundtrack loops continuously

        // Fade out
        if (currentSoundtrack) {
            fadeOut(currentSoundtrack);
        }

        // Afspil nyt soundtrack (efter audioelement er loaded) + fade in
        newSoundtrack.addEventListener('canplay', function() {
            newSoundtrack.play();
            fadeIn(newSoundtrack, maxVolume);

            // Set the new soundtrack as the current soundtrack
            currentSoundtrack = newSoundtrack;
        });
    }
}



export default Game;