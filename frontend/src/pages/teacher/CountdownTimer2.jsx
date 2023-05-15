import React, { useState, useEffect } from 'react'
import useSound from 'use-sound'
import click from './click.mp3'
import ding from './ding.mp3'

function CountdownTimer({ duration, onTimeUp }) {
   const [playClick] = useSound(click)
   const [playDing] = useSound(ding)
   const [timeRemaining, setTimeRemaining] = useState(duration)
   const [timeUp, setTimeUp] = useState(false)
   const [intervalId, setIntervalId] = useState(null)
   const [secondsLeft = 0, setSecondsLeft] = useState(0)
   let timerId // Define timerId variable here

   useEffect(() => {
      playClick()
      let intervalId = null
      if (timeRemaining > 0) {
         intervalId = setInterval(() => {
            setTimeRemaining((prevTimeRemaining) => prevTimeRemaining - 1)
            // playClick()
         }, 1000)
      } else {
         onTimeUp()
         playDing()
         clearInterval(intervalId)
      }
      return () => clearInterval(intervalId)
   }, [timeRemaining, onTimeUp, playClick, playDing])

   useEffect(() => {
      if (timeRemaining === 0) {
         onTimeUp()
         clearInterval(timerId) // Clear interval on time up
         playDing() // Play ding sound on time up
      }
   }, [timeRemaining, onTimeUp, playDing, timerId])

   useEffect(() => {
      const intervalId = setInterval(() => {
         const countdownElement = document.querySelector('.countdown-timer2')
         countdownElement.classList.add('flashing')
         setTimeout(() => {
            countdownElement.classList.remove('flashing')
         }, 200)
      }, 1000)

      return () => clearInterval(intervalId)
   }, [])

   return (
      <div className='countdown-timer2'>
         {/* <div className='countdown-timer2'> */}
         {timeRemaining === 0 ? (
            <div>Time's up!</div>
         ) : (
            <div className={timeRemaining % 2 === 0 ? 'countdown-flashing' : ''}>
               Count
               <br />
               Down:
               <br /> <span style={{ fontSize: 30 }}>{timeRemaining}</span>
            </div>
         )}
      </div>
   )
}

export default CountdownTimer
