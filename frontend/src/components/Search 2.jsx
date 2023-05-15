import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Search = () => {
   const [searchQuery, setSearchQuery] = useState('')
   const [searchResults, setSearchResults] = useState([])

   const handleSearch = async () => {
      const response = await axios.get(`/api/users/search?q=${searchQuery}`)
      setSearchResults(response.data)
   }

   useEffect(() => {
      if (searchQuery !== '') {
         handleSearch()
      }
   }, [searchQuery])

   const handleInputChange = (e) => {
      setSearchQuery(e.target.value)
   }

   const handleFriendRequest = (userId) => {
      // Send friend request to the user with the given userId
   }

   return (
      <div>
         <input
            type='text'
            value={searchQuery}
            onChange={handleInputChange}
            placeholder='Search by username or email'
         />
         {searchResults.length > 0 ? (
            <ul>
               {searchResults.map((user) => (
                  <li key={user._id}>
                     {user.userName} ({user.email})
                     <button onClick={() => handleFriendRequest(user._id)}>
                        Add Friend
                     </button>
                  </li>
               ))}
            </ul>
         ) : (
            <p>No search results found.</p>
         )}
      </div>
   )
}

export default Search
