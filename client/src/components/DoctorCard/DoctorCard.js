import React, { useState, useEffect } from 'react'
import Avatar from './Avatar'
import axios from 'axios'
import StarRatings from 'react-star-ratings'
import './DoctorCard.css'

import textIcon from '../../media/1.5x/text-icon@1.5x.png'
import videoIcon from '../../media/video.png'

export default function DoctorCard(props) {
    const [doctors, setDoctors] = useState([ ])
    const [userdata, setUserdata] = useState({
        _id: '',
        name: '',
        email: ''
    })
    const [rating, setRating] = useState(0)

    useEffect(() => {
        //Load data
        axios.get('/api/user/getdoctors')
        .then( res=>res.data.map((doc)=>{
            setDoctors( (doctors)=> ([...doctors, doc]) )

            return 0 
        })  )
        .catch( err => console.log(err) )

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
        props.props.history.push(`/dashboard/${docId}/${patientId}/${userdata.name}`)
    }

    function handleSeeProfile(id) {
        props.props.history.push(`/profile/${id}`)
    }

    function changeRating( newRating, id ) {

        axios.put(`/api/user/rate/${id}`,{rating:newRating})
        .then(res=> console.log(res))
        .catch(err=> console.log(err)) 
        setRating(newRating)
        window.location.reload()
    }

    const handleClick = (docId) => {
        let patientId = userdata._id
        props.props.history.push(`/videoroom/${docId}/${patientId}/${userdata.name}`)
    }

    return (
        <div className='cards-wr'>
            
            {doctors.map( (data, i) => {
                return <div key={i} className='doc-card' >
                    
                    <div style={{ 
                        width: '100%', 
                        height: '250px',
                        background: '#ddd'
                     }}><Avatar path={data.profilePic} /></div>
                    
                    <p><span>Name: </span> { data.name }</p>
                    <p className="departament"><span>Departament: </span> { data.departament }</p>
                    <p className="degree"><span>Degree: </span> { data.degree }</p>
                    <div className="contact-doc">
                        <button className="more-info" onClick={ e=> handleSeeProfile(data._id) }>Profile</button>
                        <button className='text-doc' onClick={ e => contactDoc(data._id)}> <img src={textIcon} alt=""/> </button>
                        <button className="videocall-doc" onClick={ e=> handleClick(data._id) }> <img src={videoIcon} alt=""/> </button>
                    </div>
                    <div className='rating'>{ (data.rating/data.raters ).toFixed(2) }</div>
                    <StarRatings
                        className = 'stars'
                        rating={rating}
                        starRatedColor="light-grey"
                        changeRating={changeRating}
                        numberOfStars={5}
                        name={data._id}
                        starDimension="25px"
                        starSpacing="2px"
                    />
                </div>  
            })}
        </div>
    ) 
}
