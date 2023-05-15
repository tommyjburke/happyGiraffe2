import React from 'react'
import { Form, message } from 'antd'
import { Link } from 'react-router-dom'
// import { registerUser } from '../_apiCalls/apiUsers'
import { registerUser } from '../_apiCalls/apiUsers'
import { useState } from 'react'
import { Radio } from 'antd'
import { HideLoading, ShowLoading } from '../redux/loaderSlice'
import { useDispatch } from 'react-redux'
import logo from '../_media/logo.png'

function Register() {
   const dispatch = useDispatch()
   const [name, setName] = useState('')
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [role, setRole] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [passwordMatchError, setPasswordMatchError] = useState(false)

   // const [isTeacher, setIsTeacher] = useState(true)

   // const handleRadioChange = (event) => {
   //    setRole(event.target.value === 'true')
   // }

   const handlePasswordChange = (event) => {
      setPassword(event.target.value)
      setPasswordMatchError(event.target.value !== confirmPassword)
   }

   const handleConfirmPasswordChange = (event) => {
      setConfirmPassword(event.target.value)
      setPasswordMatchError(event.target.value !== password)
   }

   // Disable submit button if passwords do not match
   const isSubmitDisabled =
      name && email && password && password === confirmPassword ? false : true

   const submitLabel = isSubmitDisabled ? 'All fields required' : 'Submit registration'

   const buttonStyle = isSubmitDisabled
      ? 'grey-button-centre'
      : 'green-button-right-centre'

   const onFinish = async (userInfo) => {
      try {
         dispatch(ShowLoading())
         const response = await registerUser(userInfo)
         dispatch(HideLoading())
         if (response.success) {
            message.success(response.message)
         } else {
            message.error(response.message)
         }
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   return (
      <div className='flex justify-center items-center h-screen w-screen bg-primary'>
         <div className='card w600px p-3 '>
            <div className='flex flex-col'>
               <h1 className='text-2xl'>
                  <div className='flex justify-center items-center'>
                     <img src={logo} className='w20' />
                     <br />

                     <h1>REGISTER</h1>
                  </div>
               </h1>
               <div className='divider'></div>
               <Form layout='vertical' className='mt-2' onFinish={onFinish}>
                  <Form.Item name='name' label='name'>
                     <input
                        type='text'
                        placeholder='name'
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                     />
                  </Form.Item>
                  <Form.Item name='email' label='Email'>
                     <input
                        type='text'
                        placeholder='Email'
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                     />
                  </Form.Item>
                  <Form.Item name='password' label='Password'>
                     <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        // onChange={(event) => setPassword(event.target.value)
                        onChange={handlePasswordChange}
                     />
                  </Form.Item>
                  <Form.Item name='confirmPassword' label='Confirm Password'>
                     <input
                        type='password'
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        // onChange={(event) => setConfirmPassword(event.target.value)}
                        onChange={handleConfirmPasswordChange}
                     />
                     {passwordMatchError && (
                        <span style={{ color: 'red' }}>Passwords do not match</span>
                     )}
                  </Form.Item>
                  <Form.Item
                     name='role'
                     label='Role'
                     onChange={(e) => setRole(e.target.value)}
                  >
                     <Radio.Group>
                        <Radio value='0'>Parent/Pupil</Radio>
                        <Radio value='1'>Teacher</Radio>
                        <Radio value='2'>Admin</Radio>
                     </Radio.Group>
                  </Form.Item>
                  Teacher value: {role}
                  <div className='flex flex-col gap-3'>
                     <button
                        type='submit'
                        className={buttonStyle}
                        disabled={isSubmitDisabled}
                     >
                        {submitLabel}
                     </button>
                     <div className='flex justify-center items-center'>
                        <Link to='/login' className='underline'>
                           <span className='greenFont'> Login here </span>
                        </Link>
                     </div>
                  </div>
               </Form>
            </div>
         </div>
      </div>
   )
}

export default Register
