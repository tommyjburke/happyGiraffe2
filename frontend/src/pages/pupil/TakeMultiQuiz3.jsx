// import { useParams } from 'react-router-dom'
import { HideLoading, ShowLoading } from '../../redux/loaderSlice'

import { getMultiById } from '../../_apiCalls/apiMultis'
import { addReport } from '../../_apiCalls/apiMultiResults'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import useSound from 'use-sound'
import click from './click.mp3'
import ding from './ding.mp3'
import { addMultiResult } from '../../_apiCalls/apiMultiResults'
import { Modal, message } from 'antd'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css' // import the styles
import CountdownTimer from '../teacher/CountdownTimer'
import correctSound from '../../_media/correct.mp3'
import incorrectSound from '../../_media/wrong.mp3'

export default function TakeMultiQuiz2(multiId, onClose) {
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

   const dispatch = useDispatch()
   const [multiData, setMultiData] = useState([])

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

   function generateReward() {
      const randomNum = Math.floor(Math.random() * 54) + 1
      const newReward = require(`../../_media/mygifs/${randomNum}.gif`)
      setRewards((prevRewards) => [...prevRewards, newReward])
   }

   //
   const getMultiDataById = async () => {
      try {
         dispatch(ShowLoading())
         const response = await getMultiById({
            multiId: multiId,
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

   const handleTimeUp = () => {
      setTimeUp(true)
   }

   // useEffect(() => {
   //    if (timeUp) {
   //       clearInterval(intervalId)
   //       calculateResult()
   //       // setView('result')
   //    }
   // }, [timeUp])

   useEffect(() => {
      getMultiDataById()

      // eslint-disable-next-line
   }, [])

   return (
      <Modal
         className='card modal-container'
         open={true}
         // footer={null}
         // onOk={generateDivs}
         onCancel={onClose}
         width={700}
      >
         <>
            <div>
               {showNotes && (
                  <div className='notes1'>
                     No. of Questions: <span className='notes2'>{questions.length}</span>{' '}
                     <br />
                     {useCountdown && (
                        <>
                           <br />
                           Timer:{' '}
                           <span className='notes2'>{countdownSeconds} seconds </span>
                        </>
                     )}
                     <br />
                     {notes.length > 0 && (
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
            </div>
            multiData && (
            <div className='flex flex-col items-center gap-1'>
               <div className='divider'></div>
               <h3 className='text-center'>{multiData.title}</h3>
            </div>
            )
         </>
      </Modal>
   )
}
