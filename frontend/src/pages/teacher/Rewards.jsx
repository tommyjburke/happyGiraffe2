import React from 'react'
import './MathStyles.css'
import { useState } from 'react'

export default function Rewards() {
   const [rewards, setRewards] = useState([])

   const generateReward = () => {
      const randomNum = Math.floor(Math.random() * 54) + 1
      const newReward = require(`./mygifs/${randomNum}.gif`)
      setRewards((prevRewards) => [...prevRewards, newReward])
   }

   return (
      <div className='pokemons'>
         {rewards.map((reward, index) => (
            <img
               className='pokemons2'
               key={index}
               src={reward}
               height='45px'
               alt={`Pokemon ${index}`}
            />
         ))}
      </div>
   )
}
