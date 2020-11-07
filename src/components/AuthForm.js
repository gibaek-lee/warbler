import { authService } from "fbase"
import React, { useState } from "react"

const AuthForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [newAccount, setNewAccount] = useState(true)
  const [error, setError] = useState("")

  const onChange = (event) => {
    const {target: {name, value}} = event
    
    if(name === "email") {
      setEmail(value)
    } else if(name === "password") {
      setPassword(value)
    }
  }
  
  const onSubmit = async (event) => {
    event.preventDefault()
    
    try {
      if(newAccount) {
        await authService.createUserWithEmailAndPassword(email, password)
      } else {
        await authService.signInWithEmailAndPassword(email, password)
      }
    } catch(error) {
      setError(error.message)
    }
  }

  const toggleAccount = () => setNewAccount(prev => !prev)

  return (
    <>  
      <form 
        className="auth-form container"
        onSubmit={onSubmit}
      >
        <input 
          className="auth-form__input"
          name="email" 
          type="email" 
          placeholder="Email" 
          required 
          value={email}
          onChange={onChange}          
        />
        <input 
          className="auth-form__input"
          name="password" 
          type="password" 
          placeholder="Password" 
          required 
          value={password}
          onChange={onChange}
          
        />
        <input 
          className="auth-form__input auth-form__submit"
          type="submit" 
          value={newAccount ? "Create Account" : "Log In"} 
        />
        {error && <span className="auth-form__error">{error}</span>}
      </form>
      <span 
        className="auth-switch brand-font-color"
        onClick={toggleAccount}
      >{newAccount ? "Sign in" : "Create Account "}</span>
    </>
  )
}

export default AuthForm