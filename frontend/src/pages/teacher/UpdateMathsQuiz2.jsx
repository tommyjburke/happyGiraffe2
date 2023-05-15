import React, { useEffect, useState } from 'react'
import Form from 'antd/es/form/Form'
import { Button, Col, Input, message, Row, Typography, Modal } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { HideLoading, ShowLoading } from '../../redux/loaderSlice'
import { getMathsById, updateMathsById } from '../../apiCalls/apiMaths'
import './MathStyles.css'

const QuizData = [
   {
      spanValues: ['12', '6', '72', '*', '2', '72'],
      inputValue: '',
      _id: '6449964a77a6c195325bad1c',
   },
   {
      spanValues: ['9', '6', '54', '*', '0', '9'],
      inputValue: '',
      _id: '6449964a77a6c195325bad1d',
   },
   {
      spanValues: ['5', '4', '20', '*', '2', '20'],
      inputValue: '',
      _id: '6449964a77a6c195325bad1e',
   },
]

function UpdateMathsQuiz() {
   const [quizData, setQuizData] = useState([])
   const [inputValue, setInputValue] = useState('')
   const [isEdited, setIsEdited] = useState(false)
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const params = useParams()

   const handleInputChange = (event) => {
      // Update the input value and set the "isEdited" state variable to true
      console.log(event.target.value)
      setInputValue(event.target.value)
      setIsEdited(true)
   }

   const handleSave = async () => {
      // Save the updated value to the server
      // await saveData(inputValue)
      setIsEdited(false)
   }

   // const handleInputChange = (e, index) => {
   //    console.log(e.target)
   //    const { value } = e.target
   //    setQuizData((prevQuizData) => {
   //       const updatedQuizData = [...prevQuizData]
   //       const updatedSpanValues = [...updatedQuizData[index].spanValues]
   //       updatedSpanValues[2] = value
   //       updatedQuizData[index].inputValue = value
   //       updatedQuizData[index].spanValues = updatedSpanValues
   //       return updatedQuizData
   //    })
   // }

   const handleHiddenValue = (e, index) => {
      const { value } = e.target
      setQuizData((prevQuizData) => {
         const updatedQuizData = [...prevQuizData]
         const updatedSpanValues = [...updatedQuizData[index].spanValues]
         updatedSpanValues[5] = value
         updatedQuizData[index].inputValue = value
         updatedQuizData[index].spanValues = updatedSpanValues
         return updatedQuizData
      })
   }

   // const handleSubmit = (e) => {
   //    e.preventDefault()
   //    console.log(quizData) // Do something with the updated quiz data
   // }

   const getMathsDataById = async () => {
      try {
         console.log('ParamsId in API: ', params.id)
         const response = await getMathsById({
            id: params.id,
         })
         console.log('Response:', response)
         if (response.success) {
            console.log(response.data)
            const { divsData, gameOptions } = response.data

            setQuizData(divsData)
            console.log('QuizData: ', QuizData)
            console.log('DivsData: ', divsData)
         } else {
            message.error(response.message)
         }
      } catch (error) {
         message.error(error.message)
      }
   }

   useEffect(() => {
      console.log('ParamsId: ', params.id)
      console.log('getMathsDataById called')
      getMathsDataById()
      return () => {}
   }, [])

   return (
      <div className='card' style={{ marginTop: 20 }}>
         Update MATHS QUIZ
         <form>
            <div>
               <input className='boxAnswerTransparent' value='A' disabled />
               <input className='boxAnswerTransparent' value='op' disabled />
               <input className='boxAnswerTransparent' value='B' disabled />
               <input className='boxAnswerTransparent' value='=' disabled />
               <input className='boxAnswerTransparent' value='C' disabled />
               <input className='boxAnswerTransparent' value='hidden' disabled />
            </div>

            <div>
               {quizData.map(({ _id, spanValues, inputValue }, index) => {
                  const [a, b, c, op, hidden, f] = spanValues
                  const result = eval(`${a}${op}${b}`)
                  return (
                     <div key={_id}>
                        <span>{index + 1}</span>
                        <input
                           className='boxAnswer'
                           type='number'
                           value={inputValue || a}
                           onChange={(e) => handleInputChange(e, index)}
                        />
                        <select
                           className='boxAnswer'
                           value={inputValue || op}
                           onChange={(e) => handleInputChange(e, index)}
                        >
                           <option value='+'>+</option>
                           <option value='-'>-</option>
                           <option value='*'>*</option>
                        </select>
                        <input
                           className='boxAnswer'
                           type='number'
                           value={b || inputValue}
                           onChange={(e) => handleInputChange(e, index)}
                        />
                        <input className='boxAnswer' disabled value='=' />
                        <input
                           disabled
                           className='boxAnswer'
                           type='number'
                           value={result}
                        />
                        {/* <input
                           className='boxAnswer'
                           type='number'
                           value={inputValue || hidden}
                           onChange={(e) => handleInputChange(e, index)}
                        /> */}
                        <select
                           className='boxAnswer'
                           value={inputValue || hidden}
                           onChange={(e) => handleHiddenValue(e, index)}
                        >
                           <option value={0}>A</option>
                           <option value={1}>B</option>
                           <option value={2}>C</option>
                        </select>
                     </div>
                  )
               })}
            </div>

            <div style={{ textAlign: 'right !important', paddingBottom: 40, margin: 10 }}>
               <button
                  type='submit'
                  style={{ float: 'right', margin: '0' }}
                  onClick={handleSave}
                  disabled={isEdited}
               >
                  Save
               </button>
            </div>
         </form>
      </div>
   )
}

export default UpdateMathsQuiz
