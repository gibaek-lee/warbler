import React, { useEffect, useState } from 'react'
import AppRouter from 'components/Router'
import { authService } from 'fbase'

function App() {
  const [init, setInit] = useState(false)
  const [userObj, setUserObj] = useState(null)

  useEffect(() => {
    let isMounted = true

    authService.onAuthStateChanged(user => {
      if(isMounted) {
        setUserObj(user || null)
        setInit(true)  
      }
    })

    return () => isMounted = false
  }, [])

  return (
    <>
      {init ? <AppRouter userObj={userObj} /> : "Initializing...."}
      <footer>&copy Nwitter {new Date().getFullYear()}</footer>
    </>
  )
}

export default App
