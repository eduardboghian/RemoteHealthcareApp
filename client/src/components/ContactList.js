import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function ContactList({contactList}) {
    const [contacts, setContacts] = useState([])

    useEffect(() => {
        contactList.map((data, i) =>{
            axios.get(`/api/user/getdoctor/${data}`)
            .then(res => console.log(res))
            .catch(err => console.log(err))
            })
        
    }, [])
    
    return (
        <div>
            {contactList.map((data, i) =>{
            axios.get(`/api/user/getdoctor/${data}`)
            .then(res => <div className='contacts'>{res}</div> )
            .catch(err => console.log(err))
            })}
        </div>
    )
}
