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
        setUserObj(user ? {
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args)
        } : null)
        setInit(true)
      }
    })

    return () => isMounted = false
  }, [])

  const refreshUser = () => {
    const user = authService.currentUser
    // setUserObj(Object.assign({}, user))
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args)
    })
  }

  return (
    <>
      {init ? (
        <AppRouter 
          userObj={userObj} 
          refreshUser={refreshUser} 
        /> 
      ) : (
        <div className="app__init">Initializing...</div>
      )}
      <footer>&copy Nwitter {new Date().getFullYear()}</footer>
    </>
  )
}

export default App
