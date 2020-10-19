import { dbService } from "fbase"
import React from "react"

const Nweet = ({nweetObj, isOwner}) => {
  const onDeleteCilck = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?")
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete()
    }
  }

  return (
    <div>
      <h4>{nweetObj.text}</h4>
      {isOwner && (
        <>
          <button onClick={onDeleteCilck}>Delete Nweet</button>
          <button>Edit Nweet</button>
        </>
      )}
    </div>
  )
}

export default Nweet