import React, { useState, useEffect } from 'react'
import '../css/Home.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Landing from '../components/Landing/landing'
import Footer from '../components/Footer/Footer'
import ReviewsSection from '../components/ReviewsSection'
import DocCard from '../components/DoctorCard/DoctorCard'


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

    function handleLogout(e) {
        e.preventDefault()

        sessionStorage.removeItem('authtoken')
        props.history.push(`/login`)
    } 

    return (

        <div >
            <div className='home-wr'>
                <nav className='desktop-nav'>
                    <div className='logo' >Remote Health Care</div>
                    <div className='nav-btns'>
                        <li></li>
                        <li></li>
                        <li></li>
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

                <div className="doctors-wr" id='dr'>
                    <h1>Our Doctors:</h1>
                    <DocCard props={props}/>

                </div>
                <h1>Reviews Section</h1>
                <ReviewsSection />

                <Footer />
            </div>
        </div>
    )
}
