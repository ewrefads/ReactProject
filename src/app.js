
import React, { useState } from "react";

import LogIn from "./logIn";
import "./game.css";

import GameConection from "./gameConnection";



class App extends React.Component{
    constructor(){
        super();
        let settings = {sound:1, defaultFont:"Arial", defaultColor:"black", inline:true};
        this.state = {loggedIn: false, gameToken:"", user:"", settings: settings};
        this.logIn = this.logIn.bind(this);
        this.LogOut = this.LogOut.bind(this);
        this.toggleSetting = this.toggleSetting.bind(this);
        this.playSound = this.playSound.bind(this);
        
    }
    

    logIn(gameToken, user){
        this.setState({loggedIn:true, gameToken:gameToken, user:user})
    }

    LogOut(){
        this.setState({loggedIn:false, gameToken:""});
        this.playSound("yoda.mp3")
        document.onkeydown = () => undefined;
    }

    playSound(file){
        if(this.state.settings.sound > 0){
            var audio = new Audio(file);
            audio.volume = this.state.settings.sound;
            audio.play();
        }
        
    }

    toggleSetting(setting, value){
        
        let temp = this.state.settings;
        if(setting === "sound"){
            
            temp.sound = value;   
        }
        if(setting === "defaultFont"){
            temp.defaultFont = value;
        }
        if(setting === "defaultColor"){
            temp.defaultColor = value;
        }
        if(setting === "inline"){
            temp.inline = value;
        }
        this.setState({settings:temp});
    }


    render(){

        

        if(this.state.loggedIn){
            document.body.className = "";
            return (<div style={{fontFamily:this.state.settings.defaultFont, color:this.state.settings.defaultColor, position:"relative" }}>

                <Settings settings = {this.state.settings} toggleSetting = {this.toggleSetting}/>
                <GameConection username = {this.state.user} authToken = {this.state.gameToken} playSound = {this.playSound} settings = {this.state.settings} LogOut = {this.LogOut}/>
                

                
            </div>)


        }
        else {
            document.body.className = "loginscreen";
            return (<div style={{fontFamily:this.state.settings.defaultFont, color:this.state.settings.defaultColor}}>
                <LogIn onSucces = {this.logIn} playSound = {this.playSound}/>
                <Settings settings = {this.state.settings} toggleSetting = {this.toggleSetting}/>
            </div>)
        }

    }

    
}




function Settings(props){
    const [show, setShow] = useState(false)
    const [audioVolume, setAudioVolume] = useState(1);
    const [font, setFont] = useState(props.settings.defaultFont);
    const [color, setColor] = useState(props.settings.color);
    const [inline, setInline] = useState("inline");
    let fonts = ['Arial',
    'Arial Black',
    'Bahnschrift',
    'Calibri',
    'Cambria',
    'Cambria Math',
    'Candara',
    'Comic Sans MS',
    'Consolas',
    'Constantia',
    'Corbel',
    'Courier New',
    'Ebrima',
    'Franklin Gothic Medium',
    'Gabriola',
    'Gadugi',
    'Georgia',
    'HoloLens MDL2 Assets',
    'Impact',
    'Ink Free',
    'Javanese Text',
    'Leelawadee UI',
    'Lucida Console',
    'Lucida Sans Unicode',
    'Malgun Gothic',
    'Marlett',
    'Microsoft Himalaya',
    'Microsoft JhengHei',
    'Microsoft New Tai Lue',
    'Microsoft PhagsPa',
    'Microsoft Sans Serif',
    'Microsoft Tai Le',
    'Microsoft YaHei',
    'Microsoft Yi Baiti',
    'MingLiU-ExtB',
    'Mongolian Baiti',
    'MS Gothic',
    'MV Boli',
    'Myanmar Text',
    'Nirmala UI',
    'Palatino Linotype',
    'Segoe MDL2 Assets',
    'Segoe Print',
    'Segoe Script',
    'Segoe UI',
    'Segoe UI Historic',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    'SimSun',
    'Sitka',
    'Sylfaen',
    'Symbol',
    'Tahoma',
    'Times New Roman',
    'Trebuchet MS',
    'Verdana',
    'Webdings',
    'Wingdings',
    'Yu Gothic']
    function toggleShow(){
        setShow(!show);
    }

    function soundText(){
        if(props.settings.sound > 0){
            return <img src="audio_on.jpg" height={15}></img>;
        }
        else{
            return <img src="audio_off.jpg" height={15}></img>;
        }
    }
    function toggleSound(){
        if(props.settings.sound > 0){
            props.toggleSetting("sound", 0)
        }
        else {
            props.toggleSetting("sound", audioVolume)
        }
    }

    function handleAudioRange(event){
        setAudioVolume(event.target.value);
        props.toggleSetting("sound", audioVolume);
    }
    function handleFont(event){
        setFont(event.target.value);
        props.toggleSetting("defaultFont", event.target.value);
    }
    function handleColor(event){
        setColor(event.target.value);
        props.toggleSetting("defaultColor", event.target.value);
    }
    function handleInline(event){
        if(event.target.value === "inline"){
            setInline("inline");
            props.toggleSetting("inline",true)
        }
        else {
            setInline("window");
            props.toggleSetting("inline",false)
        }
    }
    if(show){
        return(<div>
            <button onClick={()=> toggleShow()}><img src="settings.png" height={20}></img></button>
            <div className="settingsbox">
                <div>
                    <label>Sound:</label>
                    <button onClick={() => toggleSound()}>{soundText()}</button>
                    <input type="range" min={0} max={1} step={0.01} value={audioVolume} onChange={handleAudioRange}></input>
                </div>
                <div>
                    <label>Font:</label>
                    <select value={font} onChange={handleFont} defaultValue={font}>
                        {fonts.map((font) => <option style={{fontFamily:font}} value={font}>{font}</option>)}
                    </select>
                </div>
                <div>
                    <label>Text Color:</label>
                    <input type="color" onChange={handleColor} value={color}></input>
                </div>
                <div>
                    <label>Combat messages:</label>
                    <select onChange={handleInline} defaultValue={inline}>
                        <option value={"inline"}>In chat</option>
                        <option value={"window"}>In seperate window</option>
                    </select>
                </div>
                <div style={{padding: "2px"}}>
                    <p>Controls</p>
                    <p>w: Move up</p>
                    <p>a: Move left</p>
                    <p>s: Move down</p>
                    <p>d: Move right</p>
                    <p>q: Attack</p>
                </div>
                
            </div>
        </div>)
    }
    else {
        return(<div>
            <button onClick={()=> toggleShow()}><img src="settings.png" height={20}></img></button>
        </div>)
    }

    
}



export default App;