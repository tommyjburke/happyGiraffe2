import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import achievement from '../../_media/achievement.mp3'
import useSound from 'use-sound'
import resultsGiraffe from '../../_media/resultsGiraffe.gif'
import Rewards from './Rewards'
import { Button } from 'antd'
import { Navigate } from 'react-router-dom'

export default function DisplayResults({
   right,
   wrong,
   numQuestions,
   currentUser,
   finalScore,
   timeUp,
   onCancel,
}) {
   const navigate = useNavigate()

   const [playAchievement] = useSound(achievement)
   // const timerResult =

   const finishButton = () => {
      onCancel()
      navigate('/')
   }

   playAchievement()

   const scoreColour = () => {
      if (finalScore < 25) {
         return 'red'
      } else if (finalScore < 50) {
         return 'darkorange'
      } else if (finalScore < 75) {
         return 'yellow'
      } else {
         return 'green'
      }
   }

   return (
      <div className='card' style={{ marginBottom: '30px', fontFamily: 'caveat brush' }}>
         {/* <h3 style={result.timeUpStyle} className='text-2xl'>
                           {result.isOutOfTime}
                        </h3> */}
         <h2 style={{ color: 'brown', fontFamily: 'Caveat Brush' }}>
            {currentUser}'s Result
         </h2>

         <div style={{ fontFamily: 'gaegu', color: 'brown', lineHeight: '80%' }}>
            <h3>Total Questions : {numQuestions}</h3>
            <h3>
               Right: {right} Wrong: {wrong}
            </h3>
            Unanswered: {numQuestions - right - wrong}
            <br />
            <br />
            <h1 style={{ color: scoreColour() }}>SCORE: {finalScore}%</h1>
            <img src={resultsGiraffe} alt='giraffe' height='80px' className='giraffe' />
         </div>

         <Button className='tomButton !important' onClick={finishButton}>
            Finish
         </Button>
      </div>
   )
}
