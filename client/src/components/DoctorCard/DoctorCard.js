import React, { useState, useEffect } from 'react'
import Avatar from './Avatar'
import axios from 'axios'

export default function DoctorCard() {
    const [doctors, setDoctors] = useState([ ])


    useEffect(() => {
        axios.get('/api/user/getdoctors')
        .then( res=> setDoctors([res.data]) )
        .catch( err => console.log(err) )
    }, [])

    return (
        <div>
            {console.log('dcs:', doctors)}
            <Avatar />
        </div>
    )
}
