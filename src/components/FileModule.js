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
    <div className="file-module">
      <label 
        className="file-module-label brand-font-color"
        htmlFor="attach-file"
      >
        <span>Add Photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        className="file-module-input"
        id="attach-file" 
        type="file"
        accept="image/*" 
        onChange={onFileChange} 
      />
      {attachment && (
        <div className="file-module__attachment">
          <img
            className="file-module__attachment-image"
            style={{backgroundImage: attachment}}
            src={attachment} 
            width="50px" 
            height="50px" 
            alt="upload attachment"
          />
          <div 
            className="file-module__attachment-clear"
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