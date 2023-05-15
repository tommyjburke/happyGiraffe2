// import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'

// export default function Greeting({ title }) {
//    const { user } = useSelector((state) => state.users)
//    const { activeProfile } = useSelector((state) => state.activeProfile)
//    const timeNow = new Date().getHours()
//    let greeting
//    let name

//    if (activeProfile != undefined) {
//       name = activeProfile.name
//    } else if (user) {
//       name = user.name
//    } else {
//       name = 'Stranger'
//    }
//    console.log('____________NAME____________', user.name)

//    if (timeNow >= 5 && timeNow < 12) {
//       greeting = `Good Morning ${name}!`
//    } else if (timeNow >= 12 && timeNow < 18) {
//       greeting = `Good Afternoon ${name}!`
//    } else {
//       greeting = `Hey ${name}! Children must not stay up too late!`
//    }

//    const [currentCharIndex, setCurrentCharIndex] = useState(0)

//    useEffect(() => {
//       const timeoutId = setTimeout(() => {
//          setCurrentCharIndex(currentCharIndex + 1)
//       }, 120)

//       return () => {
//          clearTimeout(timeoutId)
//       }
//    }, [currentCharIndex])

//    const charsToShow = greeting.slice(0, currentCharIndex)

//    return (
//       <div>
//          <h5>{charsToShow}</h5>
//          <h3>{title}</h3>
//       </div>
//    )
// }

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function computeGreeting(name, timeNow) {
   if (timeNow >= 5 && timeNow < 12) {
      return `Good Morning ${name}! Why aren't you at school?`
   } else if (timeNow >= 12 && timeNow < 18) {
      return `Good Afternoon ${name}! Have you had your lunch?`
   } else {
      return `Hey ${name}! Children must not stay up too late!`
   }
}

export default function Greeting({ title }) {
   const { user = {} } = useSelector((state) => state.users)
   const { activeKid } = useSelector((state) => state.activeKid)
   const timeNow = new Date().getHours()

   const name = activeKid?.name || user?.name || 'Stranger'
   const greeting = computeGreeting(name, timeNow)

   const [currentCharIndex, setCurrentCharIndex] = useState(0)

   useEffect(() => {
      const timeoutId = setTimeout(() => {
         setCurrentCharIndex(currentCharIndex + 1)
      }, 120)

      return () => {
         clearTimeout(timeoutId)
      }
   }, [currentCharIndex])

   const charsToShow = greeting.slice(0, currentCharIndex)

   return (
      <div>
         <span className='greeting'>{charsToShow}</span>
         <h2>{title}</h2>
      </div>
   )
}
