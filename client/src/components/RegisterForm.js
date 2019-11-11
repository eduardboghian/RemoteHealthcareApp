import React, { useState } from 'react'
import '../css/RegisterForm.css'
import axios from  'axios'


export default function RegisterForm(props) {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [practiceNumber, setPN] = useState('')
    const [idCardNr, setICN] = useState('')
    const [registrationType, setRT] = useState('patient')

    function clickOnType(type) {
        if(type === 'doc') {
            document.getElementById("only-docs").style.display = 'block'
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
            document.getElementById("only-docs").style.display = 'none'
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

    function submitHandler(e, type) {
        e.preventDefault(props)
        if(type === 'patient') {
            axios.post('/api/user/register/patient', {
                name: name,
                email: email,
                password: password
            })
            .then(() => props.history.push('/login') )
            .catch(error => {
                console.log(error)
            })
        }else {
            axios.post('/api/user/register/doctor', {
                name: name,
                email: email,
                password: password,
                practiceNumber: practiceNumber,
                idCardNr: idCardNr
            })
            .then(() => props.history.push('/login') )
            .catch(error => {
                console.log(error)
            })
        }
        
    }

    return (
        <div className="register-bg">
            <div className='wr'>
            <div className="register-form">
                <div className="type-btns">
                    <button className='patient-type-btn' id='patient-type-btn' onClick={ e => clickOnType('patient') } >Patient</button>
                    <div>Or</div>
                    <button className='doc-type-btn' id='doc-type-btn' onClick={ e => clickOnType('doc') } >Doctor</button>
                </div>

                <form onSubmit={ e => submitHandler(e, registrationType, props) } >
                    <label>
                        Name:
                        <input type="text" value={name} name='name' onChange = { e => setName(e.target.value) } />
                    </label>

                    <label>
                        Email:
                        <input type="email" value={email} name='email' onChange = { e => setEmail(e.target.value) }/>
                    </label>

                    <label>
                        Password:
                        <input type="password" value={password} name='password' onChange = { e => setPassword(e.target.value) }/>
                    </label>

                    <div id="only-docs">
                        <label >
                            Practice Number
                            <input type="text" value={practiceNumber} name='practiceNumber' onChange = { e => setPN(e.target.value) }/>
                        </label>
                        <label>
                            National ID card number
                            <input type="text" value={idCardNr} name='idCardNr' onChange = { e => setICN(e.target.value) } />
                        </label>
                    </div>

                    <button type='submit'>Submit</button>
                </form>
            </div>
        </div>
        </div>
        
    )
}


