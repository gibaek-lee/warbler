import { dbService, storageService } from "fbase"
import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"

const Nweet = ({nweetObj, isOwner}) => {
  const [editing, setEditing] = useState(false)
  const [newNweet, setNewNweet] = useState(nweetObj.text)
  
  const onDeleteCilck = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?")
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete()
      
      if (nweetObj.attachmentUrl) { // 이미지 없이 올려진 nweet 제거 시 에러 방지
        await storageService.refFromURL(nweetObj.attachmentUrl).delete()
      }
    }
  }

  const toggleEditing = () => setEditing((prev) => !prev)

  const onSubmit = async (event) => {
    event.preventDefault()
    await dbService.doc(`nweets/${nweetObj.id}`).update({text: newNweet})
    setEditing(false)
  }
  
  const onChange = (event) => {
    const {
      target: { value }
    } = event

    setNewNweet(value)
  }

  return (
    <div 
      className={`nweet ${editing ? 'mode-edit' : ''}`}
    >
      {editing ? (
        <>
          <form 
            className="nweet-form container"
            onSubmit={onSubmit}
          >
            <input
              className="nweet-form__input form-input"
              type="text" 
              placeholder="Edit yout nweet" 
              value={newNweet} 
              required
              onChange={onChange}
            />
            <input 
              className="nweet-form--submit form-btn brand-bg-color"
              type="submit" 
              value="Update Nweet" 
            />
          </form>
          <span 
            className="nweet-button--cancel form-btn brand-bg-color cancel-btn"
            onClick={toggleEditing}
          >Cancel</span>
        </>
      ) : (
        <>
          {nweetObj.attachmentUrl ? (
            <img 
              src={nweetObj.attachmentUrl} 
              width="28" 
              height="28" 
              alt="user attachment"
            />
          ) : (
            <FontAwesomeIcon 
              icon={faTwitter}
              color={"#04AAFF"} 
              size="2x"
            />
          )}
          <h4>{nweetObj.text}</h4>
          {isOwner && (
            <>
              <div className="nweet-me brand-bg-color">
                <span>Edit</span>
              </div>
              <div className="nweet-actions">
                <span onClick={onDeleteCilck}><FontAwesomeIcon icon={faTrash} /></span>
                <span onClick={toggleEditing}><FontAwesomeIcon icon={faPencilAlt} /></span>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Nweet