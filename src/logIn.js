import React from "react";
import "./game.css"

class LogIn extends React.Component {
    constructor(props){
        super(props);
        this.onSuccess = props.onSuccess;
        this.state = {errorMsg: "", username:"", password:""};
        this.handleUsername = this.handleUsername.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.onClick = this.onClick.bind(this);
        this.login = this.login.bind(this);
        this.handleEnter = this.handleEnter.bind(this);
        document.onkeydown = this.handleEnter
    }

    handleEnter(event){
        if(event.key === "Enter" && this.state.username !== "" && this.state.password !== ""){
            this.onClick();
        }
        else if(event.key === "Enter"){
            console.log("pressed enter");
            console.log(this.state.username);
            console.log(this.state.password);
        }
    }

    async onClick(){
        console.log("activated onclick");
        this.login(this.state.username, this.state.password);
        
    }

    async login(username, password){
        const data = new URLSearchParams();
        data.append("username", username);
        data.append("password", password);
        fetch("http://react.tsanas.com/authentication/login", {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body:JSON.stringify({username:username, password:password})
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if(data.success){
                    this.props.playSound("XP-Startup.mp3");
                    this.props.onSucces(data.data, username);
                }
                else {
                    this.setState({errorMsg:data.error});
                    this.props.playSound("sad-horn.mp3");
                }
            })
            .catch(error => {
                console.error(error);
                this.setState({errorMsg:error});
                this.props.playSound("sad-horn.mp3");
            })
    }

    
    handleUsername(event) {
        this.setState({username:event.target.value})
    }
    handlePassword(event) {
        this.setState({password:event.target.value})
    }
    render(){
        let username = {value:this.state.username, onChange:this.handleUsername}
        let password = {value:this.state.password, onChange:this.handlePassword}
        return (<div className="login">
            
            
            <div><strong className="gameTitle">React Game</strong></div>
            <div className="login-element">
                
                <div style={{color:"red"}}>{this.state.errorMsg}</div>
                <input {...username} placeholder="username" ></input>
                <br></br>
                <input {...password} type="password" placeholder="password"></input>
                <br></br>
                <button onClick={this.onClick} id="login">Login</button>
            </div>
            
        </div>)
    }
}

export default LogIn;