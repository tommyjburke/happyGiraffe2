// import { useParams } from 'react-router-dom'
import { HideLoading, ShowLoading } from '../../redux/loaderSlice'
import { message } from 'antd'
import { getMultiById } from '../../_apiCalls/apiMultis'
import { addReport } from '../../_apiCalls/apiMultiResults'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState, useRef, useImperativeHandle } from 'react'
import Instructions from './Instructions'
import useSound from 'use-sound'
import click from './click.mp3'
import ding from './ding.mp3'
import { addMultiResult } from '../../_apiCalls/apiMultiResults'
import CountdownTimer from '../teacher/CountdownTimer'

import correctSound from '../../_media/correct.mp3'
import incorrectSound from '../../_media/wrong.mp3'
import buttonPress from '../../_media/buttonPress.mp3'
import Rewards from '../pupil/Rewards'
import Notes from '../pupil/Notes'
import DisplayResults from './DisplayResults'

export default function TakeMultiQuiz() {
   const { activeKid } = useSelector((state) => state.activeKid)
   const [multiData, setMultiData] = useState([])
   const dispatch = useDispatch()
   const params = useParams()
   const [view, setView] = useState('instructions')
   const [questions, setQuestions] = useState([])
   const [selectedQuestion, setSelectedQuestion] = useState(0)
   const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0)
   const [selectedOptions, setSelectedOptions] = useState({})
   const [result, setResult] = useState({})
   const [choice, setChoice] = useState('')
   const { user } = useSelector((state) => state.users)
   const letterMap = { 0: 'A', 1: 'B', 2: 'C', 3: 'D' }
   const navigate = useNavigate()
   const [secondsLeft = 0, setSecondsLeft] = useState(0)
   const [timeUp, setTimeUp] = useState(false)
   const [intervalId, setIntervalId] = useState(null)
   const [playClick] = useSound(click)
   const [playDing] = useSound(ding)
   const [playButtonPress] = useSound(buttonPress)
   const [showCountdown, setShowCountdown] = useState(false)
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
   const opts = ['x', '/', '+', '-']
   const [showResults, setShowResults] = useState(false)
   const [disableInputs, setDisableInputs] = useState(false)
   const [isGreyQuestion, setIsGreyQuestion] = useState('')
   const [finalScore, setFinalScore] = useState(0)
   const [rewards, setRewards] = useState([])

   const rewardsRef = useRef(null)

   const currentUser = activeKid || user.name

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

      console.log('USER_CHOSE: ', option)
      console.log('CORRECT_ANSWER: ', questions[selectedQuestionIndex].correctOption)
      setChoice(option)
   }

   const showScoreboard = right > 0 || wrong > 0 ? true : false

   function checkAnswer(userChose, correctAnswer) {
      console.log('FUNCTION userChose: ' + userChose + ' correctAnswer: ' + correctAnswer)
      setSelectedQuestionIndex(selectedQuestionIndex + 1)
      console.log('selectedQuestionIndex: ', selectedQuestionIndex)
      console.log(
         'chose vs correct: ',
         choice,
         questions[selectedQuestionIndex].correctOption
      )
      if (userChose == correctAnswer) {
         setRight(right + 1)
         console.log('CORRECT!!!')
         playCorrectSound()
         // generateReward()
         getReward()
      } else {
         setWrong(wrong + 1)
         playWrongSound()
      }
      // setAnsweredQuestions(answeredQuestions + 1)
      setAnsweredQuestions(answeredQuestions + 1)

      let answeredNum = answeredQuestions
      console.log('answeredQuestions: ' + answeredNum)
      console.log('total numQuestions: ' + questions.length)

      if (answeredQuestions === numQuestions - 1) {
         console.log('right: ' + right)
         console.log('wrong: ' + wrong)
         console.log('numQuestions: ' + numQuestions)
         setShowCountdown(false)
         // displayResults()
      }
   }

   const handleTimeUp = () => {
      setTimeUp(true)
      displayResults()
   }

   const displayResults = async () => {
      setShowCountdown(false)
      const percent = Math.round((parseInt(right) / parseInt(numQuestions)) * 100)
      setFinalScore(percent)
      // const message = `You got ${right} out of ${numQuestions} correct. Your score is ${percent}%`

      // const scoreObj = { percent }

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
         const response = await addMultiResult({
            type: 'multi',
            mmultiQuiz: params.id,
            user: user._id,
            pupil: activeKid._id,

            stats: resultStats,
         })
         dispatch(HideLoading())
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   //
   //
   //
   //
   const getMultiData = async () => {
      try {
         dispatch(ShowLoading())
         const response = await getMultiById({
            multiId: params.id,
         })
         dispatch(HideLoading())
         if (response.success) {
            console.log(response.data)
            setMultiData(response.data)
            setQuestions(response.data.questions)
            setSecondsLeft(response.data.countdownSeconds)
         } else {
            message.error(response.message)
         }
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   const calculateResult = async () => {
      playDing()
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

         let verdict = 'Pass'
         if (correctAnswers.length < multiData.passingMarks) {
            verdict = 'Fail'
         }

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

         let score = Math.round((correctAnswers.length / questions.length) * 100)

         const tempResult = {
            // timeUpStyle,
            correctAnswers,
            wrongAnswers,
            // verdict,
            score,
            // wrongChoice,
            // choice,
         }

         setResult(tempResult)
         dispatch(ShowLoading())

         const response = await addMultiResult({
            multi: params.id,
            user: user._id,
            result: tempResult,
         })
         dispatch(HideLoading())
         // setView('result')
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   useEffect(() => {
      if (timeUp) {
         clearInterval(intervalId)
         calculateResult()
         // setView('result')
      }
   }, [timeUp])

   useEffect(() => {
      if (params.id) {
         getMultiData()
      }
      // eslint-disable-next-line
   }, [])

   useEffect(() => {
      if (multiData) {
         // setNumQuestions(multiData.questions.length)
         setTitle(multiData.title)
         setNotes(multiData.notes)
         setCountdownSeconds(multiData.countdownSeconds)
         setUseCountdown(multiData.useCountdown)
         setShowCountdown(multiData.useCountdown)
         setShowNotes(true)
         // setNumQuestions(2)
      }
   }, [multiData])

   return (
      multiData && (
         <div className='flex flex-col items-center gap-1'>
            {currentUser}
            <div className='divider'></div>
            {/* <h3 className='text-center'>{multiData.question}</h3> */}
            <h2 style={{ fontFamily: 'schoolbell' }}>
               <u>{title}</u>
            </h2>
            <p>{JSON.stringify(multiData)}</p>

            {showNotes && (
               <Notes
                  title={title}
                  notes={notes}
                  setShowNotes={setShowNotes}
                  setShowQuiz={setShowQuiz}
                  numQuestions={numQuestions}
                  useCountdown={useCountdown}
                  countdownSeconds={countdownSeconds}
               />
            )}
            {showCountdown && (
               <>
                  {/* <CountdownTimer duration={countdownSeconds} onTimeUp={handleTimeUp} /> */}
               </>
            )}
            <Rewards rewards={rewards} ref={rewardsRef} />
            {showScoreboard && (
               <div>
                  ✅ <span className='scoreGreen'>{right}</span> :{' '}
                  <span className='scoreRed'>{wrong}</span>❌
               </div>
            )}

            {showQuiz && (
               <>
                  <div className='flex flex-col gap-2'>
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
                                       selectedOptions[selectedQuestionIndex] === option
                                          ? 'selected-option'
                                          : 'option'
                                    }`}
                                    key={index}
                                    onClick={() => clickButton(option)}
                                    // onClick={(e) => {
                                    //    console.log(e)
                                    //    playButtonPress()

                                    //    setSelectedOptions({
                                    //       ...selectedOptions,
                                    //       [selectedQuestionIndex]: option,
                                    //    })

                                    //    console.log('USER_CHOSE: ', option)
                                    //    console.log(
                                    //       'CORRECT_ANSWER: ',
                                    //       questions[selectedQuestionIndex].correctOption
                                    //    )
                                    //    setChoice(option)
                                    // }}
                                 >
                                    <h1 className='text-xl'>
                                       {option} :{' '}
                                       {questions[selectedQuestionIndex].options[option]}
                                    </h1>
                                 </button>
                              )
                           }
                        )}
                     </div>

                     <div className='flex gap-2'>
                        {/* {selectedQuestionIndex > 0 && (
                           <button
                              className='primary-outlined-btn'
                              onClick={() => {
                                 setSelectedQuestionIndex(selectedQuestionIndex - 1)
                                 console.log(selectedQuestionIndex)
                                 // checkAnswer(
                                 //    choice,
                                 //    questions[selectedQuestionIndex].correctOption
                                 // )
                                 console.log(
                                    'choice: ',
                                    choice + ' correctOption: ',
                                    questions[selectedQuestionIndex].correctOption
                                 )
                              }}
                           >
                              Previous
                           </button>
                        )} */}
                        {/* {questions.length} */}
                        {selectedQuestionIndex < questions.length - 1 && (
                           <button
                              className='primary-outlined-btn'
                              onClick={() => {
                                 // setSelectedQuestionIndex(selectedQuestionIndex + 1)
                                 // console.log(
                                 //    'selectedQuestionIndex: ',
                                 //    selectedQuestionIndex
                                 // )
                                 // console.log(
                                 //    'choice: ',
                                 //    choice + ' correctOption: ',
                                 //    questions[selectedQuestionIndex].correctOption
                                 // )
                                 checkAnswer(
                                    choice,
                                    questions[selectedQuestionIndex].correctOption
                                 )
                              }}
                           >
                              Next
                           </button>
                        )}

                        {selectedQuestionIndex === questions.length - 1 && (
                           <button
                              className='primary-outlined-btn'
                              onClick={() => {
                                 // calculateResult()
                                 // // setTimeUp(true)
                                 // clearInterval(intervalId)
                                 checkAnswer(
                                    choice,
                                    questions[selectedQuestionIndex].correctOption
                                 )
                                 setShowResults(true)
                              }}
                           >
                              FINISH
                           </button>
                        )}
                     </div>
                  </div>
               </>
            )}
            {showResults && (
               <div>ABCD</div>
               // <DisplayResults
               //    right={right}
               //    wrong={wrong}
               //    numQuestions={questions.length}
               //    currentUser={currentUser}
               //    finalScore={finalScore}
               // />
            )}

            {view === 'result2' && (
               <>POO</>
               // <div className='card3 brownBackground yellowFont'>
               //    <h1 style={result.timeUpStyle} className='text-2xl'>
               //       {result.isOutOfTime}
               //    </h1>
               //    <h1 className='text-2xl underline'>{activeKid.name}'s Result</h1>

               //    <div className='marks'>
               //       <h1 className='text-xl'>
               //          Correct Answers: {result.correctAnswers.length}
               //       </h1>

               //       <h1 className='text-xl'>
               //          Wrong Answers: {result.wrongAnswers.length}
               //       </h1>
               //       <h1 className='text-xl'>
               //          {/* {multiData.totalMarks > multiData.passingMarks ? 'PASS' : 'FAIL'} */}
               //          SCORE: {result.score}%
               //       </h1>
               //       <div className='flex gap-3'>
               //          <button
               //             className='primary-outlined-btn'
               //             // onClick={() => {
               //             //    navigate('/pupil/multiResults')
               //             // }}
               //          >
               //             View Results
               //          </button>
               //       </div>
               //    </div>
               // </div>
            )}
         </div>
      )
   )
}
