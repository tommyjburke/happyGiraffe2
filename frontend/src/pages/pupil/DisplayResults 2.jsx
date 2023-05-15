import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function DisplayResults({
   right,
   wrong,
   numQuestions,
   currentUser,
   finalScore,
}) {
   const navigate = useNavigate()

   return (
      <div className='card3 brownBackground yellowFont'>
         {/* <h1 style={result.timeUpStyle} className='text-2xl'>
                           {result.isOutOfTime}
                        </h1> */}
         <h1 className='text-2xl underline'>{currentUser}'s Result</h1>

         <div className='marks'>
            <h1 className='text-xl'>Number of Questions : {numQuestions}</h1>
            <h1 className='text-xl'>
               Right: {right} Wrong: {wrong}
            </h1>
            Unanswered: {numQuestions - right - wrong}
            <h1 className='text-xl'>SCORE: {finalScore}%</h1>
            <div className='flex gap-3 alignCenter'>
               <button
                  className='tomButton !important'
                  onClick={() => {
                     navigate('/')
                  }}
               >
                  View ALL Results
               </button>
            </div>
         </div>
      </div>
   )
}
