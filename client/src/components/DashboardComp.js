import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import '../css/DashboardComp.css'
import vcall from '../media/video.png'
import io from 'socket.io-client'

let socket


export default function Dashboard(location) {
    const [userdata, setUserdata] = useState({
        _id: '',
        name: '',
        email: ''
    })
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const ENDPOINT = ':3000'

    useEffect(() => {
        axios.post('/api/user/getinfo', {
            token: sessionStorage.getItem('authtoken')
        })
        .then(res=> {
            setUserdata({ _id: res.data._id, name: res.data.name, email: res.data.email })
        })
        .catch(err => console.log(err)) 

        axios.get('/api/chat/messages')
        .then( async (res) => { 
            res.data.map((msg)=>{
                setMessages( (messages)=> ([...messages, msg]) )
            })  
        })
        .catch(err => console.log(err))   
        
    }, [])

    useEffect(() => {
        socket = io.connect(ENDPOINT) 

    }, [ENDPOINT, location.search]);

    useEffect(() => {
        let msgs = document.getElementById('messages')
        msgs.innerHTML = ''

        socket.on('message', (msg) => {
            setMessages((messages)=> ([...messages, msg])) 
        })

        messages.map((data)=> {
            let messages = document.getElementById('messages')

            let message = document.createElement('div')
            message.setAttribute('class', 'chat-message')
            message.textContent = data.name+': '+data.message
            
            messages.appendChild(message)
        })

        return () => {
            socket.emit('disconnect');
      
            socket.off();
          }

    }, [messages])

    const sendMessage = (event) => {
        event.preventDefault()

        if(message) {
            socket.emit('sendMessage', message, userdata.name,() => setMessage(''))
        }
    }

    return (
        <div>
            <div className="dasboard">
                <Link to='/home' className="back-home">Go Back Home</Link>
                <div className="top-bar">
                    <p>{userdata.name}</p>
                    <div className="videocall"><img src={vcall} alt=""/></div>
                </div>
                
                <div className="contact-list">
                    edi <br/>dani
                </div>
                <div className="chat-wr">
                    <div className="chat-screen" id='messages'>
                        
                    </div>
                    <input 
                        type="text" 
                        name='message' 
                        value={message} 
                        onChange={ e => setMessage(e.target.value) } 
                        placeholder='Type here...' 
                        className='message' 
                        onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                    />
                    <button onClick={ e => sendMessage(e) }>Send</button>
                </div>
            </div>
        </div>
    )
}
