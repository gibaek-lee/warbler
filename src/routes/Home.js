import { dbService, FIRESTORE_DB_COLLECTION_NAME } from "fbase"
import React, { useEffect, useState } from "react"
import Warble from "components/Warble"
import WarbleFactory from "components/WarbleFactory"

const Home = ({ userObj }) => {
  const [warbles, setWarbles] = useState([])
  
  useEffect(() => {
    let isMounted = true

    //[TODO] 로그아웃 후 계속 스냅샷이 돌다가 파이어스토어 규칙(유저 존재)와 부딪혀 에러 발생한다.
    dbService.collection(FIRESTORE_DB_COLLECTION_NAME).onSnapshot(async snapshot => {
      const warbleArray = await snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      if(isMounted) {
        setWarbles(warbleArray)
      }
    })

    return () => isMounted = false
  }, [])

  return (
    <div className="home container">
      <WarbleFactory userObj={userObj} />
      <div className="home__warbles">
        {warbles.map(warble => (
          <Warble 
            key={warble.id} 
            warbleObj={warble} 
            isOwner={warble.creatorId === userObj.uid} 
          />
        ))}
      </div>
    </div>
  )
}

export default Home