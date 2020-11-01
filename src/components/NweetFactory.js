import React, { useState } from "react"
import { dbService, storageService } from "fbase"
import { v4 as uuidv4 } from "uuid"

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState("")
  const [attachment, setAttachment] = useState(null)

  const onSubmit = async (event) => {
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
    setAttachment(null)
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
    setAttachment(null)
    document.querySelector('input[type=file]').value = '' // Choose File 버튼 눌렀다가 그냥 취소한 경우 value 초기화
  }

  return (
    <form onSubmit={onSubmit}>
      <input 
        type="text" 
        placeholder="What's on yout mind?" 
        maxLength={120} 
        onChange={onChange} 
        value={nweet}
      />
      <input 
        type="file" 
        accept="image/*" 
        onChange={onFileChange} 
      />
      <input 
        type="submit" 
        value="Nweet"
      />
      {attachment && (
        <div>
          <img src={attachment} width="50px" height="50px" alt="upload attachment"/>
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      )}
    </form>
  )
}

export default NweetFactory