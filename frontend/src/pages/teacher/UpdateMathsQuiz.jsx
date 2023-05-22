import React, { useEffect, useState } from 'react'
import Form from 'antd/es/form/Form'
import { Button, Col, Input, message, Row, Typography, Modal, Checkbox } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { HideLoading, ShowLoading } from '../../redux/loaderSlice'
import { getMathsById, updateMathsById } from '../../_apiCalls/apiMaths'

import ReactQuill from 'react-quill'

export default function UpdateMathsQuiz() {
   const [divsData, setDivsData] = useState([])
   const [isEdited, setIsEdited] = useState(false)
   const [gameOptions, setGameOptions] = useState({ useCountdown: false })
   const [values, setValues] = useState([])
   const [isChecked, setIsChecked] = useState(false)
   const [thisSumResult, setThisSumResult] = useState()
   const [thisSumResult2, setThisSumResult2] = useState()

   const dispatch = useDispatch()
   const navigate = useNavigate()
   const params = useParams()

   const handleCheckboxChange = (event) => {
      setGameOptions({
         ...gameOptions,
         useCountdown: event.target.checked,
      })
   }

   // ReactQuill stuff
   const options = {
      modules: {
         toolbar: [
            ['bold', 'italic', 'underline'], // toggled buttons

            // custom button values
            [{ list: 'ordered' }, { list: 'bullet' }],

            ['clean'], // remove formatting button
         ],
      },
      theme: 'snow',
   }

   const updateMathsQuizById = async () => {
      console.log('GameOptions: ', gameOptions)
      console.log('DivsData: ', divsData)
      console.log('UseCountdown: ', gameOptions.useCountdown)
      console.log('ParamsId: ', params.id)
      // quizId = params.id

      try {
         dispatch(ShowLoading())
         const response = await updateMathsById({
            quizId: params.id,
            divsData,
            gameOptions,
         })
         console.log('Response:', response)
         if (response.success) {
            message.success('Maths quiz updated successfully')
            // navigate('/teacher/quiz')
         } else {
            message.error(response.message)
         }
         dispatch(HideLoading())
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   const getMathsDataById = async () => {
      try {
         dispatch(ShowLoading())
         console.log('ParamsId in API: ', params.id)
         const response = await getMathsById({
            id: params.id,
         })
         console.log('Response:', response)
         if (response.success) {
            console.log(response.data)
            const { divsData, gameOptions } = response.data

            setDivsData(divsData)
            setGameOptions(gameOptions)
            console.log('DivsData: ', divsData)
            console.log('GameOptions: ', gameOptions)
            console.log('UseCountdown: ', gameOptions.useCountdown)
         } else {
            message.error(response.message)
         }
         dispatch(HideLoading())
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   useEffect(() => {
      console.log('ParamsId: ', params.id)
      console.log('getMathsDataById called')
      getMathsDataById()
      return () => {}
   }, [])

   useEffect(() => {
      // console.log('DivsData: ', divsData)
      setValues(divsData)
   }, [divsData])

   const handleDivsDataChange = (index, spanIndex, newValue) => {
      console.log('newValue ', newValue)
      const updatedValues = [...values]

      // SPAN VALUES INDEXES
      // 0: first number in sum (e.g. 2)
      // 1: second number in sum (e.g. 3)
      // 2: result of sum (e.g. 5) - spanValues[2] = 5
      // 3: operator (e.g. +) - spanValues[3] = +
      // 4: hidden position (A or B or C)
      // 5: Actual correct answer based on hidden position

      switch (spanIndex) {
         case 0:
            updatedValues[index].spanValues[spanIndex] = newValue
            updatedValues[index].spanValues[2] = eval(
               `${newValue} ${updatedValues[index].spanValues[3]} ${updatedValues[index].spanValues[1]}`
            )
            break
         case 1:
            updatedValues[index].spanValues[spanIndex] = newValue
            updatedValues[index].spanValues[2] = eval(
               `${updatedValues[index].spanValues[0]} ${updatedValues[index].spanValues[3]} ${newValue}`
            )
            break
         case 3:
            updatedValues[index].spanValues[spanIndex] = newValue
            updatedValues[index].spanValues[2] = eval(
               `${updatedValues[index].spanValues[0]} ${newValue} ${updatedValues[index].spanValues[1]}`
            )
         case 4:
            console.log('value pre :', newValue)
            updatedValues[index].spanValues[spanIndex] = newValue
            updatedValues[index].spanValues[5] = updatedValues[index].spanValues[newValue]
            console.log('value post :', newValue)
            console.log(
               'updatedValues[index].spanValues[5] :',
               updatedValues[index].spanValues[5]
            )
      }

      // console.log('updatedValues: ', updatedValues)
      // updatedValues[index].spanValues[spanIndex] = newValue

      console.log('updatedValues: ', JSON.stringify(updatedValues[index]))
      setValues(updatedValues)
   }

   const handleSave = () => {
      // Here you can make a call to your API to update the values in the database.
      console.log(values) // For multiple, this just logs the updated values to the console.
   }

   return (
      <>
         {/* Title: {gameOptions.title} <br />
         Notes: {gameOptions.notes}
         <br />
         UseCountdown: {gameOptions.useCountdown.toString() || 'false'}
         <br />
         Seconds: {gameOptions.countdownSeconds}
         <br />
         DivsData: {JSON.stringify(divsData)}
         <br /> */}
         <h1>Update Maths Quiz</h1>
         <Form>
            {/* {JSON.stringify(gameOptions)} */}

            <div className='giraffe_background'>
               <div className='mathOptions'>
                  <div className='optionsBordered'>
                     <label>Quiz Title: </label>
                     <input
                        className='uiInputTitle'
                        type='text'
                        placeholder='Enter Maths Quiz Title'
                        value={gameOptions.title}
                        onChange={(e) =>
                           setGameOptions({
                              ...gameOptions,
                              title: e.target.value,
                           })
                        }
                     />
                  </div>
                  <div className='optionsBordered'>
                     <label>Notes: </label>
                     <ReactQuill
                        className='notesQuill !important'
                        placeholder='Notes or instructions go here'
                        modules={options.modules}
                        theme={options.theme}
                        value={gameOptions.notes}
                        onChange={(event) =>
                           setGameOptions({
                              ...gameOptions,
                              notes: event,
                           })
                        }
                     />
                  </div>
                  <div className='optionsBordered'>
                     <label>Use Countdown Timer: </label>
                     <Checkbox
                        type='checkbox'
                        checked={gameOptions.useCountdown}
                        onChange={handleCheckboxChange}
                     />
                     <br />
                     <input
                        type='number'
                        className='boxInput'
                        placeholder='Enter Quiz Score'
                        value={gameOptions.countdownSeconds}
                        onChange={(e) =>
                           setGameOptions({
                              ...gameOptions,
                              countdownSeconds: e.target.value,
                           })
                        }
                     />{' '}
                     seconds
                  </div>
               </div>
            </div>
         </Form>
         <div className='optionsBordered2'>
            <div>
               <span className='indexNum2'>n</span>
               <input disabled className='boxHead' value='A' />
               <input disabled className='boxHead' value='+' />
               <input disabled className='boxHead' value='B' />={' '}
               <input disabled className='boxHead' value='C' />{' '}
               <input disabled className='boxHead2' value='position' />
            </div>
            {divsData.map((data, index) => (
               <div key={data._id}>
                  <span className='indexNum'>{index + 1}.</span>{' '}
                  <input
                     //  ~~~~~~~~~~~~ a ~~~~~~~~~~~~
                     min='1'
                     className='boxInput'
                     type='number'
                     value={parseInt(data.spanValues[0]) || ''}
                     onChange={(e) => {
                        handleDivsDataChange(index, 0, parseInt(e.target.value))
                     }}
                  />
                  <select
                     className='boxOp'
                     value={data.spanValues[3]}
                     onChange={(e) => handleDivsDataChange(index, 3, e.target.value)}
                  >
                     <option value='+'>+</option>
                     <option value='-'>-</option>
                     <option value='*'>x</option>
                     <option value='/'>/</option>
                  </select>
                  <input
                     //  ~~~~~~~~~~~~ b ~~~~~~~~~~~~
                     className='boxInput'
                     min='1'
                     type='number'
                     value={parseInt(data.spanValues[1]) || ''}
                     onChange={(e) => {
                        handleDivsDataChange(index, 1, parseInt(e.target.value))
                     }}
                  />
                  ={' '}
                  <input
                     disabled
                     className='boxAns'
                     value={eval(
                        parseInt(data.spanValues[0]) +
                           data.spanValues[3] +
                           parseInt(data.spanValues[1])
                     )}
                  />{' '}
                  {/* <input
                  className='boxInput'
                  type='number'
                  value={data.spanValues[4]}
                  onChange={(e) => handleDivsDataChange(index, 4, e.target.value)}
               /> */}
                  <select
                     className='boxOp'
                     value={data.spanValues[4]}
                     onChange={(e) => handleDivsDataChange(index, 4, e.target.value)}
                  >
                     <option value={0}>A</option>
                     <option value={1}>B</option>
                     <option value={2}>C</option>
                  </select>
               </div>
            ))}
            <button
               type='submit'
               style={{ float: 'right', margin: '0' }}
               onClick={updateMathsQuizById}
               disabled={isEdited}
            >
               Save
            </button>
            <br />
         </div>
         <br />
      </>
   )
}
