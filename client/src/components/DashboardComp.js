import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import '../css/DashboardComp.css'
import vcall from '../media/video.png'
import io from 'socket.io-client'
import Messages from './Messages/Messages'
import Input from './Input/Input'
import InfoBar from './InfoBar/InfoBar'
import TextContainer from './TextContainer/TextContainer'

let socket


export default function Dashboard(props, location) {
    const [userdata, setUserdata] = useState({
        _id: '',
        name: '',
        email: ''
    })
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [doctor, setDoctor] = useState([])
    const [sroom, setRoom] = useState([])
    const [users, setUsers] = useState([])
    const [username, setUsername] = useState('')
    const ENDPOINT = ':3000'

    useEffect(() => { 
        // GET USER INFO FROM DB

        axios.post('/api/user/getinfo', {
            token: sessionStorage.getItem('authtoken')
        })
        .then(res=> {
            setUserdata({ _id: res.data._id, name: res.data.name, email: res.data.email })
        })
        .catch(err => console.log(err)) 

        // GET DOCTOR INFO FROM DB

        axios.get(`/api/user/getdoctor/${props.match.params.did}`)
        .then(res => setDoctor(res.data))
        .catch(err => console.log(err))
        
    }, [])

    useEffect(() => {
        let name = props.match.params.name
        let room = props.match.params.did+props.match.params.pid
    
        socket = io(ENDPOINT);
    
        setRoom(room);
        setUsername(name)
    
        socket.emit('join', { name, room }, (error) => {
          if(error) {
            alert(error);
          }
        });
    
        setUsers([{name:'edi'}])
      }, [ENDPOINT, location.search])

    useEffect(() => {
        socket.on('message', (message) => {
          console.log(message)
          setMessages([...messages, message ]);
        });
    
        socket.on('roomData', ({ users }) => {
            console.log(users)
          setUsers(users);
        })
    
        return () => {
          socket.emit('disconnect');
    
          socket.off();
        }
      }, [messages])
    
    const sendMessage = (event) => {
        event.preventDefault();

        if(message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    return (
        <div>
            <div className="dasboard">
                <Link to='/home' className="back-home">Go Back Home</Link>
                <div className="top-bar">
                    <p>{doctor.map(data=>data.name)}</p>
                    <div className="videocall"><img src={vcall} alt=""/></div>
                </div>
                
                <div className="contact-list">
                    edi <br/>dani
                   
                </div>
                <div className="chat-wr">
                    <div className="chat-screen" id='messages'>
                        <InfoBar room={sroom} />
                        <TextContainer users={users}/>
                        <Messages messages={messages} name={username} />
                    </div>
                    <div className='chat-screen-form'>
                        {/* <input 
                            type="text" 
                            name='message' 
                            value={message} 
                            onChange={ e => setMessage(e.target.value) } 
                            placeholder='Type here...' 
                            className='message' 
                            onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                        />
                        <button onClick={ e => sendMessage(e) }>Send</button> */}
                        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
