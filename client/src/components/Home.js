import React, { useState, useEffect } from 'react'
import '../css/Home.css'
import bg from '../media/bg2.jpg'
import axios from 'axios'
import dc from '../media/dc.jpg'

export default function Home() {
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
        <div >
            <div className='home-wr'>
                <nav>
                    <div className='logo'>Logo.</div>
                    <div className='nav-btns'>
                        <li>Home</li>
                        <li>Doctors</li>
                        <li>FAQ</li>
                    </div>
                    <div className="user-bar">
                        {userdata.name}
                    </div>
                    
                </nav>
                <div className="landing-board">
                    <div className='landing-bg'></div>
                    <img src={bg} alt=""/>

                    <p>We are providing remote<br />Health Care Services</p>

                    <button className='find-doc-btn'>Find Doctor</button>
                </div>

                <div className="doctors-wr">
                    <h1>Our Doctors:</h1>
                    <div className="cards-wr">
                        <div className="doc-card">
                            <img src={dc} alt=""/>
                            <p className='doc-name'>Dr. Alexandru Ghiorghe</p>
                        </div>
                        <div className="doc-card">
                            salut
                        </div>
                        <div className="doc-card">
                            salut
                        </div>
                        <div className="doc-card">
                            salut
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}
