import React, { useState, useEffect, useRef } from "react";
import "./chat.css"



function ChatWindow(props){
    
    
    

    let inputText = useFormInput("");
    //let messages = useFormInput([]);
    const [messages, setMessages] = useState([]);
    
    //tvinger chatten til at opdate når ny besked kommer
    const [forceUpdate, setForceUpdate] = useState(false);
    
    /*handleSendMessage(
        {
            text: "first message!",
            sender: "Navn"
        }
    );*/

    function handleNewMessage(message){
       setMessages(prevState => [...prevState, message]);
       setForceUpdate(prevState => !prevState); 
    }

    props.gameServer.onEvent("ChatMessage", response => {
        let message = ConvertStringToMessageObject(response);
        handleNewMessage(message);
        
    });
    
    const [combatLog, setCombatLog] = useState([])

    function cLogs(message){
        let temp = combatLog;
        temp.push(message);
        setCombatLog(temp);
        setForceUpdate(!forceUpdate);
    }
    
    props.gameServer.onEvent("CombatMessage", response => {
        
        
        cLogs(response)
        console.log(combatLog)

        if(props.settings.inline){
            console.log("combatmessage!!!!!!!!");
            let message = {
                sender: "",
                 text: response
            }
            console.log(message);
            handleNewMessage(message);
        }
        
        
    });

    function ConvertStringToMessageObject(string){
        let output = [];
        let word = "";

        
        for (let i = 0; i < string.length; i++) {
            if(string[i] === ']' || i === string.length-1){
                if(i === string.length-1){
                    word += string[i];
                }
                output.push(word);
                word = "";
            } else if(string[i] === '[' || string[i] === ']' || output.length ===2 && string[i] === '' ||output.length ===2 && string[i] === ':' ){
                
            }
            else{
                word += string[i];
            }
        }

        return({
            date: output[0],
            sender: output[1],
            text: output[2]
        });
    }


    function SendMessageToServer(message){
         props.gameServer.invoke("Chat", message.text);

    }

    const [showCombatLog, setShowCombatLog] = useState(true);
    console.log(props.settings);
    console.log(props.settings.inline);
    function toggleMessageWindow(event){
        setShowCombatLog(!showCombatLog)
    }
    if(props.settings.inline){
        return (

            <div className="top-container">
                
              <h1>Chat</h1>
              
              <MessageWindow messages = {messages}/>
    
    
              <TextField inputText = {inputText} sendMessage = {handleNewMessage} username = {props.username} sendMessageToServer = {SendMessageToServer}/>
            </div>
          );
    }
    else if(showCombatLog){
        return (

            <div className="top-container">
                <div className="topbox" onClick={toggleMessageWindow}>
                    <h1>Chat</h1>
                </div>
                <div className="topbox activetopbox">
                    <h1>Combat Log</h1>
                </div>
                
            
              <LogWindow combatLog = {combatLog} />
              
            </div>
          );
    }
    else {
        return (

            <div className="top-container">
                <div className="topbox activetopbox">
                    <h1>Chat</h1>
                </div>
                <div className="topbox"onClick={toggleMessageWindow}>
                    <h1>Combat Log</h1>
                </div>
                
            
                <MessageWindow messages = {messages}/>
    
    
                 <TextField inputText = {inputText} sendMessage = {handleNewMessage} username = {props.username} sendMessageToServer = {SendMessageToServer}/>   
              
            </div>
          );
    }
        
}
    
    

function LogWindow(props){
    console.log(props.combatLog)
    return <div className="message-window">
        {props.combatLog.map((logged) => <p>{logged}</p>)}
    </div>
}

function useFormInput(initialValue){
    const[value, setValue] = useState(initialValue);
  
    function handleChange(event){
      setValue(event.target.value);
    }
  
    return {value: value, onChange: handleChange, setValue: setValue}
  }


function TextField(props){
    function sendMessage(){
        let message = {
            text: props.inputText.value,
            sender: props.username
        }

        //props.sendMessage(message);
        props.sendMessageToServer(message)
        props.inputText.setValue("");
    }

    return(<>
        <input class="input-style" {...props.inputText}></input>
        <button onClick={sendMessage}>Enter</button>
        </>
    );
}

function CheckIfCommand(){

}

function MessageWindow(props){
    const messageWindowRef = useRef(null);

    useEffect(() => {
        // Scroll to the bottom of the message window
        if (messageWindowRef.current) {
            messageWindowRef.current.scrollTop = messageWindowRef.current.scrollHeight;
        }
    }, [props.messages]);

    return(
        <div className="message-container">
            <div className="message-window" ref={messageWindowRef}>
                {props.messages.map((message, index) => (
                    <>
                <Message key={index} text={message.text} sender={message.sender} date = {message.date} />
                <br/>
                </>
                ))}
            </div>
         </div>
    );
}

//kode til messageboxen chatgpt har hjulpet med
const Message = ({ text, sender, date }) => {
    let messageFromToday = MessageIsSameDay(date);

    if(!messageFromToday){
    return (
      <div className={`message ${sender === 'user' ? 'user-message' : 'other-message'}`}>
        
        <p className="date">{date}</p>
        <div className="content">
            
            <div className="text"><strong className="sender">{sender}: </strong>{text}</div>
        </div>
        
      </div>
    );
    }
    else{
        let clock =  date.slice(-5);

        return (
            <div className={`message ${sender === 'user' ? 'user-message' : 'other-message'}`}>
              
              <p className="date">{clock}</p>
              <div className="content">
                  
                  <div className="text"><strong className="sender">{sender}: </strong>{text}</div>
              </div>
              
            </div>
          );
    }
  };


function MessageIsSameDay(timestamp){
    const today = new Date();
    const date = new Date(timestamp);

    if(date.getDate() === today.getDate()){
        return true;
    }
    
    return false;
}


    

export default ChatWindow;