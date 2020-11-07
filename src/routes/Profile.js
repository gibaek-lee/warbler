import { authService, dbService } from "fbase"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { getAttachmentUrl } from "../utils/fbase"
import Nweet from "components/Nweet"
import FileModule from "../components/FileModule"

const Profile = ({ userObj, refreshUser }) => {
  const history = useHistory()
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName)
  const [attachment, setAttachment] = useState("")
  const [myNweets, setMyNweets] = useState([])
  const [isShowEditProfile, setIsShowEditProfile] = useState(false)

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
    
    let attachmentUrl = ""
    if(attachment) {
      attachmentUrl =  await getAttachmentUrl(userObj, attachment)
    }

    const {displayName, photoURL} = userObj

    if(newDisplayName && displayName !== newDisplayName) {
      await userObj.updateProfile({displayName: newDisplayName})      
    }
    if(attachmentUrl && photoURL !== attachmentUrl) {
      await userObj.updateProfile({photoURL: attachmentUrl})
    }

    setAttachment("")
    refreshUser() // update user for react dom
  }

  const getMyNweets = async () => {
    const nweets = await dbService
                        .collection("nweets")
                        .where("creatorId", "==", userObj.uid)
                        .orderBy("createdAt", "desc")
                        .get()

    const myNweetArray = nweets.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    setMyNweets(myNweetArray)
  }

  const toggleEditProfile = () => {
    setIsShowEditProfile(!isShowEditProfile)
  }

  useEffect(() => {
    let isMounted = true

    dbService.collection("nweets").onSnapshot(() => { 
      if(isMounted) {
        getMyNweets()
      }
    })

    return () => isMounted = false
  }, [])

  return (
    <div className="profile container">
      <div
        className="profile-edit-button" 
        onClick={toggleEditProfile}
      >
        <h1>Edit Profile</h1>
      </div>
      {isShowEditProfile && (
        <>
          <FileModule 
            attachment={attachment}
            setAttachment={setAttachment}
          />
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
              className="profile-form__submit form-btn brand-bg-color"
              type="submit" 
              value="Update Profile" 
            />
          </form>
        </>
      )}
      <div className="profile__my-nweets">
        <h1>My nweets</h1>
        <div className="profile__my-nweets-contents">
          {(myNweets.length > 0) ? (
            myNweets.map(nweet => (
              <Nweet 
                key={nweet.id} 
                nweetObj={nweet} 
                isOwner={nweet.creatorId === userObj.uid} 
              />
            ))
          ) : (
            <div className="profile__my-nweets-loading">loading...</div>
          )}
        </div>
      </div>
      <span 
        className="profile-form__cancel form-btn brand-bg-color cancel-btn" 
        onClick={onLogOutClick}
      >Log Out</span>
    </div>
  )
}

export default Profile