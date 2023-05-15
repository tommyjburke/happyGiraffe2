import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

function TeacherProfile() {
   const { user } = useSelector((state) => state.users)

   const userObject = JSON.stringify(user)
   // dispatch = useDispatch()
   return (
      <div className='w-80'>
         {/* <div className='w-60 !important'>{userObject}</div> */}
         <h1>My Profile</h1>
         <div className='divider'></div>
         <br />
         Name:
         <input className='input40' label='name' type='text' value={user?.name} />
         <br />
         Email:
         <input
            className='input40'
            label='email'
            type='text'
            value={user?.email}
            disabled
         />
         <br />
         Username:
         <input className='input40' label='username' type='text' value={user?.username} />
         <button className='green-button-right'>UPDATE</button>
      </div>
   )
}

export default TeacherProfile
