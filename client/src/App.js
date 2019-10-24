import React from 'react'
import RegisterForm from './components/RegisterForm'
import Login from './components/Login'
import Home from './components/Home'
import { Route } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <Route path='/register' component={ RegisterForm } />
      <Route exact path='/' component={Login} />
      <Route path='/home' component={Home} />
    </div>
  )
}

export default App
