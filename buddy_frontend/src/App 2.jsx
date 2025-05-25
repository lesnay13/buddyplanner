import { useState } from 'react'
import './App.css'
import Login from './components/Login'
import SignUp from './components/SignUp'

function App() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div>
      {isLogin ? (
        <>
          <Login />
          <button onClick={() => setIsLogin(false)}>Need an account? Sign Up</button>
        </>
      ) : (
        <>
          <SignUp />
          <button onClick={() => setIsLogin(true)}>Already have an account? Login</button>
        </>
      )}
    </div>
  )
}

export default App
