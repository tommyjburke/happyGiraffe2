import { useState } from 'react'
import useSound from 'use-sound'
import click from './click.mp3'

const Countdown = ({ multiData }) => {
   const [secondsLeft, setSecondsLeft] = useState(multiData.duration)
   const [timeUp, setTimeUp] = useState(false)
   const [intervalId, setIntervalId] = useState(null)

   const [playClick] = useSound(click)

   const startTimer = () => {
      //
      playClick()
      let totalSeconds = multiData.duration
      //
      const intervalId = setInterval(() => {
         if (totalSeconds > 0) {
            totalSeconds = totalSeconds - 1
            setSecondsLeft(totalSeconds)
            // playClick()
            console.log('SecondsLeft: ' + secondsLeft)
         } else {
            clearInterval(intervalId)

            setTimeUp(true)
         }
      }, 1000)
      setIntervalId(intervalId)
   }

   return (
      <div className='countdown-modal'>
         {timeUp ? <div>Time's up!</div> : <div>{secondsLeft} seconds left</div>}
         <button onClick={startTimer}>Start timer</button>
      </div>
   )
}

export default Countdown
