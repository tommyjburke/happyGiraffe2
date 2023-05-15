import React, { useState, useEffect } from 'react'
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
import { Button, Transfer } from 'antd'

import { DateField } from '@mui/x-date-pickers/DateField'
import { message } from 'antd'
import { getUserConnections } from '../../_apiCalls/apiUsers'
import { createGroup } from '../../_apiCalls/apiGroups'

export default function AddPupilForm() {
   const [mockData, setMockData] = useState([])
   const [targetKeys, setTargetKeys] = useState([])

   const [groupName, setGroupName] = useState('')
   const [description, setDescription] = useState('')

   // const [dateOfBirth, setDateOfBirth] = useState('')

   const [pupils, setPupils] = useState([])
   const [contacts, setContacts] = useState([]) // [ { _id, username, fullName, dateOfBirth, schoolName, className }
   const [error, setError] = useState('')
   const dispatch = useDispatch()
   const navigate = useNavigate()
   const params = useParams()
   const { user } = useSelector((state) => state.users)
   const userId = user._id

   const groupNameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/

   const handleGroupNameChange = (event) => {
      const { value } = event.target
      if (value.length < 2) {
         setError('Group name must be at least 2 characters long.')
      } else {
         setError('')
      }
      setGroupName(value)
   }

   const handleDescriptionChange = (event) => {
      const { value } = event.target
      setDescription(value)
   }

   const isSubmitDisabled = error.length > 0 || groupName.length < 2 ? true : false

   const submitLabel = isSubmitDisabled ? 'Incomplete' : 'Add New Group/Class'

   const buttonStyle = isSubmitDisabled
      ? 'grey-button-right w-20'
      : ' green-button-right w-20'

   const buttonColour = isSubmitDisabled
      ? 'backgroundColor: grey'
      : 'backgroundColor: green'

   useEffect(() => {
      // getMock()
      getContactsData()
   }, [])

   const monitorTransfer = (newTargetKeys) => {
      setTargetKeys(newTargetKeys)
      console.log('NEW TRANSFERED GRP ', newTargetKeys)
   }

   const renderFooter = (_, { direction }) => {
      if (direction === 'left') {
         return (
            <Button
               size='small'
               style={{
                  float: 'left',
                  margin: 4,
               }}
               onClick={getContactsData}
            >
               Reset
            </Button>
         )
      }
      return (
         <Button
            size='small'
            style={{
               float: 'right',
               margin: 4,
            }}
            onClick={getContactsData}
         >
            Reset
         </Button>
      )
   }

   const addGroupToDB = async () => {
      const groupMembers = targetKeys
      const teacherId = userId
      if (!groupName) {
         alert('Please add a name for class.')
         return
      }
      const newGroup = {
         groupName,
         description,
         teacherId,
         groupMembers,
      }
      console.log('New Group: ', newGroup)

      try {
         dispatch(ShowLoading())
         let response = await createGroup(newGroup)
         if (response.success) {
            message.success(response.message)
            // navigate('/teacher/quiz')
         } else {
            message.error(response.message)
         }
         dispatch(HideLoading())
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }

      // reset the form
      // setPupils([...pupils, newPupil])
      setGroupName('')
      setDescription('')
      // setDateOfBirth('')
   }

   const getContactsData = async () => {
      try {
         dispatch(ShowLoading())
         const response = await getUserConnections()
         console.log('CONNECTIONS ', response.data)
         dispatch(HideLoading())
         if (response.success) {
            setContacts(response.data)
            console.log('CONNECTIONS 2', contacts)
         } else {
            message.error('PRoBLEM ', response.message)
         }
      } catch (error) {
         console.log(error)
         dispatch(HideLoading())
         message.error('Something went wrong', error.message)
      }
   }

   const mappedContacts = contacts.map((contact) => ({
      key: contact.pupilId,
      details: `${contact.name} (${contact.schoolName}`,
   }))

   console.log('MAPPED CONTACTS : ', mappedContacts)

   console.log('CONTACTS : ', contacts)

   return (
      <div className='card'>
         {/* {JSON.stringify(contacts)} */}
         <br />
         <u>
            <h2>Create new group/class</h2>
         </u>
         {/* <p className='greenFont'>These details will be viewable by pupils</p> */}
         <div>
            <label>Group/Class Name:</label>
            <Input
               className='input40'
               type='text'
               id='groupName'
               name='groupName'
               value={groupName}
               onChange={handleGroupNameChange}
               placeholder='Name (required)'
            />
         </div>
         <div>
            <label>Description:</label>
            <Input
               className='input80'
               type='text'
               id='groupName'
               name='groupName'
               value={description}
               onChange={handleDescriptionChange}
               placeholder='description (optional)'
            />
         </div>
         {error && <div className='error'>{error}</div>}
         <br />
         <div>
            {/* {pupils.map((pupil, index) => (
               <div key={index}>
                  <h3>Pupil {index + 1}</h3>
                  <p>ClassName: {pupil.className}</p>
                  <p>Full Name: {pupil.name}</p>
                  <p>
                     Date of Birth:
                     {pupil.dateOfBirth}
                  </p>
                  <p>School Name: {pupil.schoolName}</p>
               </div>
            ))} */}
         </div>
         <div>
            <Transfer
               // style={{ backgroundColor: '#654321', color: 'white' }}
               dataSource={mappedContacts}
               showSearch
               listStyle={{
                  width: 350,
                  height: 400,
               }}
               operations={['to right', 'to left']}
               targetKeys={targetKeys}
               onChange={monitorTransfer}
               render={(item) => `${item.details}`}
               footer={renderFooter}
            />
            <br />

            <Button
               type='submit'
               // className={buttonColour}
               style={
                  isSubmitDisabled
                     ? { backgroundColor: 'grey !important' }
                     : { backgroundColor: 'green' }
               }
               disabled={isSubmitDisabled}
               onClick={addGroupToDB}
            >
               {submitLabel}
            </Button>
         </div>
      </div>
   )
}
