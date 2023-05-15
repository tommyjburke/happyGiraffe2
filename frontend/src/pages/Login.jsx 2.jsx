import { Form, message } from 'antd'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { loginUser } from '../_apiCalls/apiUsers'
import { HideLoading, ShowLoading } from '../redux/loaderSlice'
import { LoginOutlined } from '@ant-design/icons'

import logo from '../_media/logo.png'

export default function Login() {
   const dispatch = useDispatch()

   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')

   const onFinish = async (loginCredentials) => {
      try {
         dispatch(ShowLoading())
         const response = await loginUser(loginCredentials)
         dispatch(HideLoading())
         if (response.success) {
            message.success(response.message)
            localStorage.setItem('token', response.data)
            window.location.href = '/'
         } else {
            message.error(response.message)
         }
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   const isSubmitDisabled = email && password ? false : true

   const submitLabel = isSubmitDisabled ? 'Both fields required' : 'Log in'

   const buttonStyle = isSubmitDisabled
      ? 'grey-button-centre'
      : 'green-button-right-centre'

   return (
      <div className='centre-screen !important'>
         <div className='card w40 !important'>
            <img src={logo} className='w20' />
            <br />
            <h1>LOGIN</h1>
            <div className='divider'></div>
            <Form layout='vertical' className='mt-2 3xl ' onFinish={onFinish}>
               <Form.Item
                  name='email'
                  label='Email'
                  rules={[
                     {
                        required: true,
                        message: 'Please input your Email!',
                     },
                  ]}
               >
                  <input
                     type='text'
                     placeholder='email'
                     onChange={(event) => setEmail(event.target.value)}
                  />
               </Form.Item>
               <Form.Item
                  name='password'
                  label='Password'
                  rules={[
                     {
                        required: true,
                        message: 'Please input your password!',
                     },
                  ]}
               >
                  <input
                     type='password'
                     placeholder='password'
                     onChange={(event) => setPassword(event.target.value)}
                  />
               </Form.Item>

               {/* <div className=' flex flex-col gap-2 items-center'>
                  <button type='primary' className='brown-button mt-2 w-100 text-2xl '>
                     Login
                  </button> */}
               <div className=' flex flex-col gap-2 items-center'>
                  <button
                     type='submit'
                     className={buttonStyle}
                     disabled={isSubmitDisabled}
                  >
                     {submitLabel}
                  </button>

                  <Link to='/register' className='underline'>
                     <span className='greenFont'>Register new member?</span>
                  </Link>
               </div>
            </Form>
         </div>
      </div>
   )
}
