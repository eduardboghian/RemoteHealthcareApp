import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function ContactList({props, contactList}) {
    const [contacts, setContacts] = useState([])
    const [type, setType] = useState('')
    const [doctors, setDoctors] =useState([])
    const [patients, setPatients] = useState([])
    const [userId, setUserId] = useState('')
    const [username, setUsername] = useState('')

    useEffect(() => {
        axios.get(`/api/user/getdoctors`)
        .then( res => setDoctors(res))
        .catch(err => console.log(err)) 

        axios.get(`/api/user/getusers`)
        .then( res => setPatients(res))
        .catch(err => console.log(err)) 
        
        axios.post('/api/user/getinfo', { token: sessionStorage.getItem('authtoken') })
        .then(res=> { 
            setUserId(res.data._id)
            setUsername(res.data.name)
            setType(res.data.type)
        })
        .catch(err => console.log(err)) 
    }, [])

    useEffect(() => {
        if(type === 'patient'){
            contactList.map((data) =>{
                if(doctors.data !== undefined){
                    if(doctors.data.find(d => d._id===data)!==undefined) {
                        let contact = { name: doctors.data.find(d => d._id===data).name, id: doctors.data.find(d => d._id===data)._id }
                        setContacts(contacts => [...contacts, contact])
                    }    
                }
            })
            return
        }
        
    },[contactList, type, doctors])

    useEffect(() => {
        if(type === 'doctor'){
            contactList.map((data) =>{

                if(patients.data !== undefined){
                    if(patients.data.find(d => d._id===data)!==undefined) {
                        let contact = { name: patients.data.find(d => d._id===data).name, id: patients.data.find(d => d._id===data)._id }
                        setContacts(contacts => [...contacts, contact])
                    } 
                }
            })
            return
        }
        
    },[contactList, type, patients])


    function redirectHandler(e, docId) {
        e.preventDefault()
        if(type==='patient'){
            props.history.push(`/dashboard/${docId}/${userId}/${username}`)
            window.location.reload()
        }else{
            props.history.push(`/dashboard/${userId}/${docId}/${username}`)
            window.location.reload()
        }
        
    }
    
    return (
        <div>
            {contacts.map((data, i) => 
                <div className="contacts" key={i} onClick={ e => redirectHandler(e, data.id) }>{data.name}</div> 
            )}
        </div>
    )
}
