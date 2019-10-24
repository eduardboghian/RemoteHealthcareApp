import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import '../css/LoginForm.css'
import axios from 'axios'

export default function Login() {
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [registrationType, setRT] = useState('patient')

    function clickOnType(type) {
        if(type === 'doc') {
            setRT('doc')
            const pbtn = document.getElementById('patient-type-btn')
            pbtn.style.border = ' none'
            pbtn.style.color = '#000'
            pbtn.style.background = '#fff'
            
            const btn = document.getElementById('doc-type-btn')
            btn.style.border = ' 3px solid #fff'
            btn.style.color = '#fff'
            btn.style.background = '#4D9AFF'
        }else {
            setRT('patient')
            const pbtn = document.getElementById('doc-type-btn')
            pbtn.style.border = ' none'
            pbtn.style.color = '#000'
            pbtn.style.background = '#fff'

            const btn = document.getElementById('patient-type-btn')
            btn.style.border = ' 3px solid #fff'
            btn.style.color = '#fff'
            btn.style.background = '#4D9AFF'
        }       
    }

    function handleSubmit(e) {
        e.preventDefault()
        if(registrationType === 'patient' ){
            console.log('boss')
            axios.post('/api/user/login/patient', {
                email: email,
                password: password
            })
            .then(res=> console.log(res))
            .catch(err => console.log(err))
        }else{
            axios.post('/api/user/login/doctor', {
                email: email,
                password: password
            })
            .then(res=> console.log(res))
            .catch(err => console.log(err))
        }
        
    }

    return (
        <div className='login-bg'>
            <div className='login-wr'>
            
            <div className="type-btns">
                    <button className='patient-type-btn' id='patient-type-btn'  onClick={ e => clickOnType('patient') } >Patient</button>
                    <div>Or</div>
                    <button className='doc-type-btn' id='doc-type-btn' onClick={ e => clickOnType('doc') } >Doctor</button>
            </div>
            <div className="login-form">
                <form onSubmit={ e=> handleSubmit(e) }>
                    <label>
                        Email: <br />
                        <input type='email' name='email' value={email} onChange={ e => setEmail( e.target.value) } /> <br />
                    </label>
                    <label>
                        Password: <br />
                        <input type="password"  name='password' value={password} onChange={ e => setPassword(e.target.value) } /> <br />
                    </label>
                    <div>
                        <button type='submit'>Log In</button>
                        <Link to='/register'>Register</Link>
                    </div>
                </form>
            </div>
        </div>
        </div>
        
    )
}
