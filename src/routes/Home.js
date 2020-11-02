import { dbService } from "fbase"
import React, { useEffect, useState } from "react"
import Nweet from "components/Nweet"
import NweetFactory from "components/NweetFactory"

const Home = ({ userObj }) => {
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

  return (
    <div className="home container">
      <NweetFactory userObj={userObj} />
      <div className="home__nweets">
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