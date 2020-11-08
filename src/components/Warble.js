import { dbService, storageService } from "fbase"
import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons"
import { faTwitter } from "@fortawesome/free-brands-svg-icons"

const Warble = ({warbleObj, isOwner}) => {
  const [editing, setEditing] = useState(false)
  const [newWarble, setNewWarble] = useState(warbleObj.text)
  
  const onDeleteCilck = async () => {
    const ok = window.confirm("Are you sure you want to delete this warble?")
    if (ok) {
      await dbService.doc(`warbles/${warbleObj.id}`).delete()
      
      if (warbleObj.attachmentUrl) { // 이미지 없이 올려진 warble 제거 시 에러 방지
        await storageService.refFromURL(warbleObj.attachmentUrl).delete()
      }
    }
  }

  const toggleEditing = () => setEditing((prev) => !prev)

  const onSubmit = async (event) => {
    event.preventDefault()
    await dbService.doc(`warbles/${warbleObj.id}`).update({text: newWarble})
    setEditing(false)
  }

  const onChange = (event) => {
    const {
      target: { value }
    } = event

    setNewWarble(value)
  }

  return (
    <div 
      className={`warble ${editing ? 'mode-edit' : ''}`}
    >
      {editing ? (
        <>
          <form 
            className="warble-form container"
            onSubmit={onSubmit}
          >
            <input
              className="warble-form__input form-input"
              type="text" 
              placeholder="Edit your warble" 
              value={newWarble} 
              required
              onChange={onChange}
            />
            <input 
              className="warble-form--submit form-btn brand-bg-color"
              type="submit" 
              value="Update Warble" 
            />
          </form>
          <span 
            className="warble-button--cancel form-btn brand-bg-color cancel-btn"
            onClick={toggleEditing}
          >Cancel</span>
        </>
      ) : (
        <>
          {warbleObj.attachmentUrl ? (
            <img 
              src={warbleObj.attachmentUrl} 
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
          <h4>{warbleObj.text}</h4>
          {isOwner && (
            <>
              <div className="warble-me brand-bg-color">
                <span>Edit</span>
              </div>
              <div className="warble-actions">
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

export default Warble