import { useState, forwardRef, useImperativeHandle } from 'react'

const Rewards = forwardRef((props, ref) => {
   const [rewards, setRewards] = useState([])

   function generateReward() {
      const randomNum = Math.floor(Math.random() * 54) + 1
      const newReward = require(`../../_media/mygifs/${randomNum}.gif`)
      setRewards((prevRewards) => [...prevRewards, newReward])
   }

   useImperativeHandle(ref, () => ({
      generateReward,
   }))

   return (
      <div className='pokemons2'>
         {rewards.map((reward, index2) => (
            <img
               className='pokemons2'
               key={index2}
               src={reward}
               height='45px'
               alt={`Pokemon ${index2}`}
            />
         ))}
      </div>
   )
})

export default Rewards

// import { useState, forwardRef, useImperativeHandle } from 'react'

// const Rewards = forwardRef((props, ref) => {
//   const [rewards, setRewards] = useState([])

//   function generateReward() {
//     const randomNum = Math.floor(Math.random() * 54) + 1
//     const newReward = require(`../../_media/mygifs/${randomNum}.gif`)
//     setRewards((prevRewards) => [...prevRewards, newReward])
//   }

//   useImperativeHandle(ref, () => ({
//     generateReward
//   }));

//   return (
//     <div className='pokemons'>
//       {rewards.map((reward, index2) => (
//         <img
//           className='pokemons2'
//           key={index2}
//           src={reward}
//           height='45px'
//           alt={`Pokemon ${index2}`}
//         />
//       ))}
//     </div>
//   )
// })
