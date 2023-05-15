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

   return (
      <div className='card' style={{ marginBottom: '30px', fontFamily: 'caveat brush' }}>
         {/* <h3 style={result.timeUpStyle} className='text-2xl'>
                           {result.isOutOfTime}
                        </h3> */}
         <h2 style={{ color: 'brown', fontFamily: 'Caveat Brush' }}>
            {currentUser}'s Result
         </h2>

         <div style={{ fontFamily: 'gaegu', color: 'brown' }}>
            <h3>Total Questions : {numQuestions}</h3>
            <h3>
               Right: {right} Wrong: {wrong}
            </h3>
            Unanswered: {numQuestions - right - wrong}
            <h1 className=' redFont'>SCORE: {finalScore}%</h1>
            <img src={resultsGiraffe} alt='giraffe' className='giraffe' />
         </div>

         <Button className='tomButton !important' onClick={finishButton}>
            Finish
         </Button>
      </div>
   )
}
