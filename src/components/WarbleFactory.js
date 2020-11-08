import React, { useState } from "react"
import { dbService, FIRESTORE_DB_COLLECTION_NAME } from "fbase"
import { getAttachmentUrl } from "../utils/fbase"
import FileModule from "./FileModule"

const WarbleFactory = ({ userObj }) => {
  const [warble, setWarble] = useState("")
  const [attachment, setAttachment] = useState("")

  const onSubmit = async (event) => {
    if(warble === "") {
      return
    }

    event.preventDefault()

    let attachmentUrl = ""
    if(attachment) {
      attachmentUrl =  await getAttachmentUrl(userObj, attachment)
    }

    const warbleObj = {
      text: warble,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl
    }
    await dbService.collection(FIRESTORE_DB_COLLECTION_NAME).add(warbleObj)

    setWarble("")
    setAttachment("")
  }

  const onChange = (event) => {
    const {
      target: {value}
    } = event
    setWarble(value)
  }

  return (
    <form 
      className="warble-factory-form"
      onSubmit={onSubmit}
    >
      <div className="warble-factory-form__container">
        <input
          className="warble-factory-form__input-text" 
          type="text" 
          placeholder="What's on your mind?" 
          maxLength={120} 
          onChange={onChange} 
          value={warble}
        />
        <input 
          className="warble-factory-form__submit brand-bg-color"
          type="submit" 
          value="&rarr;"
        />
      </div>
      <FileModule 
        attachment={attachment}
        setAttachment={setAttachment}
      />
    </form>
  )
}

export default WarbleFactory