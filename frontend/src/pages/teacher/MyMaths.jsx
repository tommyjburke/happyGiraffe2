import { useNavigate } from 'react-router-dom'
import { message } from 'antd'

import { Table } from 'antd'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import {
   getAllMaths,
   deleteMathsById,
   getAllMathsByTeacherId,
} from '../../_apiCalls/apiMaths'
import { HideLoading, ShowLoading } from '../../redux/loaderSlice'
import { Radio, Tabs } from 'antd'

export default function MyMaths() {
   const navigate = useNavigate()
   const [multis, setMultis] = useState([])
   const [maths, setMaths] = useState([])

   const opts = ['x', '/', '+', '-']
   const mappedOpts = (operators) => operators.map((opIndex) => opts[opIndex]).join(' ')

   const dispatch = useDispatch()

   // MUST COMPLY WITH QUIZ MODEL IN BACKEND

   const mathsColumns = [
      // {
      //    title: 'User ID',
      //    dataIndex: ['gameOptions', 'userId'],
      //    key: 'userId',
      // },
      {
         title: 'Title',
         dataIndex: ['gameOptions', 'title'],
         key: 'title',
      },
      {
         title: 'No. Questions',
         dataIndex: ['gameOptions', 'numQuestions'],
         key: 'numQuestions',
      },
      {
         title: 'Operators',
         dataIndex: ['gameOptions', 'operators'],
         key: 'operators',
         render: mappedOpts,
      },
      {
         title: 'Use Countdown',
         dataIndex: ['gameOptions', 'useCountdown'],
         key: 'useCountdown',
         render: (useCountdown) =>
            useCountdown ? (
               <span style={{ color: 'red', backgroundColor: 'yellow' }}>Yes</span>
            ) : (
               'No'
            ),
      },
      {
         title: 'Timer',
         dataIndex: ['gameOptions', 'countdownSeconds'],
         key: 'countdownSeconds',
         render: (countdownSeconds, record) =>
            record.gameOptions.useCountdown ? countdownSeconds : 'N/A',
      },
      // {
      //    title: 'Notes',
      //    dataIndex: ['gameOptions', 'notes'],
      //    key: 'notes',
      //    render: (text) => {
      //       if (!text) {
      //          return 'none'
      //       } else {
      //          return text.substring(0, 10)
      //       }
      //    },
      // },
      {
         title: 'A Range',
         dataIndex: ['gameOptions', 'aValue'],
         key: 'aValue',
         render: (aValue) => `[${aValue.join(', ')}]`,
      },
      {
         title: 'B Range',
         dataIndex: ['gameOptions', 'bValue'],
         key: 'bValue',
         render: (bValue) => `[${bValue.join(', ')}]`,
      },
      {
         // delete and edit //
         title: 'Action',
         dataIndex: 'action',
         render: (text, record) => (
            <div className='flex gap-3'>
               <i
                  className='ri-edit-line'
                  onClick={() => navigate(`/teacher/edit-maths-by-id/${record._id}`)}
               ></i>

               <i
                  className='ri-delete-bin-line'
                  onClick={() => deleteMathsById(record._id)}
               ></i>
            </div>
         ),
      },
   ]

   const getMathsData = async () => {
      try {
         dispatch(ShowLoading())
         const response = await getAllMathsByTeacherId()
         dispatch(HideLoading())
         if (response.success) {
            setMaths(response.data)
            console.log('MathsData: ', response.data)
         } else {
            message.error(response.message)
         }
      } catch (error) {
         dispatch(HideLoading())
         message.error(error.message)
      }
   }

   useEffect(() => {
      getMathsData()
      // eslint-disable-next-line
   }, [])

   return (
      <div>
         <div className='flex justify-between mt-2'>
            <h1>My Maths Quizzes</h1>

            {/* <button
               className='chooseButton flex items-center'
               onClick={() => navigate('/teacher/quiz/add')}
            >
               <i className='ri-add-line'></i>MULTIPLE CHOICE
            </button>
            <button
               className='chooseButton flex items-center'
               onClick={() => navigate('/teacher/add-maths')}
            >
               +MATHS QUIZ
            </button> */}
         </div>
         <div className='divider'></div>

         <Table columns={mathsColumns} dataSource={maths} />
      </div>
   )
}
