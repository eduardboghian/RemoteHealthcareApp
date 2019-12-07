/* eslint-disable react/prefer-stateless-function */
import React, { useEffect, useState } from 'react'
import styles from './landing.module.css'
import { ReactComponent as SVG } from './undraw_doctor.svg'
import axios from 'axios'

export default function Landing(props) {
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

    return (
        <div className={styles.row}>
            <div className={styles.is_7}>
                <SVG className={styles.svg} />
            </div>
            <div className={styles.is_5}>
                <div className={styles.tagLine}>
                    <h1 className='msgl'>We are providing remote<br />Health Care Services</h1>
                </div>
            </div>
            <div className={styles.is_12}>
                <div className={styles.mouse_icon} />
            </div>
            <div className={styles.block}>
                <span>scroll</span>
            </div>
            
            <button className='find-doc-btn' > <a href='#dr'>Contact Doctor</a> </button>
        </div>
    )
    
}
