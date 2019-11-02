import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import '../css/DashboardComp.css'
import vcall from '../media/video.png'

export default function Dashboard(props) {
    const [userdata, setUserdata] = useState({
        _id: '',
        name: '',
        email: ''
    })

    useEffect(() => {
        axios.post('/api/user/getinfo', {
            token: sessionStorage.getItem('authtoken')
        })
        .then(res=> {
            setUserdata({ _id: res.data._id, name: res.data.name, email: res.data.email })
            console.log(res)
        })
        .catch(err => console.log(err)) 
    }, [])

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
                    <div className="chat-screen"></div>
                    <input type="text" name='message' placeholder='Type here...' className='message' />
                </div>
            </div>
        </div>
    )
}
