import React,{ useState, useEffect } from 'react'
import './Profile.css'
import axios from 'axios'
import Avatar from '../DoctorCard/Avatar'
import bg from '../../media/bg.svg'
import { Link } from 'react-router-dom'
 
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
    const [info, setInfo] = useState([])
    const [id, setId] = useState('')
    const [type, setType] = useState('')

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
    

    useEffect(() => {
        axios.get(`/api/user/getdoctor/${props.match.params.id}`)
        .then( res => setUser([res.data[0]]) )
        .catch(err=> console.log(err))

        axios.post('/api/user/getinfo', {
            token: sessionStorage.getItem('authtoken')
        })
        .then(res=> {
            setType(res.data.type)
        })
        .catch(err => console.log(err)) 
    }, [])

    useEffect(() => {
        if(user.length>0) {
            console.log(user[0].profileInfo)
            user[0].profileInfo.map(data=> setInfo(info=>[...info, data]))
            setPath(user[0].profilePic)
            setName(user[0].name)
            setId(user[0]._id)
            setDegree(user[0].degree)
            setDep(user[0].departament)
        }
    }, [user])

    function addDegreeHandler(e) {
        e.preventDefault()

        if( type === 'doctor') {
            axios.put(`/api/user/add-degree/${props.match.params.id}`, {
                degree: addDegree
            })
            .then( res => console.log(res) )
            .catch( err => console.log(err) ) 

            window.location.reload() 
        }

    }

    function addDepHandler(e) {
        e.preventDefault()

        if( type==='doctor') {
            axios.put(`/api/user/add-dep/${props.match.params.id}`, {
                departament: addDep
            })
            .then( res => console.log(res) )
            .catch( err => console.log(err) ) 

            window.location.reload() 
        }       
    }

    function addInfo(e) {
        e.preventDefault()

        if(type==='doctor') {
            axios.put(`/api/user/add-info/${props.match.params.id}`, {
                info: {title, text}
            })
            .then(res => console.log(res))
            .catch(err => console.log(err))
    
            window.location.reload()
        }
    }

    function toChat(e) {
        e.preventDefault()
        
        if( type === 'doctor' ) {
            props.history.push(`/dashboard/${id}/z/${name}`)
        }  
    }

    function handleLogout(e) {
        e.preventDefault()

        sessionStorage.removeItem('authtoken')
        props.history.push(`/login`)
    } 

    function home() {
        props.history.push(`/`)
    }


    return (
        <div className='profile-wr'>
            <nav className='desktop-nav'>
                    <div className='logo' >Remote Health Care</div>
                    <div className='nav-btns'>
                        <li></li>
                        <li onClick={e=>home()}>Home</li>
                        <li></li>
                    </div>
                    <div className="user-bar">
                        
                        <div className={ userdata.name ? 'display-none' : 'auth-bar' }> <Link className='login-btn' to='/login' >Login</ Link> <Link to='/register' >Sign Up</Link> </div>
                        <div className={ userdata.name ? 'username' : 'display-none'}>
                            {userdata.name}
                            <div className="logout" onClick={ e => handleLogout(e) }>Log out</div>
                        </div>
                    </div>
                    
                </nav>
            <div className="profile-bg">    
                <img src={bg} alt="nu este"/>
            </div>
            

            <h1>Profile</h1>
            <div className="profile-pic">
                <Avatar path={path} className='pic' />
                <div className={ type==='patient' ? 'display-none' : ' ' }>
                    <form  className={path ? 'display-none' : ''} action={`/api/profile/${id}`} method="post" encType="multipart/form-data">
                        <input type="file" name="avatar"  className='tests' />
                        <button type='submit' >Send Picture</button>
                    </form>
                </div>
                
            </div>
            
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
                    <button onClick={ e=> toChat(e) }>Chat</button>
                </div>
            </div>
            <h1 className='br'>Profile Info</h1>{console.log(type)}
            <div className= 'profile-info' >
                <div className='infos'> {info.map((data, i) => <div key={i}><div className='info-title'>{data.title.toUpperCase()} </div> <div  className='info-text'> {data.text} </div></div> )} </div>
                <form className= {type==='doctor' ? '' : 'display-none' } >
                    <input type="text" className='profile-title' placeholder='Title' onChange={ e => setTitle(e.target.value) } />
                    <input type="text" className='profile-text' placeholder='Text' onChange={ e=> setText(e.target.value) } />
                    <button onClick={ e => addInfo(e) }>Add</button>
                </form>
            </div>
        </div>
    )
}
