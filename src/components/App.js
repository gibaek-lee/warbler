import React, { useEffect, useState } from 'react'
import AppRouter from 'components/Router'
import { authService } from 'fbase'
import defaultUser from 'user'

function App() {
  const [init, setInit] = useState(false)
  const [userObj, setUserObj] = useState(null)

  useEffect(() => {
    let isMounted = true

    authService.onAuthStateChanged(user => {
      if(isMounted) {
        setUserObj(user ? {
          displayName: user.displayName || defaultUser.displayName,
          photoURL: user.photoURL || defaultUser.photoURL,
          uid: user.uid,
          updateProfile: (args) => {
            user.updateProfile(args)
          }
        } : null)
        
        setInit(true)
      }
    })

    return () => isMounted = false
  }, [])


  //[TODO] profile update 할 때 두번 업데이트 서밋해야 변경사항 실시간 감지한다.
  const refreshUser = () => {
    const user = authService.currentUser

    setUserObj({
      displayName: user.displayName,
      photoURL: user.photoURL,
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
      <footer className="brand-font-color">&copy Nwitter {new Date().getFullYear()}</footer>
    </>
  )
}

export default App
