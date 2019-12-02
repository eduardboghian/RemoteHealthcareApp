import React,{ useState, useEffect } from 'react'
import './Profile.css'
import axios from 'axios'
import Avatar from '../DoctorCard/Avatar'

export default function Profile(props) {
    const [user, setUser] = useState([])
    const [path, setPath] = useState(' ')
    const [name, setName] = useState('')
    const [degree, setDegree] = useState('')
    const [addDegree, setAddDegree] = useState('')
    const [dep, setDep] = useState( )
    const [addDep, setAddDep] = useState('')
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [infos, setInfos] = useState([ ])

    useEffect(() => {
        axios.get(`/api/user/getdoctor/${props.match.params.id}`)
        .then( res => setUser([res.data[0]]) )
        .catch(err=> console.log(err))
    }, [])

    useEffect(() => {
        if(user.length>0) {
            console.log(user[0])
            setPath(user[0].profilePic)
            setName(user[0].name)
            setDegree(user[0].degree)
            setDep(user[0].departament)
            user[0].profileInfo.map(data=>{
                setInfos( infos => ([...infos, data]) )
            })
            
        }
        console.log(infos)
    }, [user])

    function addDegreeHandler(e) {
        e.preventDefault()

        axios.put(`/api/user/add-degree/${props.match.params.id}`, {
            degree: addDegree
        })
        .then( res => console.log(res) )
        .catch( err => console.log(err) ) 

        window.location.reload()
    }

    function addDepHandler(e) {
        e.preventDefault()

        axios.put(`/api/user/add-dep/${props.match.params.id}`, {
            departament: addDep
        })
        .then( res => console.log(res) )
        .catch( err => console.log(err) ) 

        window.location.reload()        
    }

    function addInfo(e) {
        e.preventDefault()

        axios.put(`/api/user/add-info/${props.match.params.id}`, {
            info: {title, text}
        })
        .then(res => console.log(res))
        .catch(err => console.log(err))

        window.location.reload()
    }

    return (
        <div className='profile-wr'>
            <div className="profile-bg"></div>
            <h1>Profile</h1>
            <Avatar path={path} className='pic' />
            <div className="general-info">
                <p className='profile-name'> <span>Name </span> {name}</p>
                <div>
                    <p className={ degree ? 'degree' : 'display-none' } > <span>Degree</span> {degree}</p>
                    <form className={ degree ? 'display-none' : 'degree'  }>
                        <input type="text" onChange={ e => setAddDegree(e.target.value) } />
                        <button onClick={ e => addDegreeHandler(e) }>Add Degree</button>
                    </form>
                </div>
                <div>
                    <p className={ dep ? 'dep' : 'display-none'  }> <span>Departament</span> {dep}</p>
                    <form className={ dep ? 'display-none' : 'dep'  }>
                        <input type="text" onChange={ e => setAddDep(e.target.value) } />
                        <button onClick={ e => addDepHandler(e) } >Add Departament</button>
                    </form>
                    <button>Chat</button>
                </div>
            </div>
            <h1>Profile Info</h1>
            <div className="profile-info">
                <div className='infos'> {} </div>
                <form action="">
                    <input type="text" className='profile-title' placeholder='Title' onChange={ e => setTitle(e.target.value) } />
                    <input type="text" className='profile-text' placeholder='Text' onChange={ e=> setText(e.target.value) } />
                    <button onClick={ e => addInfo(e) }>Add</button>
                </form>
            </div>
        </div>
    )
}
