import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Modal, Input, message, Cascader, Space, Button } from 'antd'
import { useDispatch } from 'react-redux'
import { ShowLoading, HideLoading } from '../../redux/loaderSlice'
import { createAssignment } from '../../_apiCalls/apiAssignments'
import { getAllGroupsByTeacherId } from '../../_apiCalls/apiGroups'
import { getAllMultisByTeacherId } from '../../_apiCalls/apiMultis'
import { getAllMathsByTeacherId } from '../../_apiCalls/apiMaths'
import { useEffect } from 'react'

import moment from 'moment'

function SetAssignment({ onClose, getAllAssignments }) {
   const [group, setGroup] = useState(null)
   const [mathsId, setMathsId] = useState(null)
   const [multiId, setMultiId] = useState(null)
   const [homeworkId, setHomeworkId] = useState(null)
   const [groups, setGroups] = useState([])
   const [maths, setMaths] = useState([])
   const [multis, setMultis] = useState([])
   const [assignmentTitle, setAssignmentTitle] = useState('')
   const dispatch = useDispatch()

   const { user } = useSelector((state) => state.users)

   const getAllGroups = async () => {
      try {
         dispatch(ShowLoading())
         const response = await getAllGroupsByTeacherId(user._id)
         if (response.success) {
            setGroups(response.data)
            console.log('GROUPS ', response.data)
         }
         dispatch(HideLoading())
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   const getAllMaths = async () => {
      try {
         dispatch(ShowLoading())
         const response = await getAllMathsByTeacherId(user._id)
         if (response.success) {
            setMaths(response.data)
            console.log('MATHS ', response.data)
         }
         dispatch(HideLoading())
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   const getAllMultis = async () => {
      try {
         dispatch(ShowLoading())
         const response = await getAllMultisByTeacherId(user._id)
         if (response.success) {
            setMultis(response.data)
            console.log('MULTIS ', response.data)
         }
         dispatch(HideLoading())
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   const handleCreateAssignment = async () => {
      const quizType = homeworkId[0]
      const quizId = homeworkId[1]
      const groupId = group[0]

      console.log('QUIZ TYPE ', quizType)
      console.log('QUIZ ID ', quizId)
      console.log('GROUP ID ', groupId)
      console.log('AssignemtTitle ', assignmentTitle)

      try {
         dispatch(ShowLoading())
         const response = await createAssignment({
            assignmentTitle,
            quizType,
            quizId,
            groupId,
            teacherId: user._id,
         })
         console.log(response)
         if (response.success) {
            message.success(`submitted and ${response.message}`)
            setGroup(null)
            setMathsId(null)
            setMultiId(null)
            onClose()
         } else {
            message.error(response.message)
         }
         dispatch(HideLoading())
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
      getAllAssignments()
   }

   const selectHomework = (value, selectedOptions) => {
      console.log(value, selectedOptions)
      setHomeworkId(value)
   }

   const selectGroup = (value, selectedOptions) => {
      console.log(value, selectedOptions)
      setGroup(value)
   }

   const filter = (inputValue, path) =>
      path.some(
         (option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      )

   useEffect(() => {
      getAllGroups()
      getAllMaths()
      getAllMultis()
   }, [])

   const mathsMapped = maths.map((math) => ({
      value: math._id,
      // label: `${item.gameOptions.title} - ${moment(item.updatedAt).format('LLL')}`,
      label: `${math.gameOptions.title}`,
   }))

   const multisMapped = multis.map((multi) => ({
      value: multi._id,
      // label: `${item.gameOptions.title} - ${moment(item.updatedAt).format('LLL')}`,
      label: `${multi.title}`,
   }))

   const groupsMapped = groups.map((item) => ({
      value: item._id,
      label: `${item.groupName}`,
   }))

   const subjectMap = [
      {
         value: 'maths',
         label: 'Maths',
         children: mathsMapped,
      },
      {
         value: 'multi',
         label: 'Multi-Choice',
         children: multisMapped,
      },
   ]

   const myHomework = homeworkId?.join(', ')
   // console.log('myHomework ', myHomework)

   // console.log('maths ', options)

   return (
      <Modal
         className='card modal-container'
         open={true}
         footer={null}
         // onOk={generateDivs}
         onCancel={onClose}
         width={700}
         style={{
            top: 20,
         }}
      >
         <div>
            <h3>
               <u className='greenFont' style={{ fontFamily: 'Short Stack' }}>
                  Teacher: {user?.name}
               </u>
            </h3>
            <br />

            <h1>SET ASSIGNMENT TO CLASS</h1>
            <br />
            <div className='greenFont' style={{ fontFamily: 'Short Stack' }}>
               {' '}
               Note: The date seen by pupils will be the assignment date. <br />
               (Not the homework creation date).
            </div>

            <div className='optionsBordered card'>
               <h3>Assignment Title: </h3>
               <Input
                  placeholder='Enter Assignment Title'
                  style={{
                     width: '50%',
                     margin: '0 10px',
                  }}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
               />

               <div
                  style={{
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                  }}
               >
                  <div></div>
                  <br />
                  <br />
                  <br />
                  <br />
                  <table
                     style={{
                        margin: '0 auto',
                        width: '50%',
                        textAlign: 'center',
                        borderRadius: '30px',
                        border: 0,
                     }}
                  >
                     <thead>
                        <tr>
                           <th>Class Name</th>
                           <th>Homework</th>
                        </tr>
                     </thead>
                     <tbody>
                        <tr>
                           <td>
                              {' '}
                              <Cascader
                                 options={groupsMapped}
                                 onChange={selectGroup}
                                 placeholder='Select Class/Group'
                                 style={{ fontSize: '64px' }}
                                 showSearch={{
                                    filter,
                                 }}
                                 onSearch={(value) => console.log(value)}
                              />
                           </td>
                           <td>
                              {' '}
                              <Cascader
                                 options={subjectMap}
                                 onChange={selectHomework}
                                 placeholder='Select Homework'
                                 showSearch={{
                                    filter,
                                 }}
                                 onSearch={(value) => console.log(value)}
                              />
                           </td>
                        </tr>
                        <tr>
                           <td>Selected Class Name</td>
                           <td>Selected Homework</td>
                        </tr>
                        <tr>
                           <td>{group}</td>
                           <td>{myHomework}</td>
                        </tr>
                     </tbody>
                  </table>
               </div>
            </div>
            <br />
            <Button onClick={handleCreateAssignment}>Set Homework</Button>

            <br />
            {/* <div>GROUPS: {JSON.stringify(groups)}</div>
         <br />
         <br />
         <div>MULTIS: {JSON.stringify(multis)}</div>
         <br />
         <br />
         <div>MATHS: {JSON.stringify(maths)}</div> */}
         </div>
         {/* <Button onClick={closeSetAssignment}>Close</Button> */}
      </Modal>
   )
}

export default SetAssignment
