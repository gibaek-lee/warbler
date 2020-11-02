import React, { useState } from "react"
import { dbService, storageService } from "fbase"
import { v4 as uuidv4 } from "uuid"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons"

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState("")
  const [attachment, setAttachment] = useState("")

  const onSubmit = async (event) => {
    if(nweet === "") {
      return
    }

    event.preventDefault()
    let attachmentUrl = ""

    if(attachment !== null) {
      const attachmentRef = storageService
                            .ref()
                            .child(`${userObj.uid}/${uuidv4()}`)
      const response = await attachmentRef.putString(attachment, "data_url")
      attachmentUrl =  await response.ref.getDownloadURL()
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

  const onFileChange = (event) => {
    const {
      target: {files}
    } = event
    const theFile = files[0]
    const reader = new FileReader()

    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: {result}
      } = finishedEvent
      setAttachment(result)
    }

    if(theFile) { // Choose File 버튼 눌렀다가 그냥 취소한 경우 필터링
      reader.readAsDataURL(theFile)
    }
  }
  
  const onClearAttachment = (event) => {
    setAttachment("")
    document.querySelector('input[type=file]').value = '' // Choose File 버튼 눌렀다가 그냥 취소한 경우 value 초기화
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
          className="nweet-factory-form__submit"
          type="submit" 
          value="&rarr;"
        />
      </div>
      <label 
        className="nweet-factory-form__file-label"
        htmlFor="attach-file"
      >
        <span>Add Photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        className="nweet-factory-form__file-input"
        id="attach-file" 
        type="file"
        accept="image/*" 
        onChange={onFileChange} 
      />
      {attachment && (
        <div className="nweet-factory-form__attachment">
          <img
            className="nweet-factory-form__attachment-image"
            style={{backgroundImage: attachment}}
            src={attachment} 
            width="50px" 
            height="50px" 
            alt="upload attachment"
          />
          <div 
            className="nweet-factory-form__attachment-clear"
            onClick={onClearAttachment}
          >
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  )
}

export default NweetFactory