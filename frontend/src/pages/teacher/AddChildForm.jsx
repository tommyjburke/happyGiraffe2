import React, { useState } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { addChild } from '../../_apiCalls/apiUsers'
import { useNavigate, useParams } from 'react-router-dom'
import { HideLoading, ShowLoading } from '../../redux/loaderSlice'
import { useDispatch, useSelector } from 'react-redux'
import { UserOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'

import { addPupil } from '../../_apiCalls/apiPupils'

import { DateField } from '@mui/x-date-pickers/DateField'
import { message } from 'antd'

export default function AddPupilForm({ getMyPupilsData }) {
   const [username, setUsername] = useState('')
   const [name, setName] = useState('')
   // const [dateOfBirth, setDateOfBirth] = useState('')
   const [schoolName, setSchoolName] = useState('')
   const [pupils, setPupils] = useState([])
   const [className, setClassName] = useState('')
   const [error, setError] = useState('')
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const params = useParams()
   const { user } = useSelector((state) => state.users)
   const userId = user._id

   // const handleUserNameChange = (e) => setUserName(e.target.value)

   // const handleDateOfBirthChange = (e) => setDateOfBirth(e.target.value)
   const handleSchoolNameChange = (e) => setSchoolName(e.target.value)
   const handleClassNameChange = (e) => setClassName(e.target.value)

   const usernameRegex = /^[a-zA-Z0-9]+$/
   const fullNameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/

   const handleUsernameChange = (event) => {
      const { value } = event.target
      if (value.length < 6) {
         setError('Username must be at least 6 characters long.')
      } else if (!usernameRegex.test(value)) {
         setError('Username must only contain letters and numbers.')
      } else {
         setError('')
      }
      setUsername(value)
   }

   const handleFullNameChange = (event) => {
      const { value } = event.target
      if (!fullNameRegex.test(value)) {
         setError(
            'Please enter a proper full name including a space between first and last name.'
         )
      } else {
         setError('')
      }
      setName(value)
   }

   const isSubmitDisabled =
      error.length > 0 || username.length < 6 || name.length < 3 ? true : false

   const submitLabel = isSubmitDisabled ? 'Incomplete' : 'Add Child'

   const buttonStyle = isSubmitDisabled ? 'grey-button-right w-20' : ' buttonOnRight w-20'

   const handleClose = () => {
      setUsername('')
      setName('')
      setSchoolName('')
      setClassName('')
      handleClose()
      navigate('/pupils')
      window.location.reload()
   }

   const addChildToDB = async () => {
      if (!username || !name) {
         alert('Please complete all fields.')
         return
      }
      const birthYear = 2015
      const newChild = { username, name, schoolName, className, birthYear, userId }
      console.log('New Child: ', newChild)

      try {
         dispatch(ShowLoading())
         let response = await addPupil(newChild)
         if (response.success) {
            message.success(response.message)

            handleClose()
            // navigate('/pupils')
         } else {
            message.error(response.message)
         }
         dispatch(HideLoading())
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
      getMyPupilsData()

      // reset the form
      // setPupils([...pupils, newPupil])
      setUsername('')
      setName('')
      // setDateOfBirth('')
      setSchoolName('')
      setClassName('')
   }

   return (
      <div className='card'>
         {user.name}
         {userId}
         <br />
         <h2>Add Child to this account</h2>
         <p className='greenFont'>These details will be viewable by the teacher</p>
         <div>
            <label htmlFor='username-input'>Username:</label>
            <Input
               className='input60'
               type='text'
               id='username'
               name='username'
               value={username}
               onChange={handleUsernameChange}
               placeholder='Unique Username (required)'
            />
         </div>
         <br />
         <div>
            <label>
               Full Name:
               <Input
                  type='text'
                  value={name}
                  onChange={handleFullNameChange}
                  className='input60'
                  placeholder='First & Last name (required)'
               />
            </label>
         </div>
         <br />
         <div>
            <label>
               School Name:
               <Input
                  type='text'
                  value={schoolName}
                  onChange={handleSchoolNameChange}
                  placeholder='Current school'
                  className='input60'
               />
            </label>
         </div>
         <br />
         <div>
            <label>
               Class Name:
               <Input
                  type='text'
                  value={className}
                  onChange={handleClassNameChange}
                  placeholder='Name of class at school'
                  className='input60'
               />
            </label>
         </div>
         <br />

         {error && <div className='error'>{error}</div>}
         <br />

         <br />
         <br />

         <div className='flex flex-col gap-3'>
            <button
               type='submit'
               className={buttonStyle}
               disabled={isSubmitDisabled}
               onClick={addChildToDB}
            >
               {submitLabel}
            </button>
         </div>

         <div>
            {pupils.map((pupil, index) => (
               <div key={index}>
                  <h3>Pupil {index + 1}</h3>
                  <p>Username: {pupil.username}</p>
                  <p>Full Name: {pupil.fullName}</p>
                  <p>
                     Date of Birth:
                     {pupil.dateOfBirth}
                  </p>
                  <p>School Name: {pupil.schoolName}</p>
               </div>
            ))}
         </div>
      </div>
   )
}
