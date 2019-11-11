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
import ContactList from './ContactList'

let socket


export default function Dashboard(props, location) {
    const [userdata, setUserdata] = useState({
        _id: '',
        name: '',
        email: '',
        contacts: [ ]
    })
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [doctor, setDoctor] = useState([])
    const [rooms, setRoom] = useState('')
    const [users, setUsers] = useState([])
    const [username, setUsername] = useState('')
    const ENDPOINT = ':3000'

    useEffect(() => { 
        // GET USER INFO FROM DB

        axios.post('/api/user/getinfo', {
            token: sessionStorage.getItem('authtoken')
        })
        .then(res=> {
            setUserdata({ _id: res.data._id, name: res.data.name, email: res.data.email, contacts: res.data.contactList })
        })
        .catch(err => console.log(err)) 

        // GET DOCTOR INFO FROM DB

        axios.get(`/api/user/getdoctor/${props.match.params.did}`)
        .then(res => setDoctor(res.data))
        .catch(err => console.log(err))

        axios.put(`/api/chat/add-contact/${props.match.params.did}/5db09e5e26d653340c473b11`)
        .then(res => {setUserdata({ _id: res.data[0]._id, name: res.data[0].name, email: res.data[0].email, contacts: res.data[0].contactList })
        })
        .catch(err => console.log(err))
        
    }, [])

    useEffect(() => {
        let name = props.match.params.name
        let room = props.match.params.did+props.match.params.pid
    
        socket = io(ENDPOINT);
    
        setRoom(room)
        setUsername(name)
    
        socket.emit('join', { name, room }, (error) => {
          if(error) {
            alert(error);
          }
        });
    
      }, [ENDPOINT, location.search])

    useEffect(() => {
        socket.on('message', (message) => {
          setMessages([...messages, message ])
        });
    
        socket.on('roomData', ({ users }) => {
          setUsers(users)
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
                    <ContactList contactList={userdata.contacts} />
                </div>
                <div className="chat-wr">
                    <div className="chat-screen" id='messages'>
                        <InfoBar room={rooms} />
                        <TextContainer users={users}/>
                        <Messages messages={messages} name={username} />
                    </div>
                    <div className='chat-screen-form'>
                        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
