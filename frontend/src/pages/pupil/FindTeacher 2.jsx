import { useState } from 'react'
import ButtonGroup from 'antd/es/button/button-group'
import { Button } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

export default function FindTeacher() {
   const { activeKid } = useSelector((state) => state.activeKid)
   console.log('ACTIVE KID ', activeKid)
   const [query, setQuery] = useState('')
   const [searchResults, setSearchResults] = useState([])
   const [error, setError] = useState('')

   const handleSearch = async () => {
      try {
         const response = await fetch('/users/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, requestingUserId: 'user123' }),
         })
         const data = await response.json()
         if (response.ok) {
            setSearchResults(data)
            setError('')
         } else {
            setError(data.message)
         }
      } catch (error) {
         setError(error.message)
      }
   }

   const handleConnect = async (userId) => {
      try {
         const response = await fetch(`/users/${userId}/connect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requestingUserId: 'user123' }),
         })
         const data = await response.json()
         if (response.ok) {
            setSearchResults((results) =>
               results.map((result) =>
                  result._id === userId ? { ...result, connected: true } : result
               )
            )
         } else {
            setError(data.message)
         }
      } catch (error) {
         setError(error.message)
      }
   }

   return (
      <div>
         {activeKid && activeKid.name}
         <h1>Find My Teacher</h1>
         <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Enter username or email'
         />
         <Button type='primary' onClick={handleSearch}>
            Search
         </Button>
         {error && <p>{error}</p>}
         {searchResults.length > 0 ? (
            <ul>
               {searchResults.map((result) => (
                  <li key={result._id}>
                     <p>{result.username}</p>
                     {!result.connected && (
                        <Button onClick={() => handleConnect(result._id)}>Connect</Button>
                     )}
                  </li>
               ))}
            </ul>
         ) : null}
      </div>
   )
}
