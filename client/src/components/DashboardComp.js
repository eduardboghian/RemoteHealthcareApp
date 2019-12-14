import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import '../css/DashboardComp.css'
import vcall from '../media/video.png'
import io from 'socket.io-client'
import Messages from './Messages/Messages'
import Input from './Input/Input'
import InfoBar from './InfoBar/InfoBar'
import ContactList from './ContactList'
import StripeCheckout from 'react-stripe-checkout'

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
    const ENDPOINT = ':'

    useEffect(() => { 
        // GET USER INFO FROM DB

        axios.post('/api/user/getinfo', {
            token: sessionStorage.getItem('authtoken')
        })
        .then(res=> {
            console.log('res:', res)
            setUserdata({ _id: res.data._id, name: res.data.name, email: res.data.email, contacts: res.data.contactList })
        })
        .catch(err => console.log(err)) 

        // GET DOCTOR INFO FROM DB
        // axios.get(`/api/user/getdoctor/${props.match.params.did}`)
        // .then(res => setDoctor(res.data))
        // .catch(err => console.log(err))

        axios.put(`/api/chat/add-contact/${props.match.params.did}/${props.match.params.pid}`)
        .then(res => console.log('add:',res))
        .catch(err => console.log(err))

        // CREATE ROOM/ LOAD MESSAGES

        axios.post(`/api/chat/create-room/${props.match.params.did}/${props.match.params.pid}`)
        .then(res=> console.log(res))
        .catch(err => console.log(err))

        axios.get(`/api/chat/load-messages/${props.match.params.did}/${props.match.params.pid}`)
        .then( (res) => { 
            res.data[0].messages.map((msg)=>{
                setMessages( (messages)=> ([...messages, msg]) )

                return 0
            })  
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
        })

        // let msgs = document.getElementById('messages')
        // msgs.innerHTML = ''

        // messages.map((data)=> {
        //     let messages = document.getElementById('messages')

        //     let message = document.createElement('div')
        //     message.setAttribute('class', 'chat-message')
        //     message.textContent = data.name+': '+data.message
            
        //     messages.appendChild(message)
            
        //     return 0
        // })
    
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

    const handleClick = (e) => {
        e.preventDefault()

        props.history.push(`/videoroom/${props.match.params.did}/${props.match.params.pid}/${userdata.name}`)
    }

    function handleToken(token, adresses) {
        console.log(token)

        axios.post('/checkout', {
            token: token
        })
        .then(res => console.log(res))
        .catch(err=> console.log(err))
    }

    return (
        <div> 
            <div className="dasboard">
                <Link to='/' className="back-home">Go Back Home</Link>
                <div className="top-bar">
                    <p>User: {userdata.name} {doctor.map(data=>data.name)}</p>
                    <div  className="videocall" onClick={ e => handleClick(e) }><img src={vcall} alt=""/></div>
                </div>
                
                <div className="contact-list">
                    <ContactList props={props} contactList={userdata.contacts} />
                </div>
                <div className="chat-wr">
                    <div className="chat-screen" id='messages'>
                        <InfoBar room={rooms} />    
                        <Messages messages={messages} name={username} />
                    </div>
                    <div className='chat-screen-form'>
                        <StripeCheckout
                            stripeKey='pk_test_eulYepC4bTmL324nqSUAuWNN00Z4dFFkNj'
                            token={handleToken} 
                            price={19.99*100}
                        />
                        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
