import React, { useState, useEffect } from 'react'
import '../css/Home.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import dc from '../media/dc.jpg'
import textIcon from '../media/1.5x/text-icon@1.5x.png'
import videoIcon from '../media/video.png'
import Landing from '../components/Landing/landing'
import Footer from '../components/Footer/Footer'
import ReviewsSection from '../components/ReviewsSection'

export default function Home(props) {
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
        })
        .catch(err => console.log(err)) 
    }, [])

    function contactDoc(docId) {
        let patientId = userdata._id
        props.history.push(`/dashboard/${docId}/${patientId}/${userdata.name}`)
    }

    function handleLogout(e) {
        e.preventDefault()

        sessionStorage.removeItem('authtoken')
        props.history.push(`/login`)
    } 

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
                        
                        <div className={ userdata.name ? 'display-none' : 'auth-bar' }> <Link className='login-btn' to='/login' >Login</ Link> <Link to='/register' >Sign Up</Link> </div>
                        <div className={ userdata.name ? 'username' : 'display-none'}>
                            {userdata.name}
                            <div className="logout" onClick={ e => handleLogout(e) }>Log out</div>
                        </div>
                    </div>
                    
                </nav>
                <div className="landing-board">
                    <Landing />
                </div>

                <div className="doctors-wr">
                    <h1>Our Doctors:</h1>
                    <div className="cards-wr">
                        <div className="doc-card">
                            <img src={dc} alt=""/>
                            <p className='doc-name'>Dr. Alexandru Ghiorghe</p>
                            <p className="departament"> <span> Departament: </span>  Creier</p>
                            <p className='degree'> <span>  Degree: </span> Hartie</p>
                            <div className="contact-doc">
                                <button className="more-info">More Info</button>
                                <button className='text-doc' onClick={ e => contactDoc('5db7faf86ea78434fc897841')}> <img src={textIcon} alt=""/> </button>
                                <button className='text-doc' onClick={ e => contactDoc('5db83e23ebc2113fc4bf0942')}> <img src={textIcon} alt=""/> </button>
                                <button className="videocall-doc"> <img src={videoIcon} alt=""/> </button>
                            </div>
                            <p>* * * * *</p>
                        </div>
                        <div className="doc-card">
                            salut
                        </div>
                        <div className="doc-card">
                            salu
                        </div>
                        <div className="doc-card">
                            salut
                        </div>

                    </div>
                </div>
                <h1>Reviews Section</h1>
                <ReviewsSection />

                <Footer />
            </div>
        </div>
    )
}
