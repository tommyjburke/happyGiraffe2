import { Modal, message } from 'antd'
import React, { useEffect, useLayoutEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getMathsById } from '../../_apiCalls/apiMaths'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css' // import the styles
import CountdownTimer from '../teacher/CountdownTimer'
import correctSound from '../../_media/correct.mp3'
import incorrectSound from '../../_media/wrong.mp3'

import { addMathsResult } from '../../_apiCalls/apiMathsResults'
import { HideLoading, ShowLoading } from '../../redux/loaderSlice'
import useSound from 'use-sound'

export default function TakeMathsQuiz({ quizId, onClose }) {
   const { user } = useSelector((state) => state.users)
   const [mathsQuizData, setMathsQuizData] = useState({})

   const [divsData, setDivsData] = useState({})
   const [gameOptions, setGameOptions] = useState({})

   const [showCountdown, setShowCountdown] = useState(false)
   const [timeUp, setTimeUp] = useState(false)
   const [right, setRight] = useState(0)
   const [wrong, setWrong] = useState(0)
   const [answeredQuestions, setAnsweredQuestions] = useState(0)
   const [showNotes, setShowNotes] = useState(false)
   const [notes, setNotes] = useState('')
   const [playCorrectSound] = useSound(correctSound)
   const [playWrongSound] = useSound(incorrectSound)
   const [showQuiz, setShowQuiz] = useState(false)
   const [numQuestions, setNumQuestions] = useState(0)
   const [title, setTitle] = useState('')
   const [countdownSeconds, setCountdownSeconds] = useState(0)
   const [formattedOps, setFormattedOps] = useState([])
   const [useCountdown, setUseCountdown] = useState(false)
   const opts = ['x', '/', '+', '-']
   const [showResults, setShowResults] = useState(false)
   const [disableInputs, setDisableInputs] = useState(false)
   const [isGreyQuestion, setIsGreyQuestion] = useState('')
   const [finalScore, setFinalScore] = useState(0)
   const [rewards, setRewards] = useState([])

   const navigate = useNavigate()
   const dispatch = useDispatch()

   //

   const isMountedRef = useRef(false)

   function generateReward() {
      const randomNum = Math.floor(Math.random() * 54) + 1
      const newReward = require(`../../_media/mygifs/${randomNum}.gif`)
      setRewards((prevRewards) => [...prevRewards, newReward])
   }

   //

   const getMathsDataById = async () => {
      try {
         const response = await getMathsById({
            id: quizId,
         })
         if (response.success) {
            console.log('Quizid: ' + quizId)
            console.log(response.data)
            const { divsData, gameOptions } = response.data
            setMathsQuizData(response.data)
            setNumQuestions(gameOptions.numQuestions)
            setDivsData(divsData)
            setGameOptions(gameOptions)
            setShowNotes(true)
            setNotes(gameOptions.notes)
            setTitle(gameOptions.title)
            setFormattedOps(gameOptions.operators.map((op) => opts[op]))
            setShowCountdown(gameOptions.useCountdown)
            setCountdownSeconds(gameOptions.countdownSeconds)
         } else {
            message.error(response.message)
         }
      } catch (error) {
         message.error(error.message)
      }
   }

   useEffect(() => {
      isMountedRef.current = true

      console.log('getMathsDataById called')
      getMathsDataById()
      return () => {
         isMountedRef.current = false
      }
   }, [quizId])

   // const myJson = JSON.stringify(mathsQuizData)

   function handleInputChange(event, index) {
      const newDivsData = [...divsData]
      newDivsData[index].inputValue = event.target.value
      setDivsData(newDivsData)
   }

   function checkAnswer(index, hiddenPosition) {
      setAnsweredQuestions(answeredQuestions + 1)
      const newDivsData = [...divsData]

      if (
         newDivsData[index].inputValue ===
         String(newDivsData[index].spanValues[hiddenPosition])
      ) {
         setRight(right + 1)
         generateReward()
         playCorrectSound()
         newDivsData[index].buttonLabel = '✅ ' + newDivsData[index].inputValue
         newDivsData[index].buttonClass = 'correctBtn !important'
      } else {
         setWrong(wrong + 1)
         playWrongSound()

         newDivsData[index].buttonLabel = '❌ ' + newDivsData[index].inputValue
         newDivsData[index].buttonClass = 'incorrectBtn !important'
         newDivsData[index].showCorrectAnswer = (
            <span className='redText'>
               {newDivsData[index].spanValues[hiddenPosition]}
            </span>
         )
      }
      newDivsData[index].isDisabled = true
      newDivsData[index].inputDisabled = true
      newDivsData[index].questionClass = 'greyQuestion !important'

      setDivsData(newDivsData)

      if (answeredQuestions === numQuestions - 1) {
         console.log('right: ' + right)
         console.log('wrong: ' + wrong)
         console.log('numQuestions: ' + numQuestions)
         setShowCountdown(false)
         displayResults()
      }
   }

   const handleTimeUp = () => {
      setTimeUp(true)
      displayResults()
      setDisableInputs(true)
   }

   const displayResults = async () => {
      setIsGreyQuestion('greyQuestion !important')
      setShowCountdown(false)
      const percent = Math.round((parseInt(right) / parseInt(numQuestions)) * 100)
      setFinalScore(percent)
      // const message = `You got ${right} out of ${numQuestions} correct. Your score is ${percent}%`

      // const scoreObj = { percent }
      setIsGreyQuestion('greyQuestion !important')

      const resultStats = {
         title: title,
         numQuestions: parseInt(numQuestions),
         score: parseInt(percent),
         right: parseInt(right),
         wrong: parseInt(wrong),
         unanswered: parseInt(numQuestions - right - wrong),
         timeRanOut: timeUp,
      }
      console.log(resultStats)

      setShowResults(true)

      try {
         dispatch(ShowLoading())
         const response = await addMathsResult({
            type: 'maths',
            mathsQuiz: quizId,
            user: user._id,
            divsData,
            stats: resultStats,
         })
         dispatch(HideLoading())
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   // Modal.success({
   //    className: 'card modal-container',
   //    title: 'Results',
   //    content: (
   //       <div>
   //          <p>{message}</p>
   //          {/* <p >
   //             <button className='btn btn-primary' onClick={() => onClose}>
   //                Exit
   //             </button>
   //          </p> */}
   //       </div>
   //    ),
   // })

   function renderDivs() {
      return divsData.map((divData, index) => {
         const userInput = (
            <input
               disabled={divData.inputDisabled || disableInputs}
               className='boxAnswer'
               type='number'
               value={divData.inputValue}
               onChange={(event) => handleInputChange(event, index)}
               onKeyUp={(e) => {
                  if (e.code === 'Enter' || e.code === 'NumpadEnter') {
                     checkAnswer(index, hiddenPosition)
                  }
               }}
            />
         )

         const spanValues = [...divData.spanValues] // Create a copy of the original array
         let x = parseInt(spanValues[0])
         let y = parseInt(spanValues[1])
         let z = parseInt(spanValues[2])
         let operator = spanValues[3]
         let hiddenPosition = parseInt(spanValues[4])
         let correctAnswer = parseInt(spanValues[5])

         if (hiddenPosition === 0) {
            x = userInput
         } else if (hiddenPosition === 1) {
            y = userInput
         } else if (hiddenPosition === 2) {
            z = userInput
         }
         // console.log('x y z', x, y, z)

         return (
            <div
               key={index}
               className={
                  isGreyQuestion || divData.questionClass || 'question !important'
               }
            >
               <span className='indexNum'>{index + 1}</span>
               <span className=''>
                  {x} {operator} {y} = {z}
                  {/* <input
                     className='boxAnswer'
                     type='number'
                     value={divData.inputValue}
                     onChange={(event) => handleInputChange(event, index)}
                  /> */}
               </span>
               <button
                  className={divData.buttonClass || 'checkBtn !important'}
                  onClick={() => checkAnswer(index, hiddenPosition)}
                  disabled={disableInputs || divData.isDisabled}
               >
                  {divData.buttonLabel || 'CHECK'}
               </button>
               {divData.showCorrectAnswer}
            </div>
         )
      })
   }

   const showScoreboard = right > 0 || wrong > 0 ? true : false

   return (
      <Modal
         className='card modal-container'
         open={true}
         // footer={null}
         // onOk={generateDivs}
         onCancel={onClose}
         width={700}
      >
         {/* <RandomGif />
         <img src={one} alt='one' /> */}
         <h2 style={{ fontFamily: 'schoolbell' }}>
            <u>{title}</u>
         </h2>

         {showNotes && (
            <div className='notes1'>
               No. of Questions: <span className='notes2'>{numQuestions}</span> <br />
               Math skills: <span className='notes2'>[{formattedOps.join(' , ')}]</span>
               {!useCountdown && (
                  <>
                     Timer: <span className='notes2'> No </span>
                  </>
               )}
               {useCountdown && (
                  <>
                     <br />
                     Timer: <span className='notes2'>{countdownSeconds} seconds </span>
                  </>
               )}
               <br />
               {notes && notes.length > 0 && (
                  <>
                     <u>Notes:</u>
                     <div
                        className='borderedNotes notes2'
                        dangerouslySetInnerHTML={{ __html: notes }}
                     />
                  </>
               )}
               <div className='rightButtonContainer'>
                  <button
                     onClick={() => {
                        setShowNotes(false)
                        setShowQuiz(true)
                     }}
                     className='start flash2'
                  >
                     GO!
                  </button>
               </div>
            </div>
         )}
         {showQuiz && (
            <>
               <div className='pokemons'>
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

               {showScoreboard && (
                  <div>
                     ✅ <span className='scoreGreen'>{right}</span> :{' '}
                     <span className='scoreRed'>{wrong}</span>❌
                  </div>
               )}
               <div>{renderDivs()}</div>
               <div className='rightButtonContainer'></div>
               {showCountdown && (
                  <CountdownTimer duration={countdownSeconds} onTimeUp={handleTimeUp} />
               )}
            </>
         )}
         {showResults && (
            <>
               {/* {JSON.stringify(divsData)} */}
               <br />
               <>
                  <div className='card3 brownBackground yellowFont'>
                     {/* <h1 style={result.timeUpStyle} className='text-2xl'>
                           {result.isOutOfTime}
                        </h1> */}
                     <h1 className='text-2xl underline'>{user.name}'s Result</h1>

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
                                 navigate('/pupil/myresults')
                              }}
                           >
                              View ALL Results
                           </button>
                        </div>
                     </div>
                  </div>
               </>
            </>
         )}
      </Modal>
   )
}
