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
      setValues(divsData)
   }, [divsData])

   const handleInputChange = (index, field, newValue) => {
      console.log('index: ', index, 'field: ', field, 'newValue: ', newValue)
      const updatedValues = [...values]
      updatedValues[index].spanValues[field] = newValue
      setValues(updatedValues)
   }

   const handleSave = () => {
      // Here you can make a call to your API to update the values in the database.
      console.log(values) // For multiple, this just logs the updated values to the console.
   }

   return (
      <>
         Title: {gameOptions.title} <br />
         Notes: {gameOptions.notes}
         <br />
         UseCountdown: {gameOptions.useCountdown.toString() || 'false'}
         <br />
         Seconds: {gameOptions.countdownSeconds}
         <br />
         DivsData: {JSON.stringify(divsData)}
         <br />
         <h3>Update Maths Quiz</h3>
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
                        className='boxAnswer'
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
            {divsData.map((data, index) => (
               <div key={data._id}>
                  {index + 1}.{' '}
                  <input
                     className='boxAnswer'
                     type='number'
                     value={data.spanValues[0] || ''}
                     onChange={(e) => handleInputChange(index, 0, e.target.value)}
                  />
                  <select
                     className='boxAnswer'
                     value={data.spanValues[3]}
                     onChange={(e) => handleInputChange(index, 3, e.target.value)}
                  >
                     <option value='+'>+</option>
                     <option value='-'>-</option>
                     <option value='*'>x</option>
                     <option value='/'>/</option>
                  </select>
                  <input
                     className='boxAnswer'
                     type='number'
                     value={data.spanValues[1]}
                     onChange={(e) => handleInputChange(index, 1, e.target.value)}
                  />
                  ={' '}
                  <input
                     disabled
                     className='boxAnswer'
                     value={eval(
                        data.spanValues[0] + data.spanValues[3] + data.spanValues[1]
                     )}
                     onChange={(e) =>
                        handleInputChange(
                           index,
                           2,
                           eval(
                              data.spanValues[0] + data.spanValues[3] + data.spanValues[1]
                           )
                        )
                     }
                  />{' '}
                  {/* <input
                  className='boxAnswer'
                  type='number'
                  value={data.spanValues[4]}
                  onChange={(e) => handleInputChange(index, 4, e.target.value)}
               /> */}
                  <select
                     className='boxAnswer'
                     value={data.spanValues[4]}
                     onChange={(e) => handleInputChange(index, 4, e.target.value)}
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
               onClick={handleSave}
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
