import { useEffect, useState } from 'react'
import useSound from 'use-sound'
import click from './click.mp3'

function Countdown({ duration, onTimeUp }) {
   const [secondsLeft, setSecondsLeft] = useState(duration)
   const [intervalId, setIntervalId] = useState(null)

   const [playClick] = useSound(click)

   const startTimer = () => {
      playClick()
      const intervalId = setInterval(() => {
         setSecondsLeft((prevSeconds) => {
            const newSeconds = prevSeconds - 1
            if (newSeconds <= 0) {
               clearInterval(intervalId)
               onTimeUp()
            }
            return newSeconds
         })
      }, 1000)
      setIntervalId(intervalId)
   }

   useEffect(() => {
      startTimer()
      return () => clearInterval(intervalId)
   }, [])

   return (
      <div>
         {secondsLeft > 0 && (
            <p>
               Time Left: {Math.floor(secondsLeft / 60)}:{secondsLeft % 60}
            </p>
         )}
      </div>
   )
}

export default Countdown
