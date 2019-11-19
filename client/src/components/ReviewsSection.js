import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function ReviewsSection() {
    const [reviews, setReviews] = useState([])

    useEffect(() => {
        
    }, [])

    return (
        <div className='reviews-wr'>
            <div className="reviews"></div>
            <div className="form"></div>
        </div>
    )
}
