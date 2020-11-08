import { authService, dbService, FIRESTORE_DB_COLLECTION_NAME } from "fbase"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { getAttachmentUrl } from "../utils/fbase"
import Warble from "components/Warble"
import FileModule from "../components/FileModule"

const Profile = ({ userObj, refreshUser }) => {
  const history = useHistory()
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName)
  const [attachment, setAttachment] = useState("")
  const [myWarbles, setMyWarbles] = useState([])
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

  const getMyWarbles = async () => {
    const warbles = await dbService
                        .collection(FIRESTORE_DB_COLLECTION_NAME)
                        .where("creatorId", "==", userObj.uid)
                        .orderBy("createdAt", "desc")
                        .get()

    const myWarbleArray = warbles.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    setMyWarbles(myWarbleArray)
  }

  const toggleEditProfile = () => {
    setIsShowEditProfile(!isShowEditProfile)
  }

  useEffect(() => {
    let isMounted = true

    dbService.collection(FIRESTORE_DB_COLLECTION_NAME).onSnapshot(() => { 
      if(isMounted) {
        getMyWarbles()
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
      <div className="profile__my-warbles">
        <h1>My warbles</h1>
        <div className="profile__my-warbles-contents">
          {(myWarbles.length > 0) ? (
            myWarbles.map(warble => (
              <Warble 
                key={warble.id} 
                warbleObj={warble} 
                isOwner={warble.creatorId === userObj.uid} 
              />
            ))
          ) : (
            <div className="profile__my-warbles-loading">loading...</div>
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