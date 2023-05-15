import React from 'react'
import { useNavigate } from 'react-router-dom'

function NotFound() {
   const navigate = useNavigate()

   return (
      <div
         style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
         }}
      >
         <div style={{ textAlign: 'center' }}>
            <h1> Giraffe</h1>
            <h1>Not Found</h1>
            <button onClick={() => navigate('/')}>Go back to homepage</button>
         </div>
      </div>
   )
}

export default NotFound
