import { useNavigate } from 'react-router-dom'
import { message } from 'antd'

import { Table } from 'antd'
import { Radio, Tabs, Button, Space, Modal } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getAllMultis, deleteMultiById } from '../../_apiCalls/apiMultis'
import { getAllMaths } from '../../_apiCalls/apiMaths'
import { HideLoading, ShowLoading } from '../../redux/loaderSlice'
import MyMultis from './MyMultis'
import MyMaths from './MyMaths'
import MyAssignments from './MyAssignments'
import SetAssignment from './SetAssignment'

export default function MyQuizzes() {
   const navigate = useNavigate()
   const [multis, setMultis] = useState([])
   const [maths, setMaths] = useState([])
   const [showSetAssignment, setShowSetAssignment] = useState(false)
   const [isAssignmentVisible, setIsAssignmentVisible] = useState(false)

   const dispatch = useDispatch()

   const tabs = [
      {
         key: '1',
         label: `My Maths Quizzes`,
         children: <MyMaths />,
      },
      {
         key: '2',
         label: `My Multis`,
         children: <MyMultis />,
      },
   ]

   return (
      <div className='container'>
         <h1>QUIZ DASHBOARD</h1>
         <div className='divider'></div>
         <Space wrap>
            {/* <button
               className='yellowRedButton'
               // onClick={() => navigate('/teacher/set-assignment')}
               onClick={() => setShowSetAssignment(true)}
            >
               + SET ASSIGNMENT
            </button> */}
            <button
               type='default'
               // style={{ background: 'red !important', borderColor: 'yellow' }}
               onClick={() => navigate('/teacher/add-maths')}
               className='yellowRedButton'
            >
               + CREATE MATHS QUIZ
            </button>
            <button
               className='yellowBlueButton'
               onClick={() => navigate('/teacher/add-multi')}
            >
               + CREATE MULTIPLE CHOICE
            </button>
         </Space>

         {showSetAssignment && (
            <SetAssignment onClose={() => setShowSetAssignment(false)} />
         )}

         {/* <SetAssignment
            visible={isAssignmentVisible}
            closeSetAssignment={closeSetAssignment}
         /> */}
         <div className='divider'></div>
         <div>
            <Tabs
               className='ant-customTabs !important'
               defaultActiveKey='1'
               type='card'
               size='large'
               items={tabs}
               centered
               direction='left'
               animated
            />
         </div>

         {/* <MyKids /> */}
      </div>
   )
}
