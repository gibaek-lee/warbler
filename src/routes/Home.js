import { dbService } from "fbase"
import React, { useEffect, useState } from "react"
import Nweet from "components/Nweet"

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("")
  const [nweets, setNweets] = useState([])

  useEffect(() => {
    let isMounted = true

    dbService.collection("nweets").onSnapshot(async snapshot => {
      const nweetArray = await snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      if(isMounted) {
        setNweets(nweetArray)
      }
    })

    return () => isMounted = false
  }, [])

  const onSubmit = async (event) => {
    event.preventDefault()
    await dbService.collection("nweets").add({
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid
    })
    setNweet("")
  }

  const onChange = (event) => {
    const {
      target:{value}
    } = event
    setNweet(value)
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input 
          type="text" 
          placeholder="What's on yout mind?" 
          maxLength={120} 
          onChange={onChange} 
          value={nweet}
        />
        <input 
          type="submit" 
          value="Nweet"
        />
      </form>
      <div>
        {nweets.map(nweet => (
          <Nweet 
            key={nweet.id} 
            nweetObj={nweet} 
            isOwner={nweet.creatorId === userObj.uid} 
          />
        ))}
      </div>
    </div>
  )
}

export default Home