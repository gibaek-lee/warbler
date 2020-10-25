import { dbService, storageService } from "fbase"
import React, { useState } from "react"

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
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input 
              type="text" 
              placeholder="Edit yout nweet" 
              value={newNweet} 
              required
              onChange={onChange}
            />
            <input type="submit" value="Update Nweet" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && (
            <img src={nweetObj.attachmentUrl} width="50px" height="50px" alt="user attachment"/>
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteCilck}>Delete Nweet</button>
              <button onClick={toggleEditing}>Edit Nweet</button>
            </>
          )}
        </>
      )} 
    </div>
  )
}

export default Nweet