import React from 'react'
import RegisterForm from './components/RegisterForm'
import Login from './components/Login'
import { Route } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Route path='/register' component={ RegisterForm } />
      <Route exact path='/' component={Login} />
    </div>
  )
}

export default App
