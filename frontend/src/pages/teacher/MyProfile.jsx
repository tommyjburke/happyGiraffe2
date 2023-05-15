import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

function TeacherProfile() {
   const { user } = useSelector((state) => state.users)

   const userObject = JSON.stringify(user)
   // dispatch = useDispatch()
   return (
      <div className='card '>
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
         <button className='buttonOnRight'>UPDATE</button>
         <br />
         <button className='buttonOnRight' style={{ backgroundColor: 'red' }}>
            DELETE ACCOUNT
         </button>
      </div>
   )
}

export default TeacherProfile
