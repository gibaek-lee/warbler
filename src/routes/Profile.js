import { authService, dbService } from "fbase"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"

const Profile = ({ userObj }) => {
  const history = useHistory()
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName)

  const onLogOutClick = () => {
    authService.signOut()
    history.push("/")
  }
  
  const onChange = (event) => {
    const {
      target: { value }
    } = event

    setNewDisplayName(value)
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    
    if(userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName
      })
    }
  }

  const getMyNweets = async () => {
    const nweets = await dbService
                        .collection("nweets")
                        .where("creatorId", "==", userObj.uid)
                        .orderBy("createdAt", "desc")
                        .get()
    console.log(nweets.docs.map(doc => doc.data()))
  }

  useEffect(() => {
    getMyNweets()
  }, [])

  return (
    <>
      <form onSubmit={onSubmit}>
        <input 
          type="text" 
          placeholder="Display name" 
          value={newDisplayName}
          onChange={onChange} 
        />
        <input 
          type="submit" 
          value="Update Profile" 
        />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  )
}

export default Profile