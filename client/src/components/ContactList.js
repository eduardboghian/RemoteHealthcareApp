import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function ContactList({props, contactList}) {
    const [contacts, setContacts] = useState([])
    const [doctors, setDoctors] =useState([])
    const [userId, setUserId] = useState('')
    const [username, setUsername] = useState('')

    useEffect(() => {
        axios.get(`/api/user/getdoctors`)
        .then( res => setDoctors(res))
        .catch(err => console.log(err)) 
        
        axios.post('/api/user/getinfo', { token: sessionStorage.getItem('authtoken') })
        .then(res=> { 
            setUserId(res.data._id)
            setUsername(res.data.name)
        })
        .catch(err => console.log(err)) 
    }, [])

    useEffect(() => {
        contactList.map((data) =>{
            if(doctors.data !== undefined){
                let contact = { name: doctors.data.find(  d => d._id===data).name, id: doctors.data.find(  d => d._id===data)._id}
                setContacts(contacts => [...contacts, contact])
            }
        })
    }, [doctors])

    function redirectHandler(e, docId) {
        e.preventDefault()
        props.history.push(`/dashboard/${docId}/${userId}/${username}`)
        window.location.reload()
    }
    
    return (
        <div>
            {contacts.map((data, i) => 
                <div className="contacts" key={i} onClick={ e => redirectHandler(e, data.id) }  >{data.name}</div> 
            )}
        </div>
    )
}
