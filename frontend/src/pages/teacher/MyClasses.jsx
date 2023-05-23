import { Box } from '@mui/material'

import { getUserConnections, getUserPupils } from '../../_apiCalls/apiUsers'
import { useEffect, useState } from 'react'
import AddGroupForm from './AddGroupForm'
import { useDispatch, useSelector } from 'react-redux'
import { ShowLoading, HideLoading } from '../../redux/loaderSlice'
import { message } from 'antd'
import { getAllGroupsByTeacherId } from '../../_apiCalls/apiGroups'

import { Table, Card, Button, Popconfirm, Modal } from 'antd'
import MyClassesList from './MyClassesList'

export default function MyClasses() {
   // const [open, setOpen] = useState(false)
   // const handleOpen = () => setOpen(true)
   // const handleClose = () => setOpen(false)
   const dispatch = useDispatch()
   const [userClasses, setUserClasses] = useState([])
   const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false)
   const [editingRow, setEditingRow] = useState(null)
   const [deletingRow, setDeletingRow] = useState(null)
   const [isModalOpen, setIsModalOpen] = useState(false)
   const [modalData, setModalData] = useState({
      visible: false,
      groupMembers: [],
   })

   const showNewGroupModal = () => {
      setIsNewGroupModalOpen(true)
   }
   const handleNewGroupOk = () => {
      setIsNewGroupModalOpen(false)
   }
   const handleNewGroupCancel = () => {
      setIsNewGroupModalOpen(false)
   }

   // use useSelector to get user from state
   const { user } = useSelector((state) => state.users)
   const userId = user._id

   const getAllMyGroups = async () => {
      const teacherId = { userId }
      console.log('TEACHER ID', teacherId)
      try {
         dispatch(ShowLoading())
         const response = await getAllGroupsByTeacherId({ teacherId })
         console.log('USER ID', userId)
         console.log('MY CLASSES ', response.data)
         dispatch(HideLoading())
         if (response.success) {
            setUserClasses(response.data)
            console.log('USERCLASSES 2', userClasses)
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
      getAllMyGroups()
   }, [])

   const handleModalOk = () => {
      setIsModalOpen(false)
   }

   const handleModalCancel = () => {
      setIsModalOpen(false)
      setModalData({
         ...modalData,
         visible: false,
      })
   }

   const handleViewMembersClick = (members) => {
      setModalData({
         visible: true,
         groupMembers: members,
      })
      setIsModalOpen(true)
   }

   const handleDeleteRow = (record) => {
      // TODO: Implement delete logic here
      console.log('Deleting row', record)
   }

   const columns = [
      {
         title: 'Group Name',
         dataIndex: 'groupName',
      },
      {
         title: 'Description',
         dataIndex: 'description',
      },
      {
         title: 'Group Members',
         render: (_, group) => (
            <Button onClick={() => handleViewMembersClick(group.groupMembers)}>
               View Members
            </Button>
         ),
      },
      {
         title: 'Action',
         render: (_, record) => (
            <Popconfirm
               title='Are you sure you want to delete this row?'
               onConfirm={() => handleDeleteRow(record)}
               okText='Yes'
               cancelText='No'
            >
               <Button danger>Delete</Button>
            </Popconfirm>
         ),
      },
   ]

   return (
      <div>
         <div className='alignRight !important'>
            <button onClick={showNewGroupModal} className='buttonOnRight'>
               + Create New Class
            </button>
         </div>
         <Modal
            className='card'
            width='700px'
            visible={isNewGroupModalOpen}
            onOk={handleNewGroupOk}
            footer={null}
            onCancel={handleNewGroupCancel}
            getAllMyGroups={getAllMyGroups}
         >
            {/* <Box className='pupilForm'> */}
            <AddGroupForm
               getAllMyGroups={getAllMyGroups}
               onCancel={handleNewGroupCancel}
            />
            {/* </Box> */}
         </Modal>
         <h1>My Classes</h1>
         {/* {JSON.stringify(userClasses)} */}

         <br />
         <MyClassesList
            visible={modalData.visible}
            groupMembers={modalData.groupMembers}
            onCancel={handleModalCancel}
         />

         <div>
            <Table dataSource={userClasses} columns={columns} />
         </div>

         <MyClassesList />
      </div>
   )
}
