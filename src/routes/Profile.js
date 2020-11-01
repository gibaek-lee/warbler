import { authService, dbService } from "fbase"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"

const Profile = ({ userObj, refreshUser }) => {
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
      refreshUser() // update user for react dom
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
    <div className="profile container">
      <form 
        className="profile-form"
        onSubmit={onSubmit}
      >
        <input 
          className="profile-form__input form-input"
          type="text" 
          placeholder="Display name" 
          value={newDisplayName}
          autoFocus
          onChange={onChange} 
        />
        <input
          className="profile-form__submit form-btn"
          type="submit" 
          value="Update Profile" 
        />
      </form>
      <span 
        className="profile-form__cancel form-btn cancel-btn" 
        onClick={onLogOutClick}
      >Log Out</span>
    </div>
  )
}

export default Profile