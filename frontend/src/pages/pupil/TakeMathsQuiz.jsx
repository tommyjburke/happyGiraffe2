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
import Notes from './Notes'
import DisplayResults from './DisplayResults'
import Rewards from './Rewards'
import ScoreBoard from './ScoreBoard'

export default function TakeMathsQuiz({ quizId, onClose, assignmentId }) {
   const { user } = useSelector((state) => state.users)
   const { activeKid } = useSelector((state) => state.activeKid)
   const [mathsQuizData, setMathsQuizData] = useState({})
   const [divsData, setDivsData] = useState({})
   const [gameOptions, setGameOptions] = useState({})
   const [timeUp, setTimeUp] = useState(false)
   const [right, setRight] = useState(0)
   const [wrong, setWrong] = useState(0)
   const [answeredQuestions, setAnsweredQuestions] = useState(0)
   const [showNotes, setShowNotes] = useState(false)
   const [notes, setNotes] = useState('')
   const [showQuiz, setShowQuiz] = useState(false)
   const [numQuestions, setNumQuestions] = useState(0)
   const [title, setTitle] = useState('')
   const [currentUser, setCurrentUser] = useState()
   const [formattedOps, setFormattedOps] = useState([])
   const [useCountdown, setUseCountdown] = useState(false)
   const [showCountdown, setShowCountdown] = useState(false)
   const [countdownSeconds, setCountdownSeconds] = useState(0)
   const [showResults, setShowResults] = useState(false)
   const [disableInputs, setDisableInputs] = useState(false)
   const [isGreyQuestion, setIsGreyQuestion] = useState('')
   const [finalScore, setFinalScore] = useState(0)
   const [rewards, setRewards] = useState([])
   const [playCorrectSound] = useSound(correctSound)
   const [playWrongSound] = useSound(incorrectSound)
   const [currentPercentage, setCurrentPercentage] = useState(0)
   const [updateState, setUpdateState] = useState(false)

   const navigate = useNavigate()
   const dispatch = useDispatch()

   const opts = ['x', '/', '+', '-']

   console.log('Active kid: ' + activeKid)

   const pupilId = activeKid?.pupilId
   const pupilName = activeKid?.name
   console.log('Pupil id: ' + pupilId)
   //

   // function generateReward() {
   //    const randomNum = Math.floor(Math.random() * 54) + 1
   //    const newReward = require(`../../_media/mygifs/${randomNum}.gif`)
   //    setRewards((prevRewards) => [...prevRewards, newReward])
   // }
   const isMountedRef = useRef(false)
   const rewardsRef = useRef(null)
   function getReward() {
      rewardsRef.current.generateReward()
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
            setCurrentUser(activeKid?.name || user.name || 'USER UNKNOWN')
            setUseCountdown(gameOptions.useCountdown)
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
         // generateReward()
         getReward()
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

   useEffect(() => {
      // Calculate the percentage of right answers when game completed
      const soFar = right + wrong
      const finalPercentage = Math.round((right / numQuestions) * 100)
      const currentPercentage = Math.round((right / soFar) * 100)

      // Update the percentage state variable
      setFinalScore(finalPercentage)
      setCurrentPercentage(currentPercentage)
   }, [right, wrong])

   const handleTimeUp = () => {
      setTimeUp(true)
      displayResults()
      setDisableInputs(true)
   }

   const displayResults = async () => {
      setUpdateState(true)
      setIsGreyQuestion('greyQuestion !important')
      setShowCountdown(false)
      setIsGreyQuestion('greyQuestion !important')
      setShowResults(true)
   }

   const submitResults = async () => {
      const percent = Math.round((parseInt(right) / parseInt(numQuestions)) * 100)
      setFinalScore(percent)
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

      console.log('~~~~~~PREPARING TO SAVE~~~~~~~')
      console.log('activeKid._id: ' + activeKid._id)
      console.log('Assignment ID: ' + assignmentId)

      if (!activeKid) {
         message.info('YOU MUST BE A PUPIL IF U WANNA SAVE RESULTS!')
         return
      }

      try {
         dispatch(ShowLoading())
         let response = await addMathsResult({
            assignmentId,
            pupilId,
            pupilName,
            mathsQuiz: quizId,
            user: user._id,
            divsData,
            stats: resultStats,
         })
         if (response.success) {
            message.success(response.message)
            console.log('* MATHS RESULT SAVED TO DB: SUCCESS *')
            console.log(response.data)
         } else {
            message.error(response.message)
            console.log(response.message)
         }
         dispatch(HideLoading())
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
         console.log(error)
      }
   }

   useEffect(() => {
      if (showResults) {
         submitResults()
      }
   }, [showResults])

   function renderDivs() {
      return divsData.map((divData, index) => {
         const userInput = (
            <input
               disabled={divData.inputDisabled || disableInputs}
               className='boxInput'
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
                     className='boxInput'
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
         footer={null}
         // onOk={generateDivs}
         onCancel={onClose}
         width={700}
         style={{
            top: 20,
         }}
      >
         {/* <RandomGif />
         <img src={one} alt='one' /> */}
         <span style={{ fontFamily: 'Short Stack' }}>{currentUser}</span>
         <h2 style={{ fontFamily: 'schoolbell' }}>
            <u>{title}</u>
         </h2>
         {/* <h3>Assignment: {assignmentId}</h3> */}

         {showNotes && (
            <Notes
               title={title}
               notes={notes}
               setShowNotes={setShowNotes}
               setShowQuiz={setShowQuiz}
               numQuestions={numQuestions}
               useCountdown={useCountdown}
               countdownSeconds={countdownSeconds}
               currentUser={currentUser}
               formattedOps={formattedOps}
            />
         )}
         {showQuiz && (
            <>
               <Rewards rewards={rewards} ref={rewardsRef} />
               {showScoreboard && (
                  <>
                     <ScoreBoard
                        currentPercentage={currentPercentage}
                        right={right}
                        wrong={wrong}
                        finalScore={finalScore}
                     />
                  </>
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
               <DisplayResults
                  right={right}
                  wrong={wrong}
                  numQuestions={numQuestions}
                  currentUser={currentUser}
                  finalScore={finalScore}
                  timeUp={timeUp}
                  onCancel={onClose}
               />
            </>
         )}
      </Modal>
   )
}
