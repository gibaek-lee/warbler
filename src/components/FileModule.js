import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons"



const FileModule = ({attachment, setAttachment}) => {
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
  
  const onClearAttachment = () => {
    setAttachment("")
    document.querySelector('input[type=file]').value = '' // Choose File 버튼 눌렀다가 그냥 취소한 경우 value 초기화
  }

  return (
    <div className="nweet-factory-form__file">
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
    </div>
  )
}

export default FileModule