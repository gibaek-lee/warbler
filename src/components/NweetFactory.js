import React, { useState } from "react"
import { dbService } from "fbase"
import { getAttachmentUrl } from "../utils/fbase"
import FileModule from "./FileModule"

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState("")
  const [attachment, setAttachment] = useState("")

  const onSubmit = async (event) => {
    if(nweet === "") {
      return
    }

    event.preventDefault()

    let attachmentUrl = ""
    if(attachment) {
      attachmentUrl =  await getAttachmentUrl(userObj, attachment)
    }

    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl
    }
    await dbService.collection("nweets").add(nweetObj)

    setNweet("")
    setAttachment("")
  }

  const onChange = (event) => {
    const {
      target: {value}
    } = event
    setNweet(value)
  }

  return (
    <form 
      className="nweet-factory-form"
      onSubmit={onSubmit}
    >
      <div className="nweet-factory-form__container">
        <input
          className="nweet-factory-form__input-text" 
          type="text" 
          placeholder="What's on yout mind?" 
          maxLength={120} 
          onChange={onChange} 
          value={nweet}
        />
        <input 
          className="nweet-factory-form__submit brand-bg-color"
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

export default NweetFactory