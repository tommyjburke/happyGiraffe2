import { Button, Tag, Modal, Table, message, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import { getAssignmentStatusForAllPupils } from '../../_apiCalls/apiAssignments'
import { ShowLoading, HideLoading } from '../../redux/loaderSlice'
import { useDispatch } from 'react-redux'
import moment from 'moment'

const { Search } = Input

function GetAssignmentStatus({ assignmentId, onOk, onCancel }) {
   const [assignmentList, setAssignmentList] = useState([])
   const [thisMessage, setThisMessage] = useState('')
   const dispatch = useDispatch()
   const [filteredData, setFilteredData] = useState(assignmentList)
   const [title, setTitle] = useState('')
   const [numPupils, setNumPupils] = useState(0)

   //    const handleSearch = (value) => {
   //       const filtered =
   //          value === ''
   //             ? assignmentList
   //             : assignmentList.filter((item) =>
   //                  Object.values(item).some((val) =>
   //                     String(val).toLowerCase().includes(value.toLowerCase())
   //                  )
   //               )
   //       setFilteredData(filtered.length > 0 ? filtered : assignmentList)
   //    }

   const columns = [
      {
         title: '',
         key: 'index',
         render: (text, record, rowIndex) => rowIndex + 1,
      },
      {
         title: 'Pupil Name',
         dataIndex: 'pupilName',
         key: 'pupilName',
      },
      {
         title: 'Submitted',
         dataIndex: 'date',
         key: 'date',
         //  render: (date) => <>{moment(date).format('DD/MM/YYYY')}</>,
         render: (date) => (date ? moment(date).format('DD/MM/YYYY') : 'Not Yet'),
      },
      {
         title: 'Status',
         dataIndex: 'status',
         key: 'status',
         render: (status) => (
            <Tag color={status === 'Submitted' ? 'green' : 'red'}>{status}</Tag>
         ),
      },
   ]

   const handleOk = () => {
      console.log('OK')
   }

   const handleCancel = () => {
      console.log('Cancel')
   }

   const getAssignmentStatus = async () => {
      assignmentId = { assignmentId: assignmentId }
      console.log('ASSIGNMENT ID ', assignmentId)
      try {
         dispatch(ShowLoading())
         const response = await getAssignmentStatusForAllPupils(assignmentId)

         if (response.success) {
            setAssignmentList(response)
            console.log('ASSIGNMENTS ', response.data)
            setTitle(response?.assignment.assignmentTitle)
            setNumPupils(response?.data.length)
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

   useEffect(() => {
      getAssignmentStatus()
   }, [])

   const listString = JSON.stringify(assignmentList)

   return (
      <Modal
         className='card'
         //  title='Assignment Status'
         open={true}
         onOk={onOk}
         onCancel={onCancel}
      >
         <h1>Assignment: {title}</h1>
         <h2>Pupils: {numPupils}</h2>

         {/* ASSIGNMENT ID: {assignmentId}
         {JSON.stringify(assignmentList)} */}
         <div>
            {/* <Search
               placeholder='Search'
               onChange={(e) => handleSearch(e.target.value)}
               style={{ width: 200, marginBottom: 16 }}
            /> */}
            <Table dataSource={assignmentList.data} columns={columns} />
         </div>
      </Modal>
   )
}

export default GetAssignmentStatus
