import React, { useState, useEffect } from 'react'
import axios from 'axios'

import '../css/ReviewsSection.css'

export default function ReviewsSection() {
    const [userId, setUserId] = useState('')
    const [username, setUsername] = useState('')
    const [reviews, setReviews] = useState([])
    const [message, setMessage] = useState('')

    useEffect(() => {
        // load messages from db
        axios.get('/api/chat/getreviews')
        .then(res => setReviews(res.data))
        .catch(err => console.log(err))

        // get user info
        axios.post('/api/user/getinfo', { token: sessionStorage.getItem('authtoken') })
        .then(res=> { 
            setUserId(res.data._id)
            setUsername(res.data.name)
        })
        .catch(err => console.log(err)) 
    }, [])

    function hendleSubmit() {
        axios.post('/api/chat/addreview', {
            name: username,
            message: message,
            userId: userId
        })
        .then(res => console.log(res))
        .catch(err => console.log(err))
    }

    return (
        <div className='reviews-wr'>
            <div className="reviews">
                {reviews.map()}
            </div>

            <div className="form-wr">
                <form className="form">
                    <input
                    className="input"
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={({ target: { value } }) => setMessage(value)}
                    onKeyPress={event => event.key === 'Enter' ?hendleSubmit(event) : null}
                    />
                    <button className="sendButton" onClick={e => hendleSubmit(e)}>Send</button>
                </form>
            </div>
        </div>
    )
}
