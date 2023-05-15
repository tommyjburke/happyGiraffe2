// import { useParams } from 'react-router-dom'
import { HideLoading, ShowLoading } from '../../redux/loaderSlice'
import { message } from 'antd'
import { getMultiById } from '../../_apiCalls/apiMultis'
import { addReport } from '../../_apiCalls/apiMultiResults'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import Instructions from './Instructions'
import useSound from 'use-sound'
import click from './click.mp3'
import ding from './ding.mp3'
import { addMultiResult } from '../../_apiCalls/apiMultiResults'
// import Countdown from './Countdown'
// import CountdownTimer from './CountdownTimer'

export default function TakeMultiQuiz() {
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

   //
   const getMultiData = async () => {
      try {
         dispatch(ShowLoading())
         const response = await getMultiById({
            multiId: params.id,
         })
         dispatch(HideLoading())
         if (response.success) {
            setMultiData(response.data)
            setQuestions(response.data.questions)
            setSecondsLeft(response.data.duration)
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
         setView('result')
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   const [playClick] = useSound(click)
   const [playDing] = useSound(ding)

   const startTimer = () => {
      //
      playClick()
      let totalSeconds = multiData.duration
      //
      const intervalId = setInterval(() => {
         if (totalSeconds > 0) {
            totalSeconds = totalSeconds - 1
            setSecondsLeft(totalSeconds)
            playClick()
         } else {
            clearInterval(intervalId)

            setTimeUp(true)
         }
      }, 1000)
      setIntervalId(intervalId)
   }

   const handleTimeUp = () => {
      setTimeUp(true)
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

   return (
      multiData && (
         <div className='flex flex-col items-center gap-1'>
            <div className='divider'></div>
            <h3 className='text-center'>{multiData.name}</h3>

            {view === 'instructions' && (
               <Instructions
                  multiData={multiData}
                  setView={setView}
                  startTimer={startTimer}
                  // handleTimeUp={handleTimeUp}
               />
            )}

            {view === 'questions' && (
               <div className='flex flex-col gap-2'>
                  <div className='flex justify-between'>
                     <h3>
                        {selectedQuestionIndex + 1} :{' '}
                        {questions[selectedQuestionIndex].name}
                     </h3>
                  </div>

                  <div className='timer'>
                     <h1>{secondsLeft}</h1>
                  </div>

                  <div className='flex flex-col gap-2'>
                     {Object.keys(questions[selectedQuestionIndex].options).map(
                        (option, index) => {
                           return (
                              <div
                                 className={`flex gap-2 flex-col ${
                                    selectedOptions[selectedQuestionIndex] === option
                                       ? 'selected-option'
                                       : 'option'
                                 }`}
                                 key={index}
                                 onClick={() => {
                                    setSelectedOptions({
                                       ...selectedOptions,
                                       [selectedQuestionIndex]: option,
                                    })

                                    console.log(option)
                                    setChoice(option)
                                 }}
                              >
                                 <h1 className='text-xl'>
                                    {option} :{' '}
                                    {questions[selectedQuestionIndex].options[option]}
                                 </h1>
                              </div>
                           )
                        }
                     )}
                  </div>

                  <div className='flex gap-2'>
                     {selectedQuestionIndex > 0 && (
                        <button
                           className='brownButton2'
                           onClick={() => {
                              setSelectedQuestionIndex(selectedQuestionIndex - 1)
                           }}
                        >
                           Previous
                        </button>
                     )}
                     {questions.length}
                     {selectedQuestionIndex < questions.length - 1 && (
                        <button
                           className='brownButton2'
                           onClick={() => {
                              setSelectedQuestionIndex(selectedQuestionIndex + 1)
                           }}
                        >
                           Next
                        </button>
                     )}

                     {selectedQuestionIndex === questions.length - 1 && (
                        <button
                           className='brownButton2'
                           onClick={() => {
                              calculateResult()
                              // setTimeUp(true)
                              clearInterval(intervalId)
                           }}
                        >
                           FINISH
                        </button>
                     )}
                  </div>
               </div>
            )}

            {view === 'result' && (
               <div className='card3 brownBackground yellowFont'>
                  <h1 style={result.timeUpStyle} className='text-2xl'>
                     {result.isOutOfTime}
                  </h1>
                  <h1 className='text-2xl underline'>{user.name}'s Result</h1>

                  <div className='marks'>
                     <h1 className='text-xl'>
                        Total Marks required : {multiData.totalMarks}
                     </h1>
                     <h1 className='text-xl'>
                        Correct Answers: {result.correctAnswers.length}
                     </h1>

                     <h1 className='text-xl'>
                        Wrong Answers: {result.wrongAnswers.length}
                     </h1>
                     <h1 className='text-xl'>
                        VERDICT:{' '}
                        {/* {multiData.totalMarks > multiData.passingMarks ? 'PASS' : 'FAIL'} */}
                        SCORE: {result.score}%
                     </h1>
                     <div className='flex gap-3'>
                        <button
                           className='brownButton2'
                           onClick={() => {
                              navigate('/pupil/multiResults')
                           }}
                        >
                           View Results
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </div>
      )
   )
}
