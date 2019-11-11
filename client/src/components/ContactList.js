import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function ContactList({contactList}) {
    const [contacts, setContacts] = useState([])

    useEffect(() => {
        
        contactList.map((data, i) =>{
            axios.get(`/api/user/getdoctor/${data}`)
            .then(res => console.log('contacts', res.data[0].name))
            .catch(err => console.log(err))
        })
    }, [contactList])
    
    return (
        <div>
            {contactList.map((data, i)=> 
                <div className="contacts" key={i}>{data}</div>
            )}
        </div>
    )
}
