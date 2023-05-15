// Game Options Component
import React from 'react'

const GameOptions = ({ gameOptions, setGameOptions, startGame }) => {
   const handleInputChange = (event) => {
      const { name, value } = event.target
      setGameOptions({ ...gameOptions, [name]: value })
   }

   const handleCheckboxChange = (event) => {
      const { value, checked } = event.target
      let oVals = [...gameOptions.oVals]
      if (checked) {
         oVals.push(Number(value))
      } else {
         oVals = oVals.filter((val) => val !== Number(value))
      }
      setGameOptions({ ...gameOptions, oVals })
   }

   return (
      <div className='gameOptions'>
         <label htmlFor='name'>Name:</label>
         <input
            type='text'
            id='name'
            name='name'
            value={gameOptions.name}
            onChange={handleInputChange}
         />
         <br />
         <label htmlFor='minValA'>Min Value A:</label>
         <input
            type='number'
            id='minValA'
            name='minValueAAlgebraGame.jsx'
            value={gameOptions.minValA}
            onChange={handleInputChange}
         />
         <br />
         <label htmlFor='maxValA'>Max Value A:</label>
         <input
            type='number'
            id='maxValA'
            name='maxValA'
            value={gameOptions.maxValA}
            onChange={handleInputChange}
         />
         <br />
         <label htmlFor='minValB'>Min Value B:</label>
         <input
            type='number'
            id='minValB'
            name='minValB'
            value={gameOptions.minValB}
            onChange={handleInputChange}
         />
         <br />
         <label htmlFor='maxValB'>Max Value B:</label>
         <input
            type='number'
            id='maxValB'
            name='maxValB'
            value={gameOptions.maxValB}
            onChange={handleInputChange}
         />
         <br />
         <label htmlFor='numQuestions'>Number of Questions:</label>
         <input
            type='number'
            id='numQuestions'
            name='numQuestions'
            value={gameOptions.numQuestions}
            onChange={handleInputChange}
         />
         <br />
         <label htmlFor='hiddenAnswer'>Hidden Answer:</label>
         <input
            type='text'
            id='hiddenAnswer'
            name='hiddenAnswer'
            value={gameOptions.hiddenAnswer}
            onChange={handleInputChange}
         />
         <br />
         <label htmlFor='oVals'>Operators:</label>
         <input
            type='checkbox'
            id='oVals'
            name='oVals'
            value='0'
            checked={gameOptions.oVals.includes(0)}
            onChange={handleCheckboxChange}
         />
         +
         <input
            type='checkbox'
            id='oVals'
            name='oVals'
            value='1'
            checked={gameOptions.oVals.includes(1)}
            onChange={handleCheckboxChange}
         />
         -
         <input
            type='checkbox'
            id='oVals'
            name='oVals'
            value='2'
            checked={gameOptions.oVals.includes(2)}
            onChange={handleCheckboxChange}
         />
         *
         <input
            type='checkbox'
            id='oVals'
            name='oVals'
            value='3'
            checked={gameOptions.oVals.includes(3)}
            onChange={handleCheckboxChange}
         />
         /
         <br />
         <button onClick={startGame}>Start Game</button>
      </div>
   )
}

export default GameOptions
