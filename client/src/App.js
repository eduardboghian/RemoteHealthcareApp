import React from 'react'
import RegisterForm from './components/RegisterForm'
import Login from './components/Login'
import Home from './components/Home'
import { Route } from 'react-router-dom'
import Dashboard from './components/DashboardComp'
import VideoRoom from './components/VideoRoom'
import Profile from './components/Profile/Profile'

function App() {
  return (
    <div className="App">
      <Route path='/register' component={ RegisterForm } />
      <Route exact path='/' component={Home} />
      <Route path='/login' component={Login} />
      <Route path="/dashboard/:did/:pid/:name" component={Dashboard} />
      <Route path='/videoroom/:did/:pid/:name' component={VideoRoom} />
      <Route path='/profile/:id' component={Profile} />
    </div>
  )
}

export default App
