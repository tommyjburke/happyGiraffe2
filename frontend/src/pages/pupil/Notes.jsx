import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

function Notes({
   setShowCountdown,
   setShowNotes,
   setShowQuiz,
   useCountdown,
   countdownSeconds,
   notes,
   numQuestions,
   formattedOps,
   currentUser,
   title,
}) {
   const dispatch = useDispatch()
   const { activeKid } = useSelector((state) => state.activeKid)

   // console.log('notes', notes)
   // console.log('numQuestions', numQuestions)
   // console.log('useCountdown', useCountdown)
   // console.log('countdownSeconds', countdownSeconds)
   // console.log('title', title)
   // console.log('currentUser Notes', currentUser)
   // console.log('quizId', quizId)

   return (
      <div className='  notes1'>
         {/* USE COUNTDOWN: {JSON.stringify(useCountdown)} <br /> */}
         {activeKid && <h2 className='greenFont'>Get Ready, {activeKid?.name}!</h2>}
         {/* <h1>{title}</h1> */}
         {/* <div className='notes'>USER: {currentUser}</div> */}
         No. of Questions: <span className='notes2'>{numQuestions}</span> <br />
         {formattedOps && (
            <>
               Math skills: <span className='notes2'>[{formattedOps.join(' , ')}]</span>
               <br />
            </>
         )}
         {formattedOps && formattedOps.includes('/') && (
            <>
               <span className='greenFont'>
                  <u>Division</u> answers will be rounded to whole numbers.
                  <br />
                  Example: 8 / 3 = 2.
               </span>
               <br />
            </>
         )}
         {!useCountdown && (
            <>
               Timer: <span className='notes2'> No </span>
            </>
         )}
         {useCountdown && (
            <>
               Timer: <span className='notes2'> {countdownSeconds} seconds </span>
            </>
         )}
         <br />
         {notes && notes.length > 0 && (
            <>
               <u>Notes:</u>
               <div
                  className='borderedNotes notes2'
                  dangerouslySetInnerHTML={{ __html: notes }}
               />
            </>
         )}
         <div className='rightButtonContainer'>
            <button
               onClick={() => {
                  setShowNotes(false)
                  setShowQuiz(true)
                  // if (useCountdown) {
                  //    setShowCountdown(true)
                  // }
                  console.log('SHOW COUNTDOWN', JSON.stringify(setShowCountdown))
               }}
               className='start flash2'
            >
               GO!
            </button>
         </div>
      </div>
   )
}

export default Notes
