// Main Game Component
import React, { useState } from 'react'
import GameOptions from './GameOptions'
import GameBoard from './GameBoard'

const Game = () => {
   // State for game options
   const [gameOptions, setGameOptions] = useState({
      name: '',
      minValueA: 0,
      maxValueA: 10,
      minValueB: 0,
      maxValueB: 10,
      questions: 10,
      oVals: [0, 1, 2, 3],
      hiddenVal: 3,
   })

   // State for player scores
   const [player, setPlayer] = useState({
      correct: 0,
      incorrect: 0,
      score: [],
      playerName: 'HappyGiraffeMathsQuiz',
   })

   // Function to start new game
   const startGame = () => {
      // Reset player data
      setPlayer({ ...player, score: [], correct: 0, incorrect: 0 })

      // Hide game options and show game board
      setShowGameOptions(false)
      setShowGameBoard(true)
   }

   // State for show/hide game options
   const [showGameOptions, setShowGameOptions] = useState(true)

   // State for show/hide game board
   const [showGameBoard, setShowGameBoard] = useState(false)

   return (
      <div className='game'>
         {/* Game Options */}
         {showGameOptions && (
            <GameOptions
               gameOptions={gameOptions}
               setGameOptions={setGameOptions}
               startGame={startGame}
            />
         )}

         {/* Game Board */}
         {showGameBoard && (
            <GameBoard
               gameOptions={gameOptions}
               player={player}
               setPlayer={setPlayer}
               setShowGameBoard={setShowGameBoard}
            />
         )}
      </div>
   )
}

export default Game
