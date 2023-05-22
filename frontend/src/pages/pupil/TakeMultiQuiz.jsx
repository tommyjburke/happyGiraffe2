// import { useParams } from 'react-router-dom'
import { HideLoading, ShowLoading } from '../../redux/loaderSlice'
import { message, Modal, Button } from 'antd'
import { getMultiById } from '../../_apiCalls/apiMultis'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState, useRef, useImperativeHandle } from 'react'

import useSound from 'use-sound'
import click from './click.mp3'
import ding from './ding.mp3'
import { addMultiResult } from '../../_apiCalls/apiMultiResults'
import CountdownTimer from '../teacher/CountdownTimer'
import ScoreBoard from './ScoreBoard'

import correctSound from '../../_media/correct.mp3'
import incorrectSound from '../../_media/wrong.mp3'
import buttonPress from '../../_media/buttonPress.mp3'
import Rewards from '../pupil/Rewards'
import Notes from '../pupil/Notes'
import DisplayResults from './DisplayResults'

export default function TakeMultiQuiz({ quizId, onClose, assignmentId }) {
   console.log(`*********************ASSI ID** ', ${assignmentId}`)
   const [multiData, setMultiData] = useState([])

   const [view, setView] = useState('instructions')
   const [questions, setQuestions] = useState([])
   const [selectedQuestion, setSelectedQuestion] = useState(0)
   const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0)
   const [selectedOptions, setSelectedOptions] = useState({})
   const [result, setResult] = useState({})
   const [choice, setChoice] = useState('')

   const [secondsLeft = 0, setSecondsLeft] = useState(0)
   const [timeUp, setTimeUp] = useState(false)
   const [intervalId, setIntervalId] = useState(null)

   const [showCountdown, setShowCountdown] = useState(false)
   const [percentage, setPercentage] = useState(0)
   const [currentPercentage, setCurrentPercentage] = useState(0)
   //

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
   const [useCountdown, setUseCountdown] = useState(false)
   const [currentUser, setCurrentUser] = useState()
   const [rightCount, setRightCount] = useState(0)
   const [wrongCount, setWrongCount] = useState(0)

   const [showResults, setShowResults] = useState(false)

   const [finalScore, setFinalScore] = useState(0)
   const [rewards, setRewards] = useState([])
   const dispatch = useDispatch()
   const params = useParams()
   const { user } = useSelector((state) => state.users)

   const { activeKid } = useSelector((state) => state.activeKid)
   const navigate = useNavigate()
   const [playClick] = useSound(click)
   const [playDing] = useSound(ding)
   const [playButtonPress] = useSound(buttonPress)

   const rewardsRef = useRef(null)

   console.log('TakeMUlti CurrentUser: ', currentUser)
   const pupilId = activeKid?.pupilId
   const pupilName = activeKid?.name

   function getReward() {
      rewardsRef.current.generateReward()
   }

   // clickButton function
   function clickButton(option) {
      playButtonPress()

      setSelectedOptions({
         ...selectedOptions,
         [selectedQuestionIndex]: option,
      })
      setChoice(option)
   }

   const showScoreboard = right > 0 || wrong > 0 ? true : false

   const getMultiData = async () => {
      try {
         dispatch(ShowLoading())
         const response = await getMultiById({
            multiId: quizId,
         })
         dispatch(HideLoading())
         if (response.success) {
            // console.log(response.data)
            setMultiData(response.data)
            setQuestions(response.data.questions)
            setSecondsLeft(response.data.countdownSeconds)
            setShowCountdown(response.data.useCountdown)
         } else {
            message.error(response.message)
         }
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   function checkAnswer(userChose, correctAnswer) {
      if (userChose === correctAnswer) {
         setRight(right + 1)
         playCorrectSound()
         getReward()
      } else {
         setWrong(wrong + 1)
         playWrongSound()
      }
      setAnsweredQuestions(answeredQuestions + 1)

      if (answeredQuestions === numQuestions - 1) {
         setShowCountdown(false)
         displayResults()
      } else {
         setSelectedQuestionIndex((prevIndex) => prevIndex + 1)
      }

      setSelectedOptions((prevOptions) => ({
         ...prevOptions,
         [selectedQuestionIndex]: userChose,
      }))
   }

   const handleTimeUp = () => {
      setTimeUp(true)
      displayResults()
   }

   const displayResults = async () => {
      setShowQuiz(false)
      setShowCountdown(false)

      // console.log('RESULT STATS: ', resultStats)

      setShowResults(true)
      // calculateResult()
      dummy()
   }

   function dummy() {
      console.log('DUMMY STATE')
   }

   useEffect(() => {
      if (showResults) {
         calculateResult()
      }
   }, [showResults])

   const calculateResult = async () => {
      const resultStats = {
         title: title,
         numQuestions: parseInt(numQuestions),
         score: parseInt(finalScore),
         right: parseInt(right),
         wrong: parseInt(wrong),
         unanswered: parseInt(numQuestions - right - wrong),
         timeRanOut: timeUp,
         rightCount: parseInt(rightCount),
         wrongCount: parseInt(wrongCount),
      }
      console.log('CALCULATING RESULT')
      // playDing()
      try {
         let correctAnswers = []
         let wrongAnswers = []

         questions.forEach((question, index) => {
            //    if (question.correctOption === selectedOptions[index]) {
            //       correctAnswers.push(question, { userChose: choice })
            //    } else {
            //       wrongAnswers.push(question, { userChose: choice })
            //    }
            // })
            const userChose = selectedOptions[index]
            if (question.correctOption === userChose) {
               correctAnswers.push({ ...question, userChose })
            } else {
               wrongAnswers.push({ ...question, userChose })
            }
         })

         let isOutOfTime = ''
         let timeUpStyle = {}
         if (timeUp) {
            isOutOfTime = 'Your time ran out!'
            timeUpStyle = {
               color: 'red',
            }
         } else {
            isOutOfTime = `You beat the timer! `
            timeUpStyle = {
               color: 'green',
            }
         }

         const tempResult = {
            // timeUpStyle,
            correctAnswers,
            wrongAnswers,
            finalScore,
            // wrongChoice,
            // choice,
         }

         setResult(tempResult)

         if (!activeKid) {
            message.info('YOU MUST BE A PUPIL IF U WANNA SAVE RESULTS!')
            return
         }

         dispatch(ShowLoading())

         const response = await addMultiResult({
            pupilId,
            pupilName,
            assignmentId,
            quizId,
            multiId: quizId,
            user: user._id,
            result: tempResult,
            stats: resultStats,
         })
         if (response.success) {
            message.success(response.message)
            console.log('* MULTI RESULT SAVED TO DB: SUCCESS *')
            console.log(response.data)
         } else {
            message.error(response.message)
            console.log('* MULTI RESULT SAVED TO DB: FAILED *')
            console.log(response.message)
            console.log(response)
         }
         dispatch(HideLoading())
         // setView('result')
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
         console.log(error.message)
      }
   }

   function callBack() {
      calculateResult()
   }

   useEffect(() => {
      if (timeUp) {
         clearInterval(intervalId)
         calculateResult()
         // setView('result')
      }
   }, [timeUp])

   useEffect(() => {
      getMultiData()

      // eslint-disable-next-line
   }, [quizId])

   useEffect(() => {
      // Calculate the percentage of right answers when the game is completed
      const soFar = right + wrong
      const finalPercentage = Math.round((right / numQuestions) * 100)
      const currentPercentage = Math.round((right / soFar) * 100)

      setRightCount(right)
      setWrongCount(wrong)

      // Update the percentage state variable
      setFinalScore(finalPercentage)
      setCurrentPercentage(currentPercentage)
   }, [right, wrong, checkAnswer])

   useEffect(() => {
      setRightCount(right)
      setWrongCount(wrong)
   }, [right, wrong])

   useEffect(() => {
      if (multiData) {
         setTitle(multiData.title)
         setNotes(multiData.notes)
         setCountdownSeconds(multiData.countdownSeconds)
         setUseCountdown(multiData.useCountdown)

         setShowNotes(true)
         setNumQuestions(parseInt(multiData.questions?.length || 0))
         setCurrentUser(activeKid?.name || user.name || 'USER UNKNOWN')
      }
   }, [multiData])

   console.log('Stringed user: ' + currentUser)

   return (
      multiData && (
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
            <div>
               <span style={{ fontFamily: 'Short Stack' }}>{currentUser}</span>

               {/* <h3 className='text-center'>{multiData.question}</h3> */}
               <h2 style={{ fontFamily: 'schoolbell' }}>
                  <u>{title}</u>
               </h2>
               {/* <p>{JSON.stringify(multiData)}</p> */}

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
                  />
               )}
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
               {showQuiz && (
                  <>
                     {' '}
                     {showCountdown && (
                        <>
                           <CountdownTimer
                              duration={countdownSeconds}
                              onTimeUp={handleTimeUp}
                           />
                        </>
                     )}
                     <div className='flex flex-col items-center gap-2'>
                        <div className='flex justify-between'>
                           <h3>
                              {selectedQuestionIndex + 1} :{' '}
                              {questions[selectedQuestionIndex].question}
                           </h3>
                        </div>

                        <div className='flex flex-col gap-2'>
                           {Object.keys(questions[selectedQuestionIndex].options).map(
                              (option, index) => {
                                 return (
                                    <button
                                       className={`flex gap-2 flex-col ${
                                          selectedOptions[selectedQuestionIndex] ===
                                          option
                                             ? 'selected-option'
                                             : 'option'
                                       }`}
                                       key={index}
                                       onClick={() => clickButton(option)}
                                    >
                                       <h3>
                                          {option} :{' '}
                                          {
                                             questions[selectedQuestionIndex].options[
                                                option
                                             ]
                                          }
                                       </h3>
                                    </button>
                                 )
                              }
                           )}
                        </div>

                        <div className='flex gap-2'>
                           {selectedQuestionIndex < questions.length - 1 && (
                              <Button
                                 className='brownButton2'
                                 onClick={() => {
                                    checkAnswer(
                                       choice,
                                       questions[selectedQuestionIndex].correctOption
                                    )
                                 }}
                              >
                                 Next
                              </Button>
                           )}
                           {/* FINISH */}
                           {selectedQuestionIndex === questions.length - 1 && (
                              <Button
                                 className='brownButton2'
                                 onClick={() => {
                                    checkAnswer(
                                       choice,
                                       questions[selectedQuestionIndex].correctOption
                                    )
                                 }}
                              >
                                 FINISH
                              </Button>
                           )}
                        </div>
                     </div>
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

               {view === 'result' && (
                  <div className='card3 brownBackground yellowFont'>
                     <h1 style={result.timeUpStyle} className='text-2xl'>
                        {result.isOutOfTime}
                     </h1>
                     <h1 className='text-2xl underline'>{activeKid.name}'s Result</h1>

                     <div className='marks'>
                        <h1 className='text-xl'>
                           Correct Answers: {result.correctAnswers.length}
                        </h1>

                        <h1 className='text-xl'>
                           Wrong Answers: {result.wrongAnswers.length}
                        </h1>
                        <h1 className='text-xl'>
                           {/* {multiData.totalMarks > multiData.passingMarks ? 'PASS' : 'FAIL'} */}
                           SCORE: {result.score}%
                        </h1>
                        <div className='flex gap-3'>
                           <button
                              className='brownButton2'
                              // onClick={() => {
                              //    navigate('/pupil/multiResults')
                              // }}
                           >
                              View Results
                           </button>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </Modal>
      )
   )
}
