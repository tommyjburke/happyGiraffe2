import { useEffect, useState } from 'react'
import Greeting from '../../components/Greeting'
import { Button, Form, message, Table } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers } from '../../_apiCalls/apiUsers'
import { ShowLoading, HideLoading } from '../../redux/loaderSlice'

import { getConnectionsByPupilId } from '../../_apiCalls/apiUsers'
import { addConnection } from '../../_apiCalls/apiUsers'

export default function FindTeacher() {
   const { activeKid } = useSelector((state) => state.activeKid)
   const [searchTerm, setSearchTerm] = useState('')
   const [results, setResults] = useState([])
   const [connections, setConnections] = useState({})
   const dispatch = useDispatch()
   const [users, setUsers] = useState([])
   const [selectedUserId, setSelectedUserId] = useState(null)
   const [showUser, setShowUser] = useState(false)
   const pupilId = activeKid.pupilId
   console.log('PUPILID ', pupilId)

   const handleSearch = (e) => {
      const { value } = e.target
      setSearchTerm(value)
      if (value.length >= 3) {
         // Perform the search logic here
         const searchResults = performSearch(value)
         setResults(searchResults)
      } else {
         setResults([])
      }
   }

   const getUsers = async () => {
      try {
         const response = await getAllUsers()
         if (response.success) {
            setUsers(response.data)
         } else {
            message.error(response.message)
         }
      } catch (error) {
         message.error(error.message)
      }
   }

   const getConnectionsForPupil = async () => {
      try {
         let pupilId2 = { pupilId: activeKid.pupilId }
         dispatch(ShowLoading())
         console.log('USING PUPILID ', pupilId2)
         const response = await getConnectionsByPupilId(pupilId2)
         if (response.success) {
            console.log('CONNECTIONS ', response)
            setConnections(response?.data)
         } else {
            console.log('ERROR')
            message.error(response.message)
            console.log(response.message)
         }
         dispatch(HideLoading())
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   const wrappedConnections = [connections]
   console.log('wrappedConnections', wrappedConnections)

   const connectionColumns = [
      { title: 'ID', dataIndex: '_id', key: '_id' },
      { title: 'Name', dataIndex: 'name', key: 'name' },
      {
         title: 'Role',
         dataIndex: 'role',
         key: 'role',
         render: (role) => <span>{role === 1 ? 'Teacher' : 'Parent/Guardian'}</span>,
      },
   ]

   const performSearch = (searchTerm) => {
      if (!searchTerm) {
         return [] // Return an empty array if searchTerm is empty or undefined
      }
      const filteredUsers = users.filter((user) => user.email.includes(searchTerm))
      console.log('filteredUsers', filteredUsers)
      const searchResults = filteredUsers.map((user) => {
         const userWithButton = { ...user }
         console.log('connections', connections)
         console.log('connections.data ', connections.data)

         const userInConnections = connections.find(
            (connection) => connection._id === user.userId
         )
         if (userInConnections) {
            userWithButton.buttonText = 'REMOVE'
            user.textColour = 'grey'
         } else {
            userWithButton.buttonText = 'ADD'
            user.textColour = 'brown'
         }
         return userWithButton
      })
      return searchResults
   }

   const addRemoveButton = async (user, buttonText) => {
      const teacherId = user.userId
      const pupilId = activeKid.pupilId

      const payload = { pupilId: pupilId, teacherId: teacherId }
      console.log('payload', payload)

      if (buttonText === 'REMOVE') {
         // removeConnection(user)
         message.error(`NO CAN DO! ASK YOUR TEACHER: ${user.name}`, [5])
         // alert(`you are not authorized to remove ${userId}`)
      } else {
         message.info(`Adding ${user.name} to your connections`)

         try {
            dispatch(ShowLoading())
            const response = await addConnection(payload)
            if (response.success) {
               message.success(`Successfully added ${user.name} `, [3])

               getConnectionsForPupil()
               setSearchTerm('')
            } else {
               message.error(response.message)
               console.log(response.message)
            }
            dispatch(HideLoading())
         } catch (error) {
            dispatch(HideLoading())
            message.error(error.message)
         }
         // addConnection(user)
      }
   }

   useEffect(() => {
      getConnectionsForPupil()
      getUsers()
   }, [])

   return (
      // <div className='containerTop'>

      <Form>
         <Greeting title='Find Teacher' />
         <h2 className='greenFont'>{activeKid && activeKid.name}</h2>
         <div className='divider'></div>
         <div className='card optionsBordered' style={{ width: '600px' }}>
            <input
               type='text'
               value={searchTerm}
               onChange={handleSearch}
               placeholder='Search email address'
               className='w-80'
            />
            <ul>
               {results.map((user) => (
                  <div className='bordered' key={user.userId}>
                     <span
                        style={{
                           color: user.textColour,
                        }}
                     >
                        {user.email}{' '}
                        <Button
                           onClick={() => {
                              console.log('user.buttonText', user.buttonText)
                              let buttonText = user.buttonText
                              addRemoveButton(user, buttonText)
                           }}
                        >
                           {user.buttonText}
                        </Button>
                     </span>
                     <br />
                  </div>
               ))}
            </ul>
         </div>

         {/* <div>{JSON.stringify(users)}</div> */}

         <br />
         <div className='card optionsBordered'>
            <h3> {activeKid?.name}'s Teachers:</h3>

            <Table columns={connectionColumns} dataSource={wrappedConnections.flat()} />
            {/* {JSON.stringify(connections)} */}
         </div>
      </Form>
   )
}
