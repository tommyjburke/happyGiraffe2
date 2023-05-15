import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { message, Table, Cascader, Space, Button, Modal, Tag } from 'antd'
import { useDispatch } from 'react-redux'
import { ShowLoading, HideLoading } from '../../redux/loaderSlice'
import { createAssignment } from '../../_apiCalls/apiAssignments'
import { getAllGroupsByTeacherId } from '../../_apiCalls/apiGroups'
import { getAllMultisByTeacherId } from '../../_apiCalls/apiMultis'
import { getAllMathsByTeacherId } from '../../_apiCalls/apiMaths'
import { useEffect } from 'react'
import { useState } from 'react'
import GetAssignmentStatus from './GetAssignmentStatus'
import SetAssignment from './SetAssignment'

import moment from 'moment'

import { getAllAssignmentsByTeacherId } from '../../_apiCalls/apiAssignments'
import Greeting from '../../components/Greeting'

function MyAssignments() {
   const [assignments, setAssignments] = useState([])
   const [assignmentId, setAssignmentId] = useState('')
   const [thisMessage, setThisMessage] = useState('')
   const [showStatus, setShowStatus] = useState(false)
   const [showSetAssignment, setShowSetAssignment] = useState(false)
   const [isAssignmentVisible, setIsAssignmentVisible] = useState(false)
   const dispatch = useDispatch()

   const { user } = useSelector((state) => state.users)
   const navigate = useNavigate()

   const openStatusModal = (assignmentId) => {
      setAssignmentId(assignmentId)
      setShowStatus(true)
   }

   const handleCancel = () => {
      setShowStatus(false)
   }

   const getAllAssignments = async () => {
      const userId = user._id
      console.log('USER ID ', userId)

      try {
         dispatch(ShowLoading())
         const response = await getAllAssignmentsByTeacherId(userId)
         if (response.success) {
            setAssignments(response.data)
            console.log('ASSIGNMENTS ', response.data)
         } else {
            message.error(response.message)
            console.log('ERROR ', response.message)
         }
         dispatch(HideLoading())
         if (response.data.length === 0) {
            setThisMessage('No assignments set yet')
         }
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
         console.log(error.message)
      }
   }

   function deleteAssignment(id) {
      alert(id)
      console.log('DELETE CALLED', id)
   }

   const assignmentColumns = [
      {
         title: 'id',
         dataIndex: '_id',
         key: '_id',
      },

      {
         title: 'Date Created',
         dataIndex: 'createdAt',
         key: 'createdAt',
         render: (createdAt) => new Date(createdAt).toLocaleDateString(),
      },
      {
         title: 'Assignment Name',
         dataIndex: 'assignmentTitle',
         key: 'assignmentTitle',
      },
      // {
      //    title: 'Quiz Title',
      //    dataIndex: 'quizTitle',
      //    key: 'quizTitle',
      // },
      {
         title: 'Quiz Type',
         dataIndex: 'quizType',
         key: 'quizType',
         render: (quizType) => (
            <span style={{ color: quizType === 'maths' ? 'red' : 'blue' }}>
               {quizType}
            </span>
         ),
      },
      {
         title: 'Class/Group',
         dataIndex: ['groupId', 'groupName'],
         key: 'groupName',
      },
      {
         title: '',
         dataIndex: 'action',
         render: (text, record) => (
            <>
               <i
                  className='ri-information-line'
                  onClick={() => {
                     openStatusModal(record._id)
                  }}
               ></i>
               {'  '}
               <i
                  className='ri-delete-bin-line'
                  onClick={() => deleteAssignment(record._id)}
               ></i>
            </>
         ),
      },
   ]

   useEffect(() => {
      getAllAssignments()
   }, [])

   return (
      <>
         {/* <Greeting title='My Assignments' /> */}
         <h1>Assignments Set By Me</h1>
         <div className='divider'> </div>
         <Space wrap>
            {/* <button onClick={getAllAssignments}>REFRESH DATA</button> */}
            <button
               className='yellowRedButton'
               // onClick={() => navigate('/teacher/set-assignment')}
               onClick={() => setShowSetAssignment(true)}
            >
               + SET ASSIGNMENT
            </button>
         </Space>
         <div className='divider'></div>

         <h1>Assignments set by {user?.name}</h1>
         <div>{thisMessage}</div>
         {/* <div>JSON: {JSON.stringify(assignments)}</div> */}
         <div>LENGTH: {assignments?.length}</div>
         <Table columns={assignmentColumns} dataSource={assignments} />
         {showStatus && (
            <GetAssignmentStatus
               assignmentId={assignmentId}
               visible={showStatus}
               onOk={handleCancel}
               onCancel={handleCancel}
            />
         )}
         {showSetAssignment && (
            <SetAssignment
               getAllAssignments={getAllAssignments}
               onClose={() => setShowSetAssignment(false)}
            />
         )}
      </>
   )
}

export default MyAssignments
