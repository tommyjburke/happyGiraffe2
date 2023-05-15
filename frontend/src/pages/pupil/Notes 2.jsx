import React from 'react'

function Notes({
   setShowNotes,
   setShowQuiz,
   useCountdown,
   countdownSeconds,
   notes,
   numQuestions,
   title,
}) {
   //    console.log('notes', notes)
   //    console.log('numQuestions', numQuestions)
   //    console.log('useCountdown', useCountdown)
   //    console.log('countdownSeconds', countdownSeconds)

   return (
      <div className='notes1'>
         {/* <h1>{title}</h1> */}
         No. of Questions: <span className='notes2'>{numQuestions}</span> <br />
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
