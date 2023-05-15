import { Modal, message } from 'antd'
import React, { useEffect, useState } from 'react'
import CountdownTimer from './CountdownTimer'
import correctSound from '../../_media/correct.mp3'
import incorrectSound from '../../_media/wrong.mp3'

import { addMathsQuiz } from '../../_apiCalls/apiMaths'
import { useNavigate, useParams } from 'react-router-dom'
import { HideLoading, ShowLoading } from '../../redux/loaderSlice'
import { useDispatch, useSelector } from 'react-redux'

// import { generateReward } from './Rewards'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css' // import the styles

import useSound from 'use-sound'

export default function BuildBoard({
   setShowBuildBoardModal,
   showBuildBoardModal,
   gameOptions,
}) {
   const [divsData, setDivsData] = useState([])
   // const [hiddenPosition, setHiddenPosition] = useState()
   const [showCountdown, setShowCountdown] = useState(gameOptions.useCountdown)
   const [timeUp, setTimeUp] = useState(false)
   const [right, setRight] = useState(0)
   const [wrong, setWrong] = useState(0)

   const [answeredQuestions, setAnsweredQuestions] = useState(0)

   const [playCorrectSound] = useSound(correctSound)
   const [playWrongSound] = useSound(incorrectSound)
   const [showQuiz, setShowQuiz] = useState(false)
   const [showNotes, setShowNotes] = useState(true)

   const dispatch = useDispatch()
   const navigate = useNavigate()
   const params = useParams()
   const { user } = useSelector((state) => state.users)
   const userId = user._id
   console.log('user id', userId)

   const [rewards, setRewards] = useState([])

   function generateReward() {
      const randomNum = Math.floor(Math.random() * 54) + 1
      const newReward = require(`../../_media/mygifs/${randomNum}.gif`)
      setRewards((prevRewards) => [...prevRewards, newReward])
   }

   const {
      title,
      numQuestions,
      userHiddenOption,
      operators,
      useCountdown,
      countdownSeconds,
      notes,
      aValue,
      bValue,
   } = gameOptions

   const opts = ['*', '/', '+', '-']

   const formattedOps = operators.map((op) => opts[op])

   function generateDivs() {
      const newDivsData = []

      let hiddenPosition
      for (let i = 0; i < numQuestions; i++) {
         if (parseInt(userHiddenOption) == 3) {
            hiddenPosition = Math.floor(Math.random() * 3)
         } else {
            hiddenPosition = parseInt(userHiddenOption)
         }

         const spanValues = []
         // for (let j = 0; j < 3; j++) {
         //    spanValues.push(Math.floor(Math.random() * 4))
         // }
         let a = Math.floor(
            Math.random() * (gameOptions.aValue[1] - gameOptions.aValue[0] + 1) +
               gameOptions.aValue[0]
         )
         spanValues.push(a)
         let b = Math.floor(
            Math.random() * (gameOptions.bValue[1] - gameOptions.bValue[0] + 1) +
               gameOptions.bValue[0]
         )

         spanValues.push(b)
         const randomOpIndex = Math.floor(Math.random() * operators.length)

         const randomOpInt = operators[randomOpIndex]

         let opt = opts[randomOpInt]

         let c = Math.floor(eval(`${a} ${opt} ${b}`))
         spanValues.push(c)
         spanValues.push(opt)
         spanValues.push(hiddenPosition)
         let correctAnswer = spanValues[hiddenPosition]
         spanValues.push(correctAnswer)

         newDivsData.push({ spanValues, inputValue: '' })

         console.log('SpanValues: ', spanValues)
      }

      setDivsData(newDivsData)
      console.log('DIVS DATA: ', divsData)
      console.log('NEW DIVS DATA: ', newDivsData)
      // return newDivsData
   }

   function handleInputChange(event, index) {
      const newDivsData = [...divsData]
      newDivsData[index].inputValue = event.target.value
      setDivsData(newDivsData)
   }

   // function showGif() {
   //    const gifs = 54 // replace with the number of gifs available
   //    const newGifNumber = Math.ceil(Math.random() * gifs)
   //    setGifNumber(newGifNumber)
   // }

   function checkAnswer(index, hiddenPosition) {
      setAnsweredQuestions(answeredQuestions + 1)
      const newDivsData = [...divsData]
      if (
         newDivsData[index].inputValue ===
         String(newDivsData[index].spanValues[hiddenPosition])
      ) {
         setRight(right + 1)
         playCorrectSound()
         generateReward()
         newDivsData[index].buttonLabel = '✅ ' + newDivsData[index].inputValue
         newDivsData[index].buttonClass = 'correctBtn !important'
         newDivsData[index].questionClass = 'greyQuestion !important'
         setRight(right + 1)
      } else {
         playWrongSound()
         setWrong(wrong + 1)
         newDivsData[index].buttonLabel = '❌ ' + newDivsData[index].inputValue
         newDivsData[index].buttonClass = 'incorrectBtn !important'
         newDivsData[index].questionClass = 'greyQuestion !important'
         newDivsData[index].showCorrectAnswer = (
            <span className='redText'>
               {newDivsData[index].spanValues[hiddenPosition]}
            </span>
         )
      }
      newDivsData[index].isDisabled = true
      newDivsData[index].inputDisabled = true
      newDivsData[index].inputValue = ' '
      // setDivsData(newDivsData)
      if (answeredQuestions === numQuestions - 1) {
         setTimeUp(true)
      }
   }

   function renderDivs() {
      return divsData.map((divData, index) => {
         const [a, b, c, operator, hiddenPosition, correctAnswer] = divData.spanValues

         let [x, y, z] = divData.spanValues
         console.log('input value', divData.inputValue)

         let userInput = (
            <input
               disabled={divData.inputDisabled}
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

         if (hiddenPosition === 0) {
            x = userInput
         } else if (hiddenPosition === 1) {
            y = userInput
         } else if (hiddenPosition === 2) {
            z = userInput
         }
         console.log('x y z', x, y, z)

         return (
            <div key={index} className={divData.questionClass || 'question !important'}>
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
                  disabled={divData.isDisabled}
               >
                  {divData.buttonLabel || 'CHECK'}
               </button>
               {divData.showCorrectAnswer}
            </div>
         )
      })
   }

   {
      /* // <div key={index} className='question'>
   //    {divData.spanValues.map((spanValue, index) => ( */
   }
   //       <>
   //          {/* <span key={0}>{spanValue[1]}</span> */}

   // ))

   useEffect(() => {
      generateDivs()
   }, [])

   const onSave = async (values) => {
      // console.log('ON SAVE FUNCTION DIVS DATA', divsData)
      // console.log('ON SAVE FUNCTION GAME OPTIONS', gameOptions)
      console.log('ON SAVE FUNCTION DIVSDATA', divsData)
      console.log('ON SAVE FUNCTION GAMEOPTIONS', gameOptions)
      console.log('ON SAVE FUNCTION USERID', userId)

      try {
         dispatch(ShowLoading())
         let response = await addMathsQuiz(divsData, gameOptions)
         if (response.success) {
            message.success(response.message)
            navigate('/teacher/quiz')
         } else {
            message.error(response.message)
         }
         dispatch(HideLoading())
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   const showScoreboard = right > 0 || wrong > 0 ? true : false

   const handleTimeUp = () => {
      setTimeUp(true)
      displayResults()
   }

   const displayResults = () => {
      setShowCountdown(false)
      const percent = (right / numQuestions) * 100
      const message = `You got ${right} out of ${numQuestions} correct (${percent}%)`
      Modal.info({
         title: 'Results',
         content: (
            <div>
               <p>{message}</p>
               {/* <p>
                  <button
                     className='btn btn-primary'
                     onClick={() => setShowBuildBoardModal(true)}
                  >
                     Close
                  </button>
               </p> */}
            </div>
         ),
      })
   }

   useEffect(() => {
      if (answeredQuestions === numQuestions) {
         displayResults()
      }
   }, [answeredQuestions])

   return (
      <Modal
         className=' card modal-container'
         open={true}
         footer={null}
         onOk={generateDivs}
         onCancel={() => setShowBuildBoardModal(false)}
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
               {useCountdown && (
                  <>
                     <br />
                     Timer: <span className='notes2'>{countdownSeconds} seconds </span>
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
         {showQuiz && (
            <>
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

               {showScoreboard && (
                  <div>
                     ✅ <span className='scoreGreen'>{right}</span> :{' '}
                     <span className='scoreRed'>{wrong}</span>❌
                  </div>
               )}
               <div>{renderDivs()}</div>
               <div className='rightButtonContainer'>
                  <button
                     onClick={() => {
                        // console.log(
                        //    'ON SAVE RENDER: ',
                        //    title,
                        //    notes,
                        //    numQuestions,
                        //    countdownSeconds
                        // )
                        onSave()
                     }}
                  >
                     Save Quiz
                  </button>
               </div>
               {showCountdown && (
                  <CountdownTimer duration={countdownSeconds} onTimeUp={handleTimeUp} />
               )}
            </>
         )}

         {/* <div>
            <button onClick={generateImage}>Generate Image</button>
         </div> */}
      </Modal>
   )
}
