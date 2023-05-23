import { Modal, Box } from '@mui/material'

import { Table, Button } from 'antd'

import { getUserConnections } from '../../_apiCalls/apiUsers'
import { useEffect, useState } from 'react'
import SearchPupilForm from './SearchPupilForm'
import { useDispatch } from 'react-redux'
import { ShowLoading, HideLoading } from '../../redux/loaderSlice'
import { message } from 'antd'

// import { Table } from 'antd'

const contactsColumns = [
   {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
   },
   {
      title: 'Full Name',
      dataIndex: 'name',
      key: 'name',
   },
   {
      title: 'School',
      dataIndex: 'schoolName',
      key: 'schoolName',
   },
   {
      title: 'Class',
      dataIndex: 'className',
      key: 'className',
   },
   {
      title: '',
      key: 'action',
      render: (text, record) => (
         <Button type='primary' danger>
            Delete
         </Button>
      ),
   },
]

const style = {
   borderRadius: '30px',
   position: 'absolute',
   top: '40%',
   left: '50%',
   transform: 'translate(-50%, -50%)',
   width: 'auto%',
   bgcolor: 'none',
   border: '2px solid brown',
   boxShadow: 44,
   p: 1,
}

export default function MyPupils() {
   const [open, setOpen] = useState(false)
   const handleOpen = () => setOpen(true)
   const handleClose = () => setOpen(false)
   const dispatch = useDispatch()
   const [contacts, setContacts] = useState([]) // [ { _id, username, fullName, dateOfBirth, schoolName, className }

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

   useEffect(() => {
      getContactsData()
   }, [])

   return (
      <div>
         <div className='alignRight !important'>
            <button onClick={handleOpen} className='buttonOnRight'>
               + Find Add Pupil
            </button>
         </div>

         <Modal open={open} onClose={handleClose}>
            <Box className='pupilForm'>
               <SearchPupilForm />
            </Box>
         </Modal>

         {/* {JSON.stringify(contacts)} */}
         <h1>My Pupils/Contacts</h1>
         <Table columns={contactsColumns} dataSource={contacts} />

         {/* <ul>
            {contacts.map((contact) => (
               <li key={contact.username}>
                  {contact.fullName} ({contact.username})
               </li>
            ))}
         </ul> */}
         {/* <TableContainer>
            <Table>
               <TableHead>
                  <TableRow>
                     <TableCell>Username</TableCell>
                     <TableCell>Full Name</TableCell>
                     <TableCell>School</TableCell>
                     <TableCell>Class</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {contacts.map((contact) => (
                     <TableRow key={contact.username}>
                        <TableCell>{contact.username}</TableCell>
                        <TableCell>{contact.fullName}</TableCell>
                        <TableCell>{contact.schoolName}</TableCell>
                        <TableCell>{contact.className}</TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer> */}
      </div>
   )
}
